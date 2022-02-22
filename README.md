# opentera-teleop-service

OpenTera Service handling teleoperation sessions based on webrtc.

## Setup Service

```bash
# Clone GitHub repository with submodules
git clone https://github.com/introlab/opentera-teleop-service.git --recurse-submodule

# Go to opentera-teleop-service directory
cd opentera-teleop-service directory

# Create a virtual environment
python3 -m venv venv

# Enable venv
source venv/bin/activate

# Install requirements (service)
pip install -r requirements.txt
# Install requirements (signaling-server)
pip install -r submodules/opentera-webrtc/signaling-server/requirements.txt

```

## Setup Web Portal

```bash
# Go to the webportal directory
cd webportal
# Install dependencies
npm install
# Modify setup according to your configuration
vi .env.production
# Build package
npm run build
# Create a symlink to the index in the static directory
cd ../static
ln -s ../webportal/dist/index.html index.html
```

## Setup Teleop Interface
```bash
# Go to the teleop-vue directory
cd submodules/opentera-webrtc-teleop-frontend/teleop-vue
# Install dependencies
npm install
# Build package
npm run build
# VUE3.js interface should be located in the dist directory
```

## OpenTera Server Configuration

>Make sure the RobotTeleOperationService is activated in the OpenTera Server.
```
Port: 4080
URL : /
External URL: /robot
```
> Make sure you have a 'Robot' Device Type and robot sub types : BEAM, T-TOP, MOVO

> Add a new session type named 'Teleop-Robot'

## Add robots to your fleet

> Add Devices with Type 'Robot' and the desired subtype.

## Example Service configuration

Create a file named **/lib/systemd/system/opentera-teleop.service** containing :

```
[Unit]
Description=OpenTeraTeleopService
After=opentera.service
Requires=opentera.service
PartOf=opentera.service

[Service]
User={user name}
Group={group name}
Environment=PYTHONPATH={YOUR_PATH_HERE}/opentera-teleop-service.git
ExecStart={YOUR_PATH_HERE}/opentera-teleop-service.git/venv/bin/python3 {YOUR_PATH_HERE}/opentera-teleop-service.git/TeleopService.py
WorkingDirectory={YOUR_PATH_HERE}/opentera-teleop-service.git
StandardOutput=syslog+console
StandardError=syslog+console
Restart=always
RestartSec=10s
KillMode=process
KillSignal=SIGINT

[Install]
WantedBy=multi-user.target opentera.service
```
