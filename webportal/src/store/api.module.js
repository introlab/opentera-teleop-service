import AuthService from '../services/opentera_api'
import router from '../router'

export const api = {
  namespaced: true,
  state: {
    online_devices_dict: {},
    user_info: {},
    service_info: {},
    device_type_info: {},
    session_type_info: {},
    teleop_session_info: {},
    current_session: {},
    sessions: []
  },
  actions: {
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
      return AuthService.getAllSessions(this.state.auth.user, this.state.api.user_info).then(
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

      return AuthService.startSession(this.state.auth.user, device, this.state.api.user_info, this.state.api.session_type_info).then(
        session => {
          commit('updateCurrentSession', session)
          return Promise.resolve(session)
        },
        error => {
          commit('updateCurrentSession', {})
          return Promise.reject(error)
        }
      )
    },
    stopSession ({ commit }) {
      return AuthService.stopSession(this.state.auth.user, this.state.api.teleop_session_info).then(
        session => {
          commit('updateCurrentSession', {})
          return Promise.resolve(session)
        },
        error => {
          commit('updateCurrentSession', {})
          return Promise.reject(error)
        }
      )
    },
    joinSessionWithEvent ({ commit }, event) {
      console.log('joinSessionWithEvent', event)
      commit('updateTeleopSession', event)
      router.push('/session')
    },
    stopSessionWithEvent ({ commit }, event) {
      console.log('stopSessionWithEvent', event)
      commit('updateTeleopSession', {})
      commit('updateCurrentSession', {})
      router.push('/')
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
    },
    removeDeviceWithEvent ({ commit }, event) {
      console.log('removeDeviceWithEvent', event)
      commit('updateDeviceRemoval', event.deviceUuid)
    },
    logout ({ commit }) {
      commit('logout')
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
    teleopSession: (state) => {
      return state.teleop_session_info
    },
    currentSession: (state) => {
      return state.current_session
    },
    allSessions: (state) => {
      return state.sessions
    }
  },
  mutations: {
    logout (state) {
      state.user_info = {}
      state.service_info = {}
      state.device_type_info = {}
      state.session_type_info = {}
      state.online_devices_dict = {}
      state.current_session = {}
      state.teleop_session_info = {}
      state.sessions = []
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
      state.current_session = session
    },
    updateTeleopSession (state, session) {
      console.log('updateTeleopSession', session)
      state.teleop_session_info = session
    },
    updateSessions (state, sessions) {
      state.sessions = sessions
    },
    updateDeviceRemoval (state, uuid) {
      delete state.online_devices_dict[uuid]
    }
  }
}
