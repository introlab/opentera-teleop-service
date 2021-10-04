import AuthService from '../services/opentera_auth'

// const user = JSON.parse(localStorage.getItem('user'))
const user = null
const initialState = user
  ? {
    status: { loggedIn: false },
    user,
    websocket: null,
    websocketState: 'disconnected',
    online_devices: [],
    user_info: {},
    service_info: {}
  }
  : {
    status: { loggedIn: false },
    user: null,
    websocket: null,
    websocketState: 'disconnected',
    online_devices: [],
    user_info: {},
    service_info: {},
    device_type_info: {}
  }

export const auth = {
  namespaced: true,
  state: initialState,
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
    startSession ({ commit, device }) {
      /*
        device is the object containing the robot information returned by getOnlineDevices.
        We will need to star the session by using device.device_uuid
      */
      console.log('startSession with: ', device)
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
        commit('websocketOnError', websocket, error)
      }

      websocket.onmessage = function (message) {
        commit('websocketOnMessage', websocket, message)

        const receivedMessage = message.data
        const jsonMessage = JSON.parse(receivedMessage)
        const msgType = jsonMessage.message.events[0]['@type']

        // console.log('websocketOnMessage', msgType)

        if (msgType === 'type.googleapis.com/opentera.protobuf.JoinSessionEvent') {

        }
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
    userName: (state) => {
      if (state.user_info) {
        console.log('getters userName', state.user_info, state.user_info.user_firstname)
        return state.user_info.user_firstname + ' ' + state.user_info.user_lastname
      }
      return ''
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
    websocketOnError (state, websocket, error) {
      console.log('websocketOnError', error)
      state.websocketState = 'disconnected'
    },
    websocketOnMessage (state, websocket, message) {
      console.log('websocketOnMessage', message)
    },
    logout (state) {
      state.status.loggedIn = false
      state.user = {}
      state.user_info = {}
      state.sertice_info = {}
      state.device_type_info = {}
      if (state.websocket) {
        state.websocket.close()
      }
      state.websocket = null
      state.websocketState = 'disconnected'
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
    }
  }
}
