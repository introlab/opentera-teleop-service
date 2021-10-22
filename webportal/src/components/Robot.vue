<template>
  <div class="card mx-auto my-auto" style="width: 18rem;">
    <div class="card-body">
          <h5 class="card-header bg-info">{{ data.device_name }}</h5>
          <!-- <h6 class="card-subtitle mt-2 mb-2 text-muted">{{data.device_uuid}}</h6> -->
          <img src="@/assets/robot.png" class="card-img-top" alt="data.device_uuid">
          <!--
          <p><b>Status</b> : {{ data.device_status }}</p>
          -->
           <ul class="list-group list-group-flush">
              <li class="list-group-item"><b>Batt:</b> {{statusObject.battery}} V</li>
              <li class="list-group-item"><b>Charging:</b> {{statusObject.flag}}</li>
              <li class="list-group-item"><b>Last Update:</b> {{timestamp}}</li>
          </ul>

          <div class="card-footer text-muted">
            <button class="btn btn-primary" @click="buttonClicked" :disabled="isBusy"> Connect </button>
          </div>
    </div>
  </div>
</template>

<script>

// @ is an alias to /src

export default {
  name: 'Robot',
  components: {},
  props: { data: Object },
  methods: {
    buttonClicked () {
      console.log('Robot:buttonClicked')
      // Start a session
      this.$store.dispatch('auth/startSession', this.data).then(
        (session) => {
          console.log('Robot newSession:', session)
        },
        (error) => {
          console.log('Robot errorSession', error)
        }
      )

      // this.$router.push('/session')
    }
  },
  computed: {
    isBusy () {
      return this.data.device_busy
    },
    timestamp () {
      try {
        return new Date().toString(this.data.device_status.status.timestamp)
      } catch (err) {
        return new Date().toString()
      }
    },
    statusObject () {
      try {
        return JSON.parse(this.data.device_status.status.status)
      } catch (err) {
        return {}
      }
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
