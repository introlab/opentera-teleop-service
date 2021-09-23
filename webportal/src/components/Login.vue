<template>
  <div class="login">
    <label for="uname"><b>Username</b></label>
    <input type="text" placeholder="Enter Username" v-model="user.username" required>

    <label for="psw"><b>Password</b></label>
    <input type="password" placeholder="Enter Password" v-model="user.password" required>

    <button type="submit" @click=loginButtonClicked  :disabled="isDisabled" >Login</button>
  </div>
</template>

<script>
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
        () => {
          this.$router.push('/')
        },
        (error) => {
          this.loading = false
          console.log('error message', error)
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
      return this.user.username.length === 0 | this.user.password.length === 0
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
