<template>
  <div class="container">
    <div class="row">
      <div class="col-md-4 offset-md-4">
        <div class="login-form bg-light mt-4 p-4">
        <form class="row g-3">
          <img src="@/assets/LogoOpenTera.png" alt="Logo">
          <div class="col-12">
            <label for="uname"><b>{{ $t('Username') }}</b></label>
            <input type="text" :placeholder="$t('Enter Username')" class="form-control" v-model="loginInfo.username" required>
          </div>
          <div class="col-12">
            <label for="psw"><b>{{ $t('Password') }}</b></label>
            <input type="password" :placeholder="$t('Enter Password')" class="form-control" v-model="loginInfo.password" required>
          </div>
          <button type="submit" class="btn btn-dark foat-end" @click=loginButtonClicked  :disabled="isDisabled" >{{$t('Login')}}</button>
        </form>
        </div>
        <div class="alert alert-danger" v-if="hasError">
          {{ lastError }}
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

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('auth')

export default {
  name: 'Login',
  props: {
  },
  methods: {
    loginButtonClicked (event) {
      // This is required to avoid the default form submit
      event.preventDefault()

      console.log('buttonClicked')
      this.loading = true

      this.$store.dispatch('auth/login', this.loginInfo).then(
        (user) => {
          this.loginInfo.password = ''
        },
        (error) => {
          console.log('error dispatch login', error.response)
          this.loginInfo.password = ''
          this.hasError = true
        })
    }
  },
  data () {
    return {
      loginInfo: { username: '', password: '' },
      loading: false,
      hasError: false
    }
  },
  computed: {
    isDisabled () {
      return this.loginInfo.username.length === 0 || this.loginInfo.password.length === 0
    },
    // mix the getters into computed with object spread operator
    ...mapGetters(['lastError', 'isLoggedIn'])
  },
  mounted () {
    console.log('mounted')
  },
  created () {
    if (this.isLoggedIn) {
      console.log('Already logged in')
      this.hasError = false
      this.$router.push('/')
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  background-color: coral;
</style>
