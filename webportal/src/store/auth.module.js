import AuthService from '../services/opentera_auth'
import router from '../router'

// const user = JSON.parse(localStorage.getItem('user'))

export const auth = {
  namespaced: true,
  state: {
    status: { loggedIn: false },
    user: null,
    websocket: null,
    websocketState: 'disconnected',
    online_devices: [],
    user_info: {},
    service_info: {},
    device_type_info: {},
    session_type_info: {},
    teleop_session_info: {}
  },
  actions: {
    login ({ commit }, loginInfo) {
      return AuthService.login(loginInfo).then(
        user => {
          commit('loginSuccess', user)
          // Connect websocket
          console.log('loginSuccess')
          return Promise.resolve(user)
        },
        error => {
          commit('loginFailure')
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
        }
      )
    },
    getOnlineDevices ({ commit }) {
      return AuthService.getOnlineDevices(this.state.auth.user).then(
        devices => {
          commit('onlineDeviceStatus', devices)
          return Promise.resolve(devices)
        },
        error => {
          commit('onlineDeviceStatus', [])
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
    }
  },
  getters: {
    onlineRobots: (state) => {
      return state.online_devices
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
    }
  },
  mutations: {
    loginSuccess (state, user) {
      state.status.loggedIn = true
      state.user = user
    },
    loginFailure (state) {
      state.status.loggedIn = false
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

      const msgType = jsonMessage.message.events[0]['@type']
      // console.log('websocketOnMessage', msgType)
      if (msgType === 'type.googleapis.com/opentera.protobuf.JoinSessionEvent') {
        console.log('******************** JoinSessionEvent', jsonMessage.message.events[0])

        // Update state, is this the right way ?
        state.teleop_session_info = jsonMessage.message.events[0]

        // update router page
        router.push('/session')
      }
    },
    logout (state) {
      state.status.loggedIn = false
      state.user = {}
      state.user_info = {}
      state.service_info = {}
      state.device_type_info = {}
      state.session_type_info = {}
      if (state.websocket) {
        state.websocket.close()
      }
      state.websocket = null
      state.websocketState = 'disconnected'
      state.teleop_session_info = {}
    },
    onlineDeviceStatus (state, devices) {
      state.online_devices = devices
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
    }
  }
}
