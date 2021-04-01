# Image: introlab3it/opentera_teleop_service
# LABEL version="0.1"
# LABEL description="OpenTera Test Teleop Service from IntRoLab."
FROM introlab3it/openteraserver

# RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
#        python3-pip python3-venv python3

# Setup Service at root directory
WORKDIR /
RUN git clone --recurse-submodules -b main https://github.com/introlab/opentera-teleop-service.git

# Change shell to bash
SHELL ["/bin/bash", "-c"]

# Build javascript API and copy to signaling-static
WORKDIR /opentera-teleop-service/submodules/opentera-webrtc/opentera-webrtc-web-client
RUN npm install
RUN npm run build:umd
RUN cp dist/* /opentera-teleop-service/signaling-static

# Volumes
VOLUME /opentera-teleop-service/config
VOLUME /opentera-teleop-service/static
VOLUME /opentera-teleop-service/signaling-static

# Create venv
WORKDIR /opentera-teleop-service
RUN $PYTHON3_EXEC -m venv venv

# Install requirements
ENV TELEOP_PYTHON3_EXEC /opentera-teleop-service/venv/bin/python
RUN venv/bin/python3 -m pip install -r requirements.txt
RUN venv/bin/python3 -m pip install -r submodules/opentera-webrtc/signaling-server/requirements.txt
RUN $TELEOP_PYTHON3_EXEC --version

# Commands
CMD nginx -c /opentera/teraserver/python/config/nginx.conf -p /opentera/teraserver/python/config/ && ./start_docker.sh
