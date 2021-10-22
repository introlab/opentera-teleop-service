<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4 offset-md-4">
        <div class="login-form bg-light mt-4 p-4">
        <form class="row g-3">
          <img src="@/assets/LogoOpenTera.png" alt="Logo">
          <div class="col-12">
            <label for="uname"><b>{{ $t('Username') }}</b></label>
            <input type="text" :placeholder="$t('Enter Username')" class="form-control" v-model="user.username" required>
          </div>
          <div class="col-12">
            <label for="psw"><b>{{ $t('Password') }}</b></label>
            <input type="password" :placeholder="$t('Enter Password')" class="form-control" v-model="user.password" required>
          </div>
          <button type="submit" class="btn btn-dark foat-end" @click=loginButtonClicked  :disabled="isDisabled" >{{$t('Login')}}</button>
        </form>
        </div>
      </div>
    </div>
  </div>
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
  background-color: coral;
</style>
