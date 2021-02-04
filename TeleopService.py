from opentera.services.ServiceAccessManager import ServiceAccessManager
from opentera.services.ServiceOpenTera import ServiceOpenTera
from opentera.modules.BaseModule import ModuleNames, create_module_message_topic_from_name, create_module_event_topic_from_name

# Twisted
from twisted.internet import reactor, defer
from twisted.python import log
import opentera.messages.python as messages
import sys
import uuid
import json

from flask_babel import gettext

# Configuration 
from ConfigManager import ConfigManager
from opentera.redis.RedisClient import RedisClient
from opentera.redis.RedisVars import RedisVars

# Modules
from FlaskModule import FlaskModule


class TeleopService(ServiceOpenTera):
    def __init__(self, config_man: ConfigManager, service_info: dict):
        ServiceOpenTera.__init__(self, config_man, service_info)

        # Create REST backend
        self.flaskModule = FlaskModule(config_man)

        # Create twisted service
        self.flaskModuleService = self.flaskModule.create_service()

    @defer.inlineCallbacks
    def register_to_events(self):
        # Need to register to events produced by UserManagerModule
        ret = yield self.subscribe_pattern_with_callback(create_module_event_topic_from_name(
            ModuleNames.USER_MANAGER_MODULE_NAME), self.user_manager_event_received)

        print('register_to_events: ', ret)    

    def notify_service_messages(self, pattern, channel, message):
        pass

    def setup_rpc_interface(self):
        # TODO Update rpc interface
        pass

    def user_manager_event_received(self, pattern, channel, message):
        print('TeleopService - user_manager_event_received', pattern, channel, message)


if __name__ == '__main__':

    # Very first thing, log to stdout
    log.startLogging(sys.stdout)

    print('Starting TeleopService')
    config_man = ConfigManager()
    config_man.load_config('config/TeleopService.json')

    # Retreive configuration from redis
    redis_client = RedisClient(config_man.redis_config)
   
    # Update Service Access information
    ServiceAccessManager.api_user_token_key = redis_client.redisGet(RedisVars.RedisVar_UserTokenAPIKey)
    ServiceAccessManager.api_participant_token_key = redis_client.redisGet(RedisVars.RedisVar_ParticipantTokenAPIKey)
    ServiceAccessManager.api_participant_static_token_key = redis_client.redisGet(RedisVars.RedisVar_ParticipantStaticTokenAPIKey)
    ServiceAccessManager.api_device_token_key = redis_client.redisGet(RedisVars.RedisVar_DeviceTokenAPIKey)
    ServiceAccessManager.api_device_static_token_key = redis_client.redisGet(RedisVars.RedisVar_DeviceStaticTokenAPIKey)
    ServiceAccessManager.config_man = config_man

    # Get service UUID
    service_info = json.loads(redis_client.redisGet(RedisVars.RedisVar_ServicePrefixKey + config_man.service_config['name']))

    print(service_info)

    if service_info is None:
        sys.stderr.write('Error: Unable to get service info from OpenTera Server - is the server running and config '
                         'correctly set in this service?')
        exit(1)
    
    if 'service_uuid' not in service_info:
        sys.stderr.write('OpenTera Server didn\'t return a valid service UUID - aborting.')
        exit(1)

    # Update service_info in configuration
    config_man.service_config['ServiceUUID'] = service_info['service_uuid']
    config_man.service_config['port'] = service_info['service_port']
    config_man.service_config['hostname'] = service_info['service_hostname']

    # Create the service
    service = TeleopService(config_man, service_info)

    # Start App/ reactor events
    reactor.run()

