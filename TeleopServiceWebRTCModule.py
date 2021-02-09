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
                           '--static_folder=' + self.config.webrtc_config['static_folder']]

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
