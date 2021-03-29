echo "Create or update conda venv"
conda install -m -c conda-forge -y -p $PWD/venv python=3.8
echo "Activating venv"
conda activate $PWD/venv
echo "Installing requirements (make sure git submodules are installed)..."
pip install -r $PWD/requirements.txt
pip install -r $PWD/submodules/opentera-webrtc/signaling-server/requirements.txt

