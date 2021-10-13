<template>
  <div class="container">
        <h1>Online Robots</h1>
        <div class="card" style="width: 18rem;">
        <Robot v-for="(robot, index) in onlineRobots " :key=index :data=robot />
        </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Robot from '@/components/Robot.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('auth')
// import { mapGetters } from 'vuex'

export default {
  name: 'RobotList',
  components: { Robot },
  methods: {
    isLoggedIn () {
      return this.$store.state.auth.status.loggedIn
    }
  },
  created () {
    if (this.isLoggedIn()) {
      this.$store.dispatch('auth/getOnlineDevices')
    } else {
      this.$router.push('/login')
    }
  },
  computed: {
    loggedIn () {
      return this.isLoggedIn()
    },
    // mix the getters into computed with object spread operator
    ...mapGetters(['onlineRobots'])
  }

}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
