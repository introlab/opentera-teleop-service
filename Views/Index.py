from flask.views import MethodView
from flask import send_from_directory
from FlaskModule import flask_app
from flask import render_template, request, redirect
from werkzeug.exceptions import NotFound


class Index(MethodView):
    # Decorators everywhere?
    # decorators = [auth.login_required]

    def __init__(self, *args, **kwargs):
        print('Index.__init__', args, kwargs)
        self.flaskModule = kwargs.get('flaskModule', None)
        print(self.flaskModule)

    def get(self):
        try:
            return flask_app.send_static_file('index.html')
        except NotFound as e:
            print(e)
            # If the file was not found, send the default index file
            return flask_app.send_static_file('default_index.html')
