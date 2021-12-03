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
        <table class="table"><tr>
        <th><router-link to="/" v-if="loggedIn">{{ $t('Home') }}</router-link></th>
        <th><router-link to="/about">{{ $t('About') }}</router-link></th>
        <th><router-link to="/login" v-if="!loggedIn">{{ $t('Login') }}</router-link></th>
        <th><router-link to="/stats" v-if="loggedIn">{{ $t('Sessions') }}</router-link></th>
        </tr></table>
      </div>
      <button @click="closeSession" :disabled="!inSession" v-if="inSession">{{ $t('Stop Session') }}</button>
      <button @click="logoutButtonClicked" :disabled="!loggedIn" v-if="loggedIn && !inSession">{{ $t('Logout') }}</button>

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
    logoutButtonClicked (event) {
      console.log('logoutButtonClicked')
      this.$store.dispatch('auth/logout').then(response => {
        console.log('logged Out')
        this.$router.replace('/login')
      })
    },
    closeSession (event) {
      console.log('closeSession')
      this.$store.dispatch('api/stopSession').then(response => {
        this.$router.replace('/')
      })
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.auth.status.loggedIn
    },
    ...mapGetters(['userName', 'serviceInfo', 'deviceTypeInfo', 'sessionTypeInfo', 'inSession', 'sessionInfo', 'allSessions'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
