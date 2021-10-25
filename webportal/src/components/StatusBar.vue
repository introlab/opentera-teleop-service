<template>

  <div class="collapse" id="navbarToggleExternalContent">
    <div class="bg-dark p-4">
      <h5 class="text-white h4">Collapsed content</h5>
      <span class="text-muted">Toggleable via the navbar brand.</span>
    </div>
  </div>

  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <LocaleChanger></LocaleChanger>
      <ElapsedSessionTime></ElapsedSessionTime>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <b>{{ userName }}</b>
      <!--
      Service: {{serviceInfo.id_service}} DeviceType: {{deviceTypeInfo.id_device_type}} SessionType: {{sessionTypeInfo}}
      -->
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/login">Login</router-link> |
        <router-link to="/stats">Stats</router-link>
      </div>
      <button @click="closeSession" :disabled="!inSession">Disconnect</button>
      <button @click="logoutButtonClicked" :disabled="loggedIn">Logout</button>

    </div>
  </nav>
</template>

<script>

// @ is an alias to /src

import { createNamespacedHelpers } from 'vuex'
import LocaleChanger from '@/components/LocaleChanger.vue'
import ElapsedSessionTime from '@/components/ElapsedSessionTime.vue'

const { mapGetters } = createNamespacedHelpers('api')

export default {
  name: 'StatusBar',
  components: { LocaleChanger, ElapsedSessionTime },
  props: {},
  methods: {
    logoutButtonClicked () {
      console.log('logoutButtonClicked')
      this.$store.dispatch('auth/logout').then(response => {
        console.log('logged Out')
        this.$router.replace('/login')
      })
    },
    closeSession () {
      console.log('closeSession')
      this.$store.dispatch('api/stopSession').then(response => {
        this.$router.replace('/')
      })
    }
  },
  computed: {
    loggedIn () {
      return !this.$store.state.auth.status.loggedIn
    },
    ...mapGetters(['userName', 'serviceInfo', 'deviceTypeInfo', 'sessionTypeInfo', 'inSession', 'sessionInfo', 'allSessions'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
