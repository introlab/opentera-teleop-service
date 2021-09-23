import AuthService from '../services/opentera_auth'

// const user = JSON.parse(localStorage.getItem('user'))
const user = null
const initialState = user
  ? { status: { loggedIn: true }, user, websocket: null }
  : {
    status: { loggedIn: false },
    user: null,
    websocket: null
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
    connectWebsocket ({ commit }, user) {
      return AuthService.createWebsocket(user).then(

      )
    },
    logout ({ commit }) {
      AuthService.logout()
      commit('logout')
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

    },
    websocketFailure (state) {
      state.websocket = null
      state.user = null
      state.loggedIn = false
    },
    logout (state) {
      state.status.loggedIn = false
      state.user = null
    }
  }
}
