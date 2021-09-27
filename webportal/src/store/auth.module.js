import AuthService from '../services/opentera_auth'

// const user = JSON.parse(localStorage.getItem('user'))
const user = null
const initialState = user
  ? {
    status: { loggedIn: false },
    user,
    websocket: null,
    websocketState: 'disconnected',
    online_devices: []
  }
  : {
    status: { loggedIn: false },
    user: null,
    websocket: null,
    websocketState: 'disconnected',
    online_devices: []
  }

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login ({ commit }, user) {
      return AuthService.login(user).then(
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
    connectWebsocket ({ commit }, url) {
      console.log('connectWebsocket at url:', url)
      const websocket = AuthService.createWebsocket(url)

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
      /*
      return AuthService.createWebsocket(url).then(
        websocket => {
          commit('websocketSuccess', websocket)
          console.log('websocketSuccess')
          return Promise.resolve(websocket)
        },
        error => {
          commit('websocketFailure')
          console.log('websocketFailure')
          return Promise.reject(error)
        }
      )
      */
    },
    logout ({ commit }) {
      AuthService.logout()
      commit('logout')
    }
  },
  getters: {
    onlineRobots: (state) => {
      return state.online_devices
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
      state.user = null
      state.websocket = null
    },
    onlineDeviceStatus (state, devices) {
      state.online_devices = devices
    }
  }
}
