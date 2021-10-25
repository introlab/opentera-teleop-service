import { createStore } from 'vuex'
import { auth } from './auth.module'
import { websocket } from './websocket.module'
import { api } from './api.module'

export default createStore({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth, websocket, api
  }
})
