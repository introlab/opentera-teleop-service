from opentera.services.ServiceConfigManager import ServiceConfigManager, WebRTCConfig


# Build configuration from base classes
class ConfigManager(ServiceConfigManager, WebRTCConfig):

    def validate_webrtc_supp_config(self, config):
        if 'WebRTC' in config:
            required_fields = ['ice_servers', 'static_folder']
            for field in required_fields:
                if field not in config['WebRTC']:
                    print('ERROR: WebRTC Config - missing field :' + field)
                    return False

            # Every field is present, update configuration
            self.webrtc_config = config['WebRTC']
            return True
        # Invalid
        return False

    def validate_config(self, config_json):
        return super().validate_config(config_json) and self.validate_webrtc_config(config_json) \
               and self.validate_webrtc_supp_config(config_json)


