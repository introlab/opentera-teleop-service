<template>
  <form class="login">
    <label for="uname"><b>Username</b></label>
    <input type="text" placeholder="Enter Username" v-model="user.username" required>

    <label for="psw"><b>Password</b></label>
    <input type="password" placeholder="Enter Password" v-model="user.password" required>

    <button type="submit" @click=loginButtonClicked  :disabled="isDisabled" >Login</button>
  </form>
</template>

<script>

// import { mapState } from 'vuex'
// import { mapActions } from 'vuex'
// import { mapMutations } from 'vuex'
// import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  props: {
    msg: String
  },
  methods: {
    loginButtonClicked () {
      console.log('buttonClicked')
      this.handleLogin(this.user)
    },
    handleLogin (user) {
      this.loading = true
      console.log('handleLogin with', user)
      this.$store.dispatch('auth/login', user).then(
        (user) => {
          console.log('websocket_url : ', user.websocket_url)
          // this.$router.push('/')

          // Connect websocket
          this.$store.dispatch('auth/connectWebsocket', user).then(
            (websocket) => {
              console.log(websocket)
            },
            (error) => {
              console.log('error message (websocket) logging out', error)
              this.$store.dispatch('auth/logout')
            }
          )

          // Get Service Info
          this.$store.dispatch('auth/getServiceInfo').then(
            (info) => {
              console.log(info)
            },
            (error) => {
              console.log('error message (service info) logging out', error)
              this.$store.dispatch('auth/logout')
            }
          )

          // Get Device Type Info
          this.$store.dispatch('auth/getDeviceTypeInfo').then(
            (info) => {
              console.log(info)
            },
            (error) => {
              console.log('error message (deviceTypeInfo) logging out', error)
              this.$store.dispatch('auth/logout')
            }
          )

          // Get Session Type Info
          this.$store.dispatch('auth/getSessionTypeInfo').then(
            (info) => {
              console.log(info)
            },
            (error) => {
              console.log('error message (getSessionTypeInfo) logging out', error)
              this.$store.dispatch('auth/logout')
            }
          )

          // Get User info
          this.$store.dispatch('auth/getUserInfo').then(
            (info) => {
              console.log(info, 'will push /')
              this.$router.replace('/')
            },
            (error) => {
              this.loading = false
              console.log('error message (user info) logging out', error)
              this.$store.dispatch('auth/logout')
            }
          )
        },
        (error) => {
          this.loading = false
          console.log('error message (login) logging out', error)
          this.$store.dispatch('auth/logout')
        }
      )
    }
  },
  data () {
    return {
      user: { username: '', password: '' },
      loading: false
    }
  },
  computed: {
    isDisabled () {
      return this.user.username.length === 0 || this.user.password.length === 0
    },
    loggedIn () {
      return this.$store.state.auth.status.loggedIn
    }
  },
  mounted () {
    console.log('mounted')
  },
  created () {
    if (this.loggedIn) {
      // this.$router.push('/')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
