<template>
      <span v-if="inSession" class="session-time navbar-text">
            {{ elapsedTime }}
      </span>
</template>

<script>

// @ is an alias to /src
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('api')

export default {
  name: 'ElapsedSessionTime',
  components: {},
  props: {},
  methods: {
    updateTimer () {
      setTimeout(() => {
        if (this.inSession) {
          this.currTime = Date.now()
          this.updateTimer()
        }
      }, 1000)
    }
  },
  data () {
    return {
      currTime: new Date(),
      startTime: new Date()
    }
  },
  computed: {
    elapsedTime () {
      return new Date(this.currTime - this.startTime).toISOString().slice(11, 19)
    },
    // mix the getters into computed with object spread operator
    ...mapGetters(['sessionInfo', 'inSession'])
  },
  watch: {
    inSession () {
      if (this.inSession) {
        this.startTime = Date.now()
        this.updateTimer()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .navbar-text {
    padding-right:1rem;
    border-right: 1px solid #333;
    border-color: rgba(0,0,0,.55);
  }
</style>
