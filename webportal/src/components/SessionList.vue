<template>
  <div class="container h-100 w-100">
      <div class="table">
      <thead>
            <tr>Sessions</tr>
      </thead>
      <tbody>
      <Session v-for="(session, index) in allSessions " :key=index :data=session />
      </tbody>
      </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Session from '@/components/Session.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('auth')
// import { mapGetters } from 'vuex'

export default {
  name: 'SessionList',
  components: { Session },
  methods: {
    isLoggedIn () {
      return this.$store.state.auth.status.loggedIn
    }
  },
  created () {
    if (this.isLoggedIn()) {
      this.$store.dispatch('auth/getSessions')
    } else {
      this.$router.push('/login')
    }
  },
  computed: {
    loggedIn () {
      return this.isLoggedIn()
    },
    // mix the getters into computed with object spread operator
    ...mapGetters(['allSessions'])
  }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
