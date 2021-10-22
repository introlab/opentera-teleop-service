<template>
      <div class="session-time">
            {{ dateTime.hours }}:{{ dateTime.minutes }} [{{elapsedTime.milliseconds}}] {{ sessionInfo }}
      </div>
</template>

<script>

// @ is an alias to /src
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('auth')

export default {
  name: 'ElapsedSessionTime',
  components: {},
  props: {},
  methods: {
    setCurrentTime () {
      this.currentDate = new Date()
    },
    setSessionTime () {
      this.creationTime = new Date()
    }

  },
  data () {
    return {
      creationDate: new Date(),
      currentDate: new Date(),
      timer: undefined
    }
  },
  computed: {
    dateTime () {
      return {
        hours: this.currentDate.getHours(),
        minutes: this.currentDate.getMinutes(),
        seconds: this.currentDate.getSeconds()
      }
    },
    elapsedTime () {
      return {
        milliseconds: this.currentDate - this.creationDate
      }
    },
    // mix the getters into computed with object spread operator
    ...mapGetters(['sessionInfo'])
  },
  beforeMount () {
    // 1000ms timer
    this.timer = setInterval(this.setCurrentTime, 1000)
  },
  afterUnmount () {
    clearInterval(this.timer)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
