# opentera-teleop-service

OpenTera Service handling teleoperation sessions based on webrtc.

## Setup

```bash
# Clone GitHub repository with submodules
git clone https://github.com/introlab/opentera-teleop-service.git --recurse-subdirectory

# Go to opentera-teleop-service directory
cd opentera-teleop-service directory

# Create a virtual environment
python3 -m venv venv

# Enable venv
source venv/bin/activate

# Install requirements (service)
pip install -r requirements.txt
# Install requirements (signaling-server)
pip install -r submodules/opentera-webrtc-teleop/signaling-server/requirements.txt

```
