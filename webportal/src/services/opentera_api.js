import axios from 'axios'
import { w3cwebsocket as W3CWebSocket } from 'websocket'

// This needs to be specified at runtime...
const API_BASE_URL = process.env.VUE_APP_OPENTERA_API_URL

class AuthService {
  async login (loginInfo) {
    console.log('login', loginInfo)
    const response = await axios.get(API_BASE_URL + 'login', {
      auth: {
        username: loginInfo.username,
        password: loginInfo.password
      },
      params: {
        with_websocket: true
      }
    })
    if (response.status === 200) {
      if (response.data.user_token) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }
    }
    console.log('login', response.data)
    return response.data
  }

  async logout (user) {
    if (!user) {
      throw new Error('no user specified')
    }
    const response = await axios.get(API_BASE_URL + 'logout', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      }
    })
    return response.data
  }

  async refreshToken (user) {
    if (!user) {
      throw new Error('no user specified')
    }
    const response = await axios.get(API_BASE_URL + 'refresh_token', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      }
    })
    return response.data
  }

  createWebsocket (url) {
    return new W3CWebSocket(url)
  }

  async getUserInfo (user) {
    if (!user) {
      throw new Error('no user specified')
    }
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
    if (!user) {
      throw new Error('no user specified')
    }
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
    if (!user) {
      throw new Error('no user specified')
    }
    const response = await axios.get(API_BASE_URL + 'devices/online', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      }
    })
    console.log('getOnlineDevices ', response.data)
    return response.data
  }

  async getServiceInfo (user) {
    if (!user) {
      throw new Error('no user specified')
    }
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
    if (!user) {
      throw new Error('no user specified')
    }
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
    if (!user) {
      throw new Error('no user specified')
    }
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

  async startSession (user, devices, userInfo, sessionTypeInfo) {
    if (!user) {
      throw new Error('no user specified')
    }
    console.log('startSession', user, devices, userInfo, sessionTypeInfo)
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
        session_devices: Object.keys(devices),
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
    if (!user) {
      throw new Error('no user specified')
    }
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
    if (!user) {
      throw new Error('no user specified')
    }
    const response = await axios.get(API_BASE_URL + 'sessions', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      },
      params: {
        id_user: userInfo.id_user,
        limit: 50
      }
    })
    console.log('getAllSessions ', response.data)
    return response.data
  }
}

export default new AuthService()
