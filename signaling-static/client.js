/**
    This is a simple client for testing URLs.
**/
(function() {

    let localVideo = document.getElementById('local_video');
    let nameInput = document.getElementById('name_input');
    let passwordInput = document.getElementById('password_input');
    let connectButton = document.getElementById('connect_button');
    let closeButton = document.getElementById('close_button');
    let clientList = document.getElementById('client_list');
    let callAllButton = document.getElementById('call_all_button');
    let hangUpAllButton = document.getElementById('hang_up_all_button');
    let closeAllRoomPeerConnectionsButton = document.getElementById('close_all_room_peer_connections');
    let idInput = document.getElementById('id_input');
    let callOneButton = document.getElementById('call_one_button');
    let remoteVideos = document.getElementById('remote_videos');

    closeButton.disabled = true;
    callAllButton.disabled = true;
    hangUpAllButton.disabled = true;
    closeAllRoomPeerConnectionsButton.disabled = true;
    callOneButton.disabled = true;

    let streamClient = null;

    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }


    function connectStreamClientEvents() {
        streamClient.onSignalingConnectionOpen = () => {
          connectButton.disabled = true;
          closeButton.disabled = false;
        };

        streamClient.onSignalingConnectionClose = async () => {
          connectButton.disabled = false;
          closeButton.disabled = true;
          callAllButton.disabled = true;
          hangUpAllButton.disabled = true;
          closeAllRoomPeerConnectionsButton.disabled = true;
          callOneButton.disabled = true;
        };

        streamClient.onSignalingConnectionError = message => {
          alert(message);
        };

        streamClient.onRoomClientsChange = clients => {
          callAllButton.disabled = !(clients.length > 1 && hangUpAllButton.disabled);
          callOneButton.disabled = callAllButton.disabled;

          clientList.innerHTML = '';
          clients.forEach(client => {
            let li = document.createElement('li');
            li.textContent = client.id + ' - ' + client.name;
            li.style.color = client.isConnected ? 'green' : 'red';
            clientList.appendChild(li);
          });
        };

        streamClient.onAddRemoteStream = (id, name, clientData, stream) => {
          callAllButton.disabled = true;
          hangUpAllButton.disabled = false;
          closeAllRoomPeerConnectionsButton.disabled = false;
          callOneButton.disabled = true;

          let h5 = document.createElement("h5");;
          h5.innerHTML = id + ' - ' + name;
          h5.id = 'h5' + id;

          let video = document.createElement("video");
          video.srcObject = stream;
          video.id = 'video' + id;
          video.autoplay = true;

          remoteVideos.appendChild(h5);
          remoteVideos.appendChild(video);
        };

        streamClient.onClientDisconnect = (id, name, clientData) => {
          callAllButton.disabled = streamClient.isRtcConnected;
          hangUpAllButton.disabled = !streamClient.isRtcConnected;
          closeAllRoomPeerConnectionsButton.disabled = !streamClient.isRtcConnected;
          callOneButton.disabled = streamClient.isRtcConnected;

          remoteVideos.removeChild(document.getElementById('h5' + id));
          remoteVideos.removeChild(document.getElementById('video' + id));
        };
    }


    window.addEventListener('load', async () =>
    {
        let stream = await window.openteraWebrtcWebClient.devices.getDefaultStream();
        localVideo.srcObject = stream;
        localVideo.autoplay = true;

        console.log('window loaded.');
        var port = getParameterByName('port');
        var password = getParameterByName('pwd');
        const path = new URL(window.location);
        const server_url = path.origin + path.pathname.substring(0, path.pathname.lastIndexOf('/'));

        //Signaling server config from url
        const SignalingServerConfiguration = {
            url: server_url + '/socket.io',
            name: 'Anonymous',
            data: {}, // Client custom data
            room: 'chat',
            password: password
        };

        const StreamConfiguration = {
            localStream: localVideo.srcObject, // Optional
            isSendOnly: false
        };

        const RtcConfiguration = {
            iceServers: await window.openteraWebrtcWebClient.iceServers.fetchFromServer(server_url + '/iceservers', password)
        };

        let logger = (...args) => console.log(...args);

        streamClient = new window.openteraWebrtcWebClient.StreamClient(SignalingServerConfiguration,
                            StreamConfiguration, RtcConfiguration, logger);

        connectStreamClientEvents();

        await streamClient.connect();


        closeButton.onclick = () => {
            streamClient.close();
            clientList.innerHTML = '';
            remoteVideos.innerHTML = '';
        };

        callAllButton.onclick = () => {
            streamClient.callAll();
        };

        hangUpAllButton.onclick = () => {
            streamClient.hangUpAll();
        };

        closeAllRoomPeerConnectionsButton.onclick = () => {
            streamClient.closeAllRoomPeerConnections();
        };

        callOneButton.onclick = () => {
            streamClient.callIds([idInput.value]);
        }

    });

})();