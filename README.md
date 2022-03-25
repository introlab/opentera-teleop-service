# opentera-teleop-service

OpenTera Service handling teleoperation sessions based on webrtc.

## Setup Service

```bash
# Clone GitHub repository with submodules
git clone https://github.com/introlab/opentera-teleop-service.git --recurse-submodule

# Go to opentera-teleop-service directory
cd opentera-teleop-service directory
```

### Setup Virtual Environment with Python venv

```bash
# Create a virtual environment
python3 -m venv venv
# Enable venv
source venv/bin/activate
# Install requirements (service)
pip install -r requirements.txt
# Install requirements (signaling-server, opentera)
pip install -r submodules/opentera-webrtc-teleop-frontend/teleop-vue/submodules/opentera-webrtc/requirements.txt
pip install -r submodules/opentera-webrtc-teleop-frontend/teleop-vue/submodules/opentera-webrtc/signaling-server/requirements.txt

```

### OR Setup Virtual Environment with conda
```bash
./create_conda_venv.sh
```

### Build Service with CMake

> Modify setup according to your configuration

```bash
vi webportal/.env.production
```

> This command will compile opentera-webrtc python library, build webportal and teleop-frontend
```bash
mkdir build
cd build
cmake ../
make

# Create a symlink to the index in the static directory
cd ../static
ln -s ../webportal/dist/index.html index.html
```

## OpenTera Server Configuration

> Make sure the RobotTeleOperationService is activated in the OpenTera Server.
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
