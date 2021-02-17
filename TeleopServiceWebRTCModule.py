from opentera.services.modules.WebRTCModule import WebRTCModule
from opentera.services.ServiceConfigManager import ServiceConfigManager
import os
import subprocess


class TeleopServiceWebRTCModule(WebRTCModule):
    def __init__(self, config: ServiceConfigManager):
        # Default init
        WebRTCModule.__init__(self, config)

    def launch_node(self, port, key, owner, users, participants, devices):

        # Read specific configurations
        # parser.add_argument('--port', type=int, help='Choose the port', default=8080)
        # parser.add_argument('--password', type=str, help='Choose the password', default=None)
        # parser.add_argument('--ice_servers', type=str, help='Choose the ice servers json file', default=None)
        # parser.add_argument('--static_folder', type=str, help='Choose the static folder', default=None)

        executable_args = [self.config.webrtc_config['executable'],
                           self.config.webrtc_config['script'],
                           '--port=' + str(port),
                           '--password=' + str(key),
                           '--ice_servers=' + self.config.webrtc_config['ice_servers'],
                           '--static_folder=' + self.config.webrtc_config['static_folder'],
                           '--template_folder=' + self.config.webrtc_config['template_folder']]

        # stdout=os.subprocess.PIPE, stderr=os.subprocess.PIPE)
        try:
            process = subprocess.Popen(executable_args,
                                       cwd=os.path.realpath(self.config.webrtc_config['working_directory']))

            # One more process
            self.processList.append({'process': process,
                                     'port': port,
                                     'key': key,
                                     'owner': owner,
                                     'users': users,
                                     'participants': participants,
                                     'devices': devices})

            self.logger.log_info(self.module_name, 'launch_node', executable_args, 'pid', str(process.pid))

            print(self.module_name + ' - started process', process)
            return True
        except OSError as e:
            print(self.module_name + ' - error starting process:', e)

        return False

    def create_webrtc_session(self, room_name, owner_uuid, users: list, participants: list, devices: list):
        # make sure we kill sessions already started with this owner_uuid or room name
        self.terminate_webrtc_session_with_owner_uuid(owner_uuid)
        self.terminate_webrtc_session_with_room_name(room_name)

        # Get next available port
        port = self.get_available_port()
        key = room_name

        print(self.module_name + ' - Should create WebRTC session with name:', room_name, port, key)

        if port:
            url_users = 'https://' + self.config.webrtc_config['hostname'] + ':' \
                        + str(self.config.webrtc_config['external_port']) \
                        + '/webrtc_teleop/' + str(port) + '/users?key=' + key

            url_participants = 'https://' + self.config.webrtc_config['hostname'] + ':' \
                               + str(self.config.webrtc_config['external_port']) \
                               + '/webrtc_teleop/' + str(port) + '/participants?key=' + key

            url_devices = 'https://' + self.config.webrtc_config['hostname'] + ':' \
                          + str(self.config.webrtc_config['external_port']) \
                          + '/webrtc_teleop/' + str(port) + '/devices?key=' + key

            if self.launch_node(port=port, key=key, owner=owner_uuid,
                                users=users, participants=participants, devices=devices):
                result = {'url_users': url_users,
                          'url_participants': url_participants,
                          'url_devices': url_devices,
                          'key': key,
                          'port': port,
                          'owner': owner_uuid,
                          'users': users,
                          'participants': participants,
                          'devices': devices}

                print(result)

                # Return url
                return True, result
            else:
                return False, {'error': 'Process not launched.'}
        else:
            return False, {'error': 'No available port left.'}
