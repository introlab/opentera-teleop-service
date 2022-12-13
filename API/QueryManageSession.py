import datetime

from flask import request
from flask_restx import Resource
from flask_babel import gettext
from FlaskModule import default_api_ns as api
from opentera.services.ServiceAccessManager import ServiceAccessManager
import Globals
import json

# Parser definition(s)
post_parser = api.parser()
post_parser.add_argument('token', type=str, help='Secret Token')

manage_session_schema = api.schema_model('session_manage', {
    'type': 'object',
    'properties': {
        'session_uuid': {
            'type': 'string'
        },
        'action': {
            'type': 'string'
        }
    },
    'required': ['session_uuid']
})


class QueryManageSession(Resource):

    def __init__(self, _api, *args, **kwargs):
        Resource.__init__(self, _api, *args, **kwargs)
        self.module = kwargs.get('flaskModule', None)

    @api.expect(manage_session_schema, validate=True)
    @api.expect(post_parser)
    @api.doc(description='Manage a specific session',
             responses={200: 'Success',
                        500: 'Required parameter is missing',
                        501: 'Not implemented.',
                        403: 'Logged user doesn\'t have permission to access the requested data'})
    @ServiceAccessManager.token_required(allow_dynamic_tokens=True, allow_static_tokens=False)
    def post(self):

        if 'action' not in request.json:
            return gettext('Missing action', 400)

        if request.json['action'] == 'stop':
            params = {'session_manage': {
                'action': 'stop',
                'session_uuid': request.json['session_uuid']
                }
            }

            result = Globals.service.post_to_opentera('/api/service/sessions/manager', params)

            if result.status_code == 200:
                return json.loads(result.text)
            else:
                return gettext('Invalid session'), 400
        else:
            # TODO implement other session management actions
            return gettext('Action not implemented'), 501

