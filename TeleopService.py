# Twisted
from twisted.internet import reactor, defer
from twisted.python import log
import opentera.messages.python as messages
import sys
import uuid
import json
from json.decoder import JSONDecodeError

from flask_babel import gettext

# Configuration
from ConfigManager import ConfigManager
from opentera.redis.RedisClient import RedisClient
from opentera.redis.RedisVars import RedisVars

# Modules
from FlaskModule import FlaskModule

# Local
from opentera.services.BaseWebRTCService import BaseWebRTCService
from TeleopServiceWebRTCModule import TeleopServiceWebRTCModule


class TeleopService(BaseWebRTCService):
    def __init__(self, config_man: ConfigManager, service_info: dict):
        BaseWebRTCService.__init__(self, config_man, service_info)

        # Create REST backend
        self.flaskModule = FlaskModule(config_man)

        # Create twisted service
        self.flaskModuleService = self.flaskModule.create_service()

        # Create WebRTCModule
        self.webRTCModule = TeleopServiceWebRTCModule(config_man)

    def notify_service_messages(self, pattern, channel, message):
        pass

    def setup_rpc_interface(self):
        super().setup_rpc_interface()
        # TODO ADD more rpc interface here


if __name__ == '__main__':

    # Very first thing, log to stdout
    log.startLogging(sys.stdout)

    print('Starting TeleopService')
    config_man = ConfigManager()
    config_man.load_config('config/TeleopService.json')

    # Retrieve configuration from redis
    redis_client = RedisClient(config_man.redis_config)

    # Get service UUID
    service_info = redis_client.redisGet(RedisVars.RedisVar_ServicePrefixKey +
                                                 config_man.service_config['name'])

    if service_info is None:
        sys.stderr.write('Error: Unable to get service info from OpenTera Server - is the server running and config '
                         'correctly set in this service?')
        exit(1)

    # Get service UUID
    try:
        service_info = json.loads(service_info)
        if 'service_uuid' not in service_info:
            sys.stderr.write('OpenTera Server didn\'t return a valid service UUID - aborting.')
            exit(1)
    except JSONDecodeError as e:
        sys.stderr.write('Invalid JSON for service configuration', e)
        exit(1)

    print('**************** service_info : ', service_info)
    # Update service_info in configuration
    config_man.service_config['ServiceUUID'] = service_info['service_uuid']
    config_man.service_config['port'] = service_info['service_port']
    config_man.service_config['hostname'] = service_info['service_hostname']

    # Create the service
    service = TeleopService(config_man, service_info)

    # Start App/ reactor events
    reactor.run()

