<template>
      <div>
          StatusBar User : {{ userName }} Service: {{serviceInfo.id_service}} DeviceType: {{deviceTypeInfo.id_device_type}} SessionType: {{sessionTypeInfo}}
          <button @click="logoutButtonClicked" :disabled="loggedIn">Logout</button>
      </div>
</template>

<script>

// @ is an alias to /src

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('auth')

export default {
  name: 'StatusBar',
  components: {},
  props: {},
  methods: {
    logoutButtonClicked () {
      console.log('logoutButtonClicked')

      this.$store.dispatch('auth/logout').then(response => {
        console.log('logged Out')
        this.$router.replace('/login')
      })
    }
  },
  computed: {
    loggedIn () {
      return !this.$store.state.auth.status.loggedIn
    },
    ...mapGetters(['userName', 'serviceInfo', 'deviceTypeInfo', 'sessionTypeInfo'])
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
