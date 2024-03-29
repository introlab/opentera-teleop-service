import AuthService from '../services/opentera_api'
import router from '../router'

// const user = JSON.parse(localStorage.getItem('user'))

export const auth = {
  namespaced: true,
  state: {
    status: { loggedIn: false, error: null },
    user: null,
    timer_interval: null
  },
  actions: {
    login ({ commit }, loginInfo) {
      return AuthService.login(loginInfo).then(
        user => {
          console.log('login returned', user)

          // This needs to be done before dispatching other actions.
          commit('loginSuccess', user)

          Promise.all([
            // Connect websocket
            this.dispatch('websocket/connectWebsocket', user.websocket_url),
            // Get Service Info
            this.dispatch('api/getServiceInfo'),
            // Get Device Type info
            this.dispatch('api/getDeviceTypeInfo'),
            // Get Session Type info
            this.dispatch('api/getSessionTypeInfo'),
            // Get User info
            this.dispatch('api/getUserInfo')
          ]).then(() => {
            router.replace('/')
            return Promise.resolve(user)
          }).catch((error) => {
            console.log('Error in login action', error)
            commit('logout')
            return Promise.reject(error)
          })
        },
        error => {
          console.log('action login failure')
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
      console.log('dispatch auth/refreshToken')
      return AuthService.refreshToken(this.state.auth.user).then(
        token => {
          // console.log('new token obtained', token.refresh_token)
          commit('updateToken', token.refresh_token)
          return Promise.resolve(token)
        },
        error => {
          console.log('Error refreshing token', error)
          commit('logout')
          return Promise.reject(error)
        }
      )
    }
  },
  getters: {
    lastError: (state) => {
      if (state.status.error) {
        return state.status.error.response.data
      } else {
        return ''
      }
    },
    isLoggedIn: (state) => {
      return state.status.loggedIn
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
    logout (state) {
      state.status.loggedIn = false
      state.status.error = null
      state.user = {}

      // Close web socket
      this.dispatch('api/logout')
      this.dispatch('websocket/logout')

      if (state.timer_interval) {
        clearInterval(state.timer_interval)
        state.timer_interval = null
      }
    },
    updateToken (state, token) {
      console.log('updateToken', token)
      state.user.user_token = token
    }
  }
}
