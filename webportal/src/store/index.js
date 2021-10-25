import { createStore } from 'vuex'
import { auth } from './auth.module'
import { websocket } from './websocket.module'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth, websocket
  }
})
