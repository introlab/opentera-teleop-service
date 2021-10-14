import axios from 'axios'
import { w3cwebsocket as W3CWebSocket } from 'websocket'

// This needs to be specified at runtime...
const API_BASE_URL = 'https://telesante.3it.usherbrooke.ca:40075/api/user/'

class AuthService {
  login (loginInfo) {
    return axios.get(API_BASE_URL + 'login', {
      auth: {
        username: loginInfo.username,
        password: loginInfo.password
      }
    }).then(response => {
      if (response.data.user_token) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }
      return response.data
    })
  }

  logout (user) {
    return axios.get(API_BASE_URL + 'logout', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      }
    }).then(response => {
      return response.data
    })
  }

  refreshToken (user) {
    return axios.get(API_BASE_URL + 'refresh_token', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      }
    }).then(response => {
      return response.data
    })
  }

  createWebsocket (url) {
    return new W3CWebSocket(url)
  }

  getUserInfo (user) {
    return axios.get(API_BASE_URL + 'users', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      },
      params: {
        user_uuid: user.user_uuid
      }
    }).then(response => {
      console.log('getUserInfo ', response.data)
      return response.data
    })
  }

  getOnlineDevices (user) {
    return axios.get(API_BASE_URL + 'devices/online', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      }
    }).then(response => {
      console.log('getOnlineDevices ', response.data)
      return response.data
    })
  }

  getServiceInfo (user) {
    return axios.get(API_BASE_URL + 'services', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      },
      params: {
        key: 'RobotTeleOperationService',
        list: true
      }
    }).then(response => {
      console.log('getServices ', response.data)
      return response.data
    })
  }

  getDeviceTypeInfo (user) {
    return axios.get(API_BASE_URL + 'devicetypes', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      },
      params: {
        device_type_key: 'robot',
        list: true
      }
    }).then(response => {
      console.log('getDeviceTypeInfo ', response.data)
      return response.data
    })
  }

  getSessionTypesInfo (user) {
    return axios.get(API_BASE_URL + 'sessiontypes', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      },
      params: {
        list: true
      }
    }).then(response => {
      console.log('getSessionTypesInfo ', response.data)
      return response.data
    })
  }

  startSession (user, device, userInfo, sessionTypeInfo) {
    console.log('startSession', user, device, userInfo, sessionTypeInfo)
    return axios.post(API_BASE_URL + 'sessions/manager', {
      session_manage: {
        /* ID session must be 0 to create a new session */
        id_session: 0,
        /* Use id_service from sessionTypeInfo */
        id_service: sessionTypeInfo.id_service,
        /* Use session type from sessionTypeInfo  (Should be Teleop-Robot) */
        id_session_type: sessionTypeInfo.id_session_type,
        /* Creator is ourself */
        // id_creator_user: userInfo.id_user,
        /* Invited users */
        session_users: [userInfo.user_uuid],
        /* No invited participants */
        session_participants: [],
        /* Invited devices */
        session_devices: [device.device_uuid],
        action: 'start',
        parameters: ''
      }
    },
    {
      headers: {
        Authorization: 'OpenTera ' + user.user_token,
        'Content-Type': 'application/json'
      }
    }
    ).then(response => {
      console.log('startSession ', response.data)
      return response.data
    })
  }

  stopSession (user, session) {
    console.log('stopSession', user, session)
    return axios.post(API_BASE_URL + 'sessions/manager', {
      session_manage: {
        session_uuid: session.sessionUuid,
        action: 'stop',
        parameters: ''
      }
    },
    {
      headers: {
        Authorization: 'OpenTera ' + user.user_token,
        'Content-Type': 'application/json'
      }
    }
    ).then(response => {
      console.log('stopSession ', response.data)
      return response.data
    })
  }

  getAllSessions (user, userInfo) {
    return axios.get(API_BASE_URL + 'sessions', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      },
      params: {
        id_user: userInfo.id_user
      }
    }).then(response => {
      console.log('getAllSessions ', response.data)
      return response.data
    })
  }
}

export default new AuthService()
