<template>
  <div class="card mx-auto my-auto" style="width: 20rem;">
    <div class="card-body">
          <h5 class="card-header bg-info">{{ data.device_name }}</h5>
          <!-- <h6 class="card-subtitle mt-2 mb-2 text-muted">{{data.device_uuid}}</h6> -->
          <img src="@/assets/robot.png" class="card-img-top" alt="data.device_uuid">
          <!--
          <p><b>Status</b> : {{ data.device_status }}</p>
          -->
           <ul class="list-group list-group-flush">
              <li class="list-group-item"><b>Batt:</b> {{batteryVoltage}} V, {{batteryCurrent}} A</li>
              <li class="list-group-item"><b>MEM:</b>{{memUsage}}% <b>CPU:</b> {{cpuUsage}}% <b>HDD:</b>{{diskUsage}}%</li>
              <li class="list-group-item"><b>WiFi:</b> {{wifiNetwork}} {{wifiStrength}}% ({{ipAddress}})</li>
              <li class="list-group-item"><b>Charging:</b> {{isCharging}}</li>
              <li class="list-group-item"><b>Last Update:</b> {{timestamp}}</li>
          </ul>

          <div class="card-footer text-muted">
            <button class="btn btn-primary" @click="buttonClicked" :disabled="isBusy"> Connect </button>
          </div>
    </div>
    <!--
    {{statusObject}}
    -->
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
      this.$store.dispatch('api/startSession', this.data).then(
        (session) => {
          console.log('Robot newSession:', session)
        },
        (error) => {
          console.log('Robot errorSession', error)
        }
      )
    }
  },
  computed: {
    isBusy () {
      return this.data.device_busy
    },
    timestamp () {
      try {
        return new Date(this.data.device_status.status.timestamp * 1000).toString()
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
    },
    memUsage () {
      try {
        return Math.round(this.statusObject.memUsage)
      } catch (err) {
        return 0
      }
    },
    cpuUsage () {
      try {
        return Math.round(this.statusObject.cpuUsage)
      } catch (err) {
        return 0
      }
    },
    diskUsage () {
      try {
        return Math.round(this.statusObject.diskUsage)
      } catch (err) {
        return 0
      }
    },
    batteryVoltage () {
      try {
        return this.statusObject.batteryVoltage
      } catch (err) {
        return 0
      }
    },
    batteryCurrent () {
      try {
        return this.statusObject.batteryCurrent
      } catch (err) {
        return 0
      }
    },
    isCharging () {
      try {
        return this.statusObject.isCharging
      } catch (err) {
        return 0
      }
    },
    wifiNetwork () {
      try {
        return this.statusObject.wifiNetwork
      } catch (err) {
        return 0
      }
    },
    wifiStrength () {
      try {
        return Math.round(this.statusObject.wifiStrength)
      } catch (err) {
        return 0
      }
    },
    ipAddress () {
      try {
        return this.statusObject.localIp
      } catch (err) {
        return 0
      }
    }
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
