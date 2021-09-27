import axios from 'axios'
import { w3cwebsocket as W3CWebSocket } from 'websocket'

// This needs to be specified at runtime...
const API_BASE_URL = 'https://telesante.3it.usherbrooke.ca:40075/api/user/'

class AuthService {
  login (user) {
    return axios.get(API_BASE_URL + 'login', {
      auth: {
        username: user.username,
        password: user.password
      }
    }).then(response => {
      if (response.data.user_token) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }
      return response.data
    })
  }

  createWebsocket (url) {
    return new W3CWebSocket(url)
  }

  getOnlineDevices (user) {
    return axios.get(API_BASE_URL + 'devices/online', {
      headers: {
        Authorization: 'OpenTera ' + user.user_token
      }
    }).then(response => {
      console.log('getOnlineDevices ', response.data)
      return response.data
    })
  }
}

export default new AuthService()
