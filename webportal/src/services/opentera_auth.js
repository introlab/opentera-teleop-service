import axios from 'axios'
import { w3cwebsocket as W3CWebSocket } from 'websocket'

// This needs to be specified at runtime...
const API_BASE_URL = process.env.VUE_APP_OPENTERA_API_URL

class AuthService {
  async login (loginInfo) {
    const response = await axios.get(API_BASE_URL + 'login', {
      auth: {
        username: loginInfo.username,
        password: loginInfo.password
      }
    })
    if (response.data.user_token) {
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
  }

  async logout (user) {
    if (user) {
      const response = await axios.get(API_BASE_URL + 'logout', {
        headers: {
          Authorization: 'OpenTera ' + user.user_token
        }
      })
      return response.data
    } else {
      return Promise.reject(new Error('No user specified'))
    }
  }

  async refreshToken (user) {
    if (user) {
      const response = await axios.get(API_BASE_URL + 'refresh_token', {
        headers: {
          Authorization: 'OpenTera ' + user.user_token
        }
      })
      return response.data
    } else {
      return Promise.reject(new Error('No user specified'))
    }
  }

  createWebsocket (url) {
    return new W3CWebSocket(url)
  }

  async getUserInfo (user) {
    const response = await axios.get(API_BASE_URL + 'users', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      },
      params: {
        user_uuid: user.user_uuid
      }
    })
    console.log('getUserInfo ', response.data)
    return response.data
  }

  async getDeviceInfo (user, deviceUuid) {
    const response = await axios.get(API_BASE_URL + 'devices', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      },
      params: {
        device_uuid: deviceUuid
      }
    })
    console.log('getDeviceInfo ', response.data)
    return response.data
  }

  async getOnlineDevices (user) {
    const response = await axios.get(API_BASE_URL + 'devices/online', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      }
    })
    console.log('getOnlineDevices ', response.data)
    return response.data
  }

  async getServiceInfo (user) {
    const response = await axios.get(API_BASE_URL + 'services', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      },
      params: {
        key: 'RobotTeleOperationService',
        list: true
      }
    })
    console.log('getServices ', response.data)
    return response.data
  }

  async getDeviceTypeInfo (user) {
    const response = await axios.get(API_BASE_URL + 'devicetypes', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      },
      params: {
        device_type_key: 'robot',
        list: true
      }
    })
    console.log('getDeviceTypeInfo ', response.data)
    return response.data
  }

  async getSessionTypesInfo (user) {
    const response = await axios.get(API_BASE_URL + 'sessiontypes', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      },
      params: {
        list: true
      }
    })
    console.log('getSessionTypesInfo ', response.data)
    return response.data
  }

  async startSession (user, device, userInfo, sessionTypeInfo) {
    console.log('startSession', user, device, userInfo, sessionTypeInfo)
    const response = await axios.post(API_BASE_URL + 'sessions/manager', {
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
    )
    console.log('startSession ', response.data)
    return response.data
  }

  async stopSession (user, session) {
    console.log('stopSession', user, session)
    const response = await axios.post(API_BASE_URL + 'sessions/manager', {
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
    )
    console.log('stopSession ', response.data)
    return response.data
  }

  async getAllSessions (user, userInfo) {
    const response = await axios.get(API_BASE_URL + 'sessions', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      },
      params: {
        id_user: userInfo.id_user
      }
    })
    console.log('getAllSessions ', response.data)
    return response.data
  }
}

export default new AuthService()
