import AuthService from '../services/opentera_api'
import router from '../router'

// const user = JSON.parse(localStorage.getItem('user'))

export const auth = {
  namespaced: true,
  state: {
    status: { loggedIn: false, error: null },
    user: null,
    websocket: null,
    websocketState: 'disconnected',
    online_devices_dict: {},
    user_info: {},
    service_info: {},
    device_type_info: {},
    session_type_info: {},
    teleop_session_info: {},
    sessions: [],
    timer_interval: null
  },
  actions: {
    login ({ commit }, loginInfo) {
      return AuthService.login(loginInfo).then(
        user => {
          console.log('loginSuccess')
          commit('loginSuccess', user)

          Promise.all([
            // Connect websocket
            this.dispatch('auth/connectWebsocket', user),
            // Get Service Info
            this.dispatch('auth/getServiceInfo'),
            // Get Device Type info
            this.dispatch('auth/getDeviceTypeInfo'),
            // Get Session Type info
            this.dispatch('auth/getSessionTypeInfo'),
            // Get User info
            this.dispatch('auth/getUserInfo')
          ]).finally(() => {
            router.replace('/')
          })

          return Promise.resolve(user)
        },
        error => {
          console.log('action login failure')
          // console.log('loginFailure', error)
          commit('loginFailure', error)
          return Promise.reject(error)
        }
      )
    },
    logout ({ commit }) {
      console.log('dispatch auth/logout')
      return AuthService.logout(this.state.auth.user).then(
        retcode => {
          commit('logout')
          console.log('logout')
          return Promise.resolve(retcode)
        },
        error => {
          commit('logout')
          console.log('logout error', error)
          return Promise.reject(error)
        })
    },
    refreshToken ({ commit }) {
      // console.log('dispatch auth/refreshToken')
      return AuthService.refreshToken(this.state.auth.user).then(
        token => {
          // console.log('new token obtained', token.refresh_token)
          commit('updateToken', token.refresh_token)
          return Promise.resolve(token.refresh_token)
        },
        error => {
          console.log('Error refreshing token', error)
          commit('logout')
          return Promise.reject(error)
        }
      )
    },
    getOnlineDevices ({ commit }) {
      return AuthService.getOnlineDevices(this.state.auth.user).then(
        devices => {
          commit('updateOnlineDevices', devices)
          return Promise.resolve(devices)
        },
        error => {
          commit('updateOnlineDevices', [])
          return Promise.reject(error)
        }
      )
    },
    getUserInfo ({ commit }) {
      return AuthService.getUserInfo(this.state.auth.user).then(
        info => {
          commit('updateUserInfo', info)
          return Promise.resolve(info)
        },
        error => {
          commit('updateUserInfo', {})
          return Promise.reject(error)
        }
      )
    },
    getServiceInfo ({ commit }) {
      return AuthService.getServiceInfo(this.state.auth.user).then(
        info => {
          commit('updateServiceInfo', info)
          return Promise.resolve(info)
        },
        error => {
          commit('updateServiceInfo', {})
          return Promise.reject(error)
        }
      )
    },
    getDeviceTypeInfo ({ commit }) {
      return AuthService.getDeviceTypeInfo(this.state.auth.user).then(
        info => {
          commit('updateDeviceTypeInfo', info)
          return Promise.resolve(info)
        },
        error => {
          commit('updateDeviceTypeInfo', {})
          return Promise.reject(error)
        }
      )
    },
    getSessionTypeInfo ({ commit }) {
      return AuthService.getSessionTypesInfo(this.state.auth.user).then(
        info => {
          commit('updateSessionTypeInfo', info)
        },
        error => {
          commit('updateSessionTypeInfo', {})
          return Promise.reject(error)
        }
      )
    },
    getSessions ({ commit }) {
      return AuthService.getAllSessions(this.state.auth.user, this.state.auth.user_info).then(
        sessions => {
          commit('updateSessions', sessions)
        },
        error => {
          commit('updateSessions', [])
          return Promise.reject(error)
        }
      )
    },
    startSession ({ commit }, device) {
      /*
        device is the object containing the robot information returned by getOnlineDevices.
        We will need to star the session by using device.device_uuid
      */
      console.log('startSession with: ', device)

      return AuthService.startSession(this.state.auth.user, device, this.state.auth.user_info, this.state.auth.session_type_info).then(
        session => {
          commit('updateCurrentSession', session)
        },
        error => {
          commit('updateCurrentSession', {})
          return Promise.reject(error)
        }
      )
    },
    stopSession ({ commit }) {
      return AuthService.stopSession(this.state.auth.user, this.state.auth.teleop_session_info).then(
        session => {
          commit('updateCurrentSession', {})
        },
        error => {
          commit('updateCurrentSession', {})
          return Promise.reject(error)
        }
      )
    },
    connectWebsocket ({ commit }, user) {
      console.log('connectWebsocket at url:', user.websocket_url)
      const websocket = AuthService.createWebsocket(user.websocket_url)

      // Connect events from websocket
      websocket.onopen = function () {
        commit('websocketOnOpen', websocket)
      }

      websocket.onclose = function () {
        commit('websocketOnClose', websocket)
      }

      websocket.onerror = function (error) {
        commit('websocketOnError', { websocket, error })
      }

      websocket.onmessage = function (message) {
        const receivedMessage = message.data
        const jsonMessage = JSON.parse(receivedMessage)
        commit('websocketOnMessage', { websocket, jsonMessage })
      }

      commit('websocketSuccess', websocket)

      return Promise.resolve(websocket)
    },
    getDeviceInfo ({ commit }, deviceUuid) {
      console.log('getDeviceInfo', deviceUuid)
      return AuthService.getDeviceInfo(this.state.auth.user, deviceUuid).then(
        deviceInfo => {
          commit('updateDeviceInfo', deviceInfo)
        },
        error => {
          commit('updateDeviceInfo', {})
          return Promise.reject(error)
        }
      )
    }
  },
  getters: {
    onlineRobots: (state) => {
      // create array from device dict
      const devices = []
      for (const [, value] of Object.entries(state.online_devices_dict)) {
        devices.push(value)
      }
      return devices
    },
    userInfo: (state) => {
      return state.user_info
    },
    serviceInfo: (state) => {
      return state.service_info
    },
    deviceTypeInfo: (state) => {
      return state.device_type_info
    },
    sessionTypeInfo: (state) => {
      return state.session_type_info
    },
    userName: (state) => {
      if ('user_firstname' in state.user_info && 'user_lastname' in state.user_info) {
        console.log('getters userName', state.user_info, state.user_info.user_firstname)
        return state.user_info.user_firstname + ' ' + state.user_info.user_lastname
      }
      return ''
    },
    inSession: (state) => {
      return ('sessionUrl' in state.teleop_session_info)
    },
    sessionUrl: (state) => {
      if ('sessionUrl' in state.teleop_session_info) {
        return state.teleop_session_info.sessionUrl
      } else {
        return ''
      }
    },
    sessionInfo: (state) => {
      return state.teleop_session_info
    },
    allSessions: (state) => {
      return state.sessions
    }
  },
  mutations: {
    loginSuccess (state, user) {
      state.status.loggedIn = true
      state.user = user

      // Start timer to update token at every 15 minutes (timer in ms)
      state.timer_interval = setInterval(() => {
        this.dispatch('auth/refreshToken')
      }, 1000 * 60 * 15)
    },
    loginFailure (state, error) {
      state.status.loggedIn = false
      state.status.error = error
      state.user = null
    },
    websocketSuccess (state, websocket) {
      state.websocket = websocket
    },
    websocketFailure (state) {
      state.websocket = null
      state.user = null
      state.loggedIn = false
    },
    websocketOnOpen (state, websocket) {
      console.log('websocketOnOpen')
      state.websocketState = 'connected'
    },
    websocketOnClose (state, websocket) {
      console.log('websocketOnClose')
      state.websocketState = 'disconnected'
    },
    websocketOnError (state, { websocket, error }) {
      console.log('websocketOnError', error)
      state.websocketState = 'disconnected'
    },
    websocketOnMessage (state, { websocket, jsonMessage }) {
      // console.log('websocketOnMessage', jsonMessage)

      jsonMessage.message.events.forEach(event => {
        switch (event['@type']) {
          case 'type.googleapis.com/opentera.protobuf.JoinSessionEvent':
            console.log('******************** JoinSessionEvent', event)
            // Update state, is this the right way ?
            state.teleop_session_info = event
            // update router page
            router.push('/session')
            break

          case 'type.googleapis.com/opentera.protobuf.StopSessionEvent':
            console.log('**************** StopSessionEvent', event)
            state.teleop_session_info = {}
            router.push('/')
            break

          case 'type.googleapis.com/opentera.protobuf.DeviceEvent':
            console.log('-------> Handling : ', event)
            switch (event.type) {
              case 'DEVICE_CONNECTED':
                // Will update all online devices
                this.dispatch('auth/getOnlineDevices')
                break

              case 'DEVICE_DISCONNECTED':
                delete state.online_devices_dict[event.deviceUuid]
                break

              case 'DEVICE_STATUS_CHANGED':
                this.dispatch('auth/getOnlineDevices')
                break
            }
            break

          default:
            console.log('Unhandled event type', event['@type'])
        }
      })
    },
    logout (state) {
      state.status.loggedIn = false
      state.status.error = null
      state.user = {}
      state.user_info = {}
      state.service_info = {}
      state.device_type_info = {}
      state.session_type_info = {}
      state.online_devices_dict = {}
      if (state.websocket) {
        state.websocket.close()
      }
      state.websocket = null
      state.websocketState = 'disconnected'
      state.teleop_session_info = {}
      state.sessions = []

      if (state.timer_interval) {
        clearInterval(state.timer_interval)
        state.timer_interval = null
      }
    },
    updateToken (state, token) {
      console.log('updateToken', token)
      state.user.user_token = token
    },
    updateOnlineDevices (state, devices) {
      // We have an array returned from the API
      // Converting to map object
      console.log('updateOnlineDevices')
      state.online_devices_dict = {}
      devices.forEach(deviceInfo => {
        state.online_devices_dict[deviceInfo.device_uuid] = deviceInfo
      })
    },
    updateDeviceInfo (state, device) {
      console.log('updateDeviceInfo', device)
    },
    updateUserInfo (state, info) {
      console.log('updateUserInfo', state, info[0])
      state.user_info = info[0]
    },
    updateServiceInfo (state, info) {
      console.log('updateServiceInfo', state, info[0])
      state.service_info = info[0]
    },
    updateDeviceTypeInfo (state, info) {
      console.log('updateDeviceTypeInfo', state, info[0])
      state.device_type_info = info[0]
    },
    updateSessionTypeInfo (state, info) {
      // We are getting all session types, let's find 'Teleop-Robot' type for now.
      console.log('updateSessionTypeInfo', state, info[0])

      info.forEach(
        function (sessionType, index) {
          if (sessionType.session_type_name === 'Teleop-Robot') {
            console.log('Teleop-Robot found')
            state.session_type_info = sessionType
          }
        }
      )
    },
    updateCurrentSession (state, session) {
      console.log('currentSession', session)
      state.teleop_session_info = session
    },
    updateSessions (state, sessions) {
      state.sessions = sessions
    }
  }
}
