<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid w-100">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarToggler">
        <div class="col navbar-nav" >
          <router-link class=" nav-item nav-link" to="/" v-if="loggedIn">{{ $t('Home') }}</router-link>
          <router-link class=" nav-item nav-link" to="/login" v-if="!loggedIn">{{ $t('Login') }}</router-link>
          <router-link class=" nav-item nav-link" to="/stats" v-if="loggedIn">{{ $t('Sessions') }}</router-link>
          <router-link class=" nav-item nav-link" to="/about">{{ $t('About') }}</router-link>
          <LocaleChanger></LocaleChanger>
        </div>
        <div class="col navbar-nav centered" v-if=inSession>
          <div><ElapsedSessionTime></ElapsedSessionTime></div>
          <div class="center-div"><button class="btn btn-danger one-line" @click="closeSession" :disabled="!inSession" v-if="inSession">{{ $t('Stop Session') }}</button></div>
          <div v-if="!onSessionPage">
            <button class="btn btn-success one-line" @click="goToSession" :disabled="!inSession" v-if="inSession && !inMultipleRobotsSession">{{ $t('Return to session') }}</button>
            <button class="btn btn-success one-line" @click="goToSession" :disabled="!inSession" v-else-if="inSession">{{ $t('Join session') }}</button>
          </div>
        </div>
        <div v-else-if="hasMultipleSelectedDevices">
          <button class="btn btn-success one-line" @click="startSession">{{ $t('Start session') }}</button>
        </div>
        <div class="col navbar-nav" style="justify-content:right;">
          <div class="dropdown center-menu" style="margin-right:0" v-if="loggedIn">
            <div class="nav-item dropdown">
              <button class="btn btn-outline-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle='dropdown'>
                {{ userName }}
              </button>
              <div class="dropdown-menu">
                <button class="dropdown-item" v-if="!inSession" @click="logoutButtonClicked" href="#">{{ $t('Logout') }}</button>
                <button class="dropdown-item disabled" v-else href="#">{{ $t('Logout') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--
      Service: {{serviceInfo.id_service}} DeviceType: {{deviceTypeInfo.id_device_type}} SessionType: {{sessionTypeInfo}}
      -->
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
    },
    goToSession () {
      this.$router.push('/session')
    },
    startSession () {
      this.$store.dispatch('api/setMultiRobotSession', true)
      this.$store.dispatch('api/startSession', this.selectedDevices).then(
        (session) => {
          console.log('Robot newSession:', session)
        },
        (error) => {
          console.log('Robot errorSession', error)
          this.connecting = false
        }
      )
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.auth.status.loggedIn
    },
    onSessionPage () {
      return this.$route.path.toLowerCase() === '/session' && this.inSession
    },
    ...mapGetters(['userName', 'serviceInfo', 'deviceTypeInfo', 'sessionTypeInfo', 'inSession', 'sessionInfo', 'allSessions', 'selectedDevices', 'hasMultipleSelectedDevices', 'inMultipleRobotsSession'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .nav-link, .one-line {
    white-space: nowrap;
    text-align: center;
  }
  @media (min-width: 960px) {
    .centered {
      display: flex;
      flex-direction: row;
    }
    .centered > div {
      width: 50%;
      display: flex;
      justify-content: left;
      align-items: center;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
    .centered > div:first-child {
      margin-right: 0;            /* space between boxes */
      justify-content: right!important;
    }
    .center-div {
      display: inline-block!important;
      width: max-content!important;
    }
  }
  .centered > div {
    padding-bottom:0.5rem;
  }
  .center-menu {
    display: flex;
    justify-content: center;
  }
  .dropdown-menu.show  {
    width: max-content;
  }
</style>
