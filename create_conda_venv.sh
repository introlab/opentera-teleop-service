echo "Create or update conda venv"
conda install -m -c conda-forge -y -p $PWD/venv python=3.8
echo "Activating venv"
conda activate $PWD/venv
echo "Installing requirements (make sure git submodules are installed)..."
$PWD/venv/bin/pip install -r $PWD/requirements.txt
$PWD/venv/bin/pip install -r $PWD/submodules/opentera-webrtc-teleop-frontend/teleop-vue/submodules/opentera-webrtc/requirements.txt
$PWD/venv/bin/pip install -r $PWD/submodules/opentera-webrtc-teleop-frontend/teleop-vue/submodules/opentera-webrtc/signaling-server/requirements.txt

