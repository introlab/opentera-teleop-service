from opentera.services.modules.WebRTCModule import WebRTCModule
from opentera.services.ServiceConfigManager import ServiceConfigManager
import os
import subprocess
from twisted.internet import task, reactor
import threading
import sys
from urllib.parse import quote
import time


class TeleopServiceWebRTCModule(WebRTCModule):
    def __init__(self, config: ServiceConfigManager, service=None):
        # Default init
        WebRTCModule.__init__(self, config)
        self.service = service

    def poll_signaling_server_process(self, process, port: int, key: str, owner: str, session_info: dict):
        print('poll_signaling_server_process')
        # This function is running on a thread.
        while process.poll() is None:
            stdout_line = process.stdout.readline()
            # Check for signaling server ready
            if stdout_line:
                print(stdout_line)
                if b'======== Running on http://0.0.0.0:' in stdout_line:
                    # The Base Service will receive this message and send invitations
                    print('Publish Ready!')
                    self.redis.publish('webrtc.' + key, 'Ready!')

        print('poll_signaling_server_process - done!')
        thread = threading.currentThread()
        reactor.callFromThread(lambda: thread.join())

    def launch_signaling_server(self, port, key, owner, session_info):

        # Read specific configurations
        executable_args = [
                           # sys.executable,
                           os.path.realpath(self.config.webrtc_config['executable']),
                           '-u',
                           self.config.webrtc_config['script'],
                           '--port=' + str(port),
                           '--password=' + str(key),
                           '--ice_servers=' + self.config.webrtc_config['ice_servers'],
                           '--static_folder=' + self.config.webrtc_config['static_folder']]
        try:
            process = subprocess.Popen(executable_args,
                                       cwd=os.path.realpath(self.config.webrtc_config['working_directory']),
                                       stdout=subprocess.PIPE)

            # Signaling thread read
            signaling_thread = threading.Thread(target=self.poll_signaling_server_process,
                                                args=[process, port, key, owner, session_info])

            # One more process
            self.processList.append({'type': 'signaling_server',
                                     'process': process,
                                     'port': port,
                                     'key': key,
                                     'owner': owner,
                                     'session_info': session_info,
                                     'thread': signaling_thread})

            self.logger.log_info(self.module_name, 'launch_signaling_server', executable_args, 'pid', str(process.pid))

            print(self.module_name + ' - started signaling server process', process)

            # Start thread (reading stdout)
            signaling_thread.start()

            return True
        except OSError as e:
            print(self.module_name + ' - error starting process:', e)

        return False

    def create_webrtc_session(self, session_info):
        room_name = session_info['session_key']
        owner_uuid = session_info['session_creator_uuid']

        # make sure we kill sessions already started with this owner_uuid or room name
        self.terminate_webrtc_session_with_owner_uuid(owner_uuid)
        self.terminate_webrtc_session_with_room_name(room_name)

        # Get next available port
        port = self.get_available_port()
        key = room_name

        print(self.module_name + ' - Should create WebRTC session with name:', room_name, port, key,
              session_info['session_parameters'])

        if port:
            for user_uuid in session_info['session_users']:
                # Get user info
                user_response = self.service.get_from_opentera('/api/service/users',
                                                                {'user_uuid': user_uuid})
                if user_response.status_code != 200:
                    return False, {'error': 'Unable to get user info.'}

            user_info = user_response.json()
            user_name = quote(user_info['user_firstname'] + ' ' + user_info['user_lastname'])


            for robot_device in session_info['session_devices']:
                # Get robot device info
                device_response = self.service.get_from_opentera('/api/service/devices',
                                                          {'device_uuid': robot_device,
                                                           'with_device_type': True,
                                                           'with_device_subtype': True})
                if device_response.status_code != 200:
                    return False, {'error': 'Unable to get device info.'}

            device_info = device_response.json()

            if not 'device_subtype' in device_info:
                return False,  {'error': 'Unable to get device subtype info.'}

            if 'device_subtype_name' in device_info['device_subtype']:
                robot_device_subtype_string = quote(device_info['device_subtype']['device_subtype_name'])
            else:
                robot_device_subtype_string = quote('default')

            url_users = 'https://' + self.config.webrtc_config['hostname'] + ':' \
                        + str(self.config.webrtc_config['external_port']) \
                        + '/webrtc_teleop/' + str(port) + '/#user?pwd=' \
                        + key + '&port=' + str(port) + '&user=1' + '&robot=' + robot_device_subtype_string + '&name=' + user_name

            url_participants = 'https://' + self.config.webrtc_config['hostname'] + ':' \
                               + str(self.config.webrtc_config['external_port']) \
                               + '/webrtc_teleop/' + str(port) + '/#participant?pwd=' + key \
                               + '&port=' + str(port) + '&participant=1' + '&robot=' + robot_device_subtype_string

            url_devices = 'https://' + self.config.webrtc_config['hostname'] + ':' \
                          + str(self.config.webrtc_config['external_port']) \
                          + '/webrtc_teleop/' + str(port) + '/socket.io?pwd=' \
                          + key + '&port=' + str(port) + '&device=1' + '&robot=' + robot_device_subtype_string

            # No need for parameters for signaling server, but will be useful to store session information
            if self.launch_signaling_server(port=port, key=key, owner=owner_uuid,
                                            session_info=session_info):

                result = {'url_users': url_users,
                          'url_participants': url_participants,
                          'url_devices': url_devices,
                          'key': key,
                          'port': port,
                          'owner': owner_uuid
                          }
                # Return url
                return True, result
            else:
                return False, {'error': 'Process not launched.'}
        else:
            return False, {'error': 'No available port left.'}
