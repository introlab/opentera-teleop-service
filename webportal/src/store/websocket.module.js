import AuthService from '../services/opentera_api'
// import router from '../router'

export const websocket = {
  namespaced: true,
  state: {
    websocket: null,
    websocketState: 'disconnected'
  },
  actions: {
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
        commit('websocketOnError', { websocket, error })
      }

      websocket.onmessage = function (message) {
        const receivedMessage = message.data
        const jsonMessage = JSON.parse(receivedMessage)
        commit('websocketOnMessage', { websocket, jsonMessage })
      }

      commit('websocketCreate', websocket)

      return Promise.resolve(websocket)
    },
    logout ({ commit }) {
      commit('logout')
    }
  },
  getters: {
    websocket: (state) => {
      return state.websocket
    }
  },
  mutations: {
    websocketCreate (state, websocket) {
      state.websocket = websocket
    },
    websocketFailure (state) {
      state.websocket = null
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
            // state.teleop_session_info = event
            // update router page
            // router.push('/session')
            this.dispatch('api/joinSessionWithEvent', event)
            break

          case 'type.googleapis.com/opentera.protobuf.StopSessionEvent':
            console.log('**************** StopSessionEvent', event)
            // state.teleop_session_info = {}
            // router.push('/')
            this.dispatch('api/stopSessionWithEvent', event)
            break

          case 'type.googleapis.com/opentera.protobuf.DeviceEvent':
            console.log('-------> Handling : ', event)
            switch (event.type) {
              case 'DEVICE_CONNECTED':
                // Will update all online devices
                this.dispatch('api/getOnlineDevices')
                break

              case 'DEVICE_DISCONNECTED':
                // delete state.online_devices_dict[event.deviceUuid]
                this.dispatch('api/removeDeviceWithEvent', event)
                break

              case 'DEVICE_STATUS_CHANGED':
                this.dispatch('api/getOnlineDevices')
                break
            }
            break

          default:
            console.log('Unhandled event type', event['@type'])
        }
      })
    },
    logout (state) {
      if (state.websocket) {
        state.websocket.close()
      }
      state.websocket = null
      state.websocketState = 'disconnected'
    }
  }
}
