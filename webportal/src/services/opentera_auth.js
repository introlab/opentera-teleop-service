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

  startSession (user, device) {
    return axios.post(API_BASE_URL + 'sessions/manager', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      },
      data: {
        session_manage: {
          /* ID session must be 0 to create a new session */
          id_session: 0,
          /* Hard coded service id */
          id_service: 2,
          /* Hard coded session type for now  2 = Teleop-Robot */
          id_session_type: 2,
          /* Creator is ourself */
          id_creator_user: 0,
          /* Invited users */
          session_users: [user.user_uuid],
          /* Invited devices */
          session_devices: [device.device_uuid],
          action: 'start'
        }
      }
    }).then(response => {
      console.log('startSession ', response.data)
      return response.data
    })
  }
}

export default new AuthService()
