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
        <div class="alert alert-danger" v-if="error">
          {{ error.response.data }}
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
          console.log('handleLogin return', user)
          this.password = ''
        },
        (error) => {
          this.lastError = error
          this.password = ''
        })
    }
  },
  data () {
    return {
      user: { username: '', password: '' },
      loading: false,
      lastError: null
    }
  },
  computed: {
    isDisabled () {
      return this.user.username.length === 0 || this.user.password.length === 0
    },
    loggedIn () {
      return this.$store.state.auth.status.loggedIn
    },
    error () {
      return this.$store.state.auth.status.error
    }
  },
  mounted () {
    console.log('mounted')
  },
  created () {
    if (this.loggedIn) {
      this.$router.push('/')
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  background-color: coral;
</style>
