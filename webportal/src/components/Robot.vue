<template>
  <div class="card mx-auto card-size">
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
              <li class="list-group-item" v-if="isCharging"><b>{{$t('Charging')}}</b></li>
              <li class="list-group-item" v-else><b>{{$t('Not Charging')}}</b></li>
              <li class="list-group-item"><b>{{$t('Last Update')}}:</b> {{timestamp}}</li>
          </ul>

          <div class="card-footer text-muted">
             <div class="alert alert-info" v-if="connecting">
            {{$t('Connecting')}}...
            </div>
            <div>
              <button class="btn btn-primary" @click="buttonClicked" :disabled="isBusy || inSession" v-if="!connecting && !inCurrentSession"> {{$t('Connect')}} </button>
              <button class="btn btn-success" @click="goToSession"  v-else-if="!connecting && inCurrentSession && inMultipleRobotsSession"> {{$t('Join session')}} </button>
              <button class="btn btn-success" @click="goToSession"  v-else-if="!connecting && inCurrentSession"> {{$t('Return to session')}} </button>
            </div>
            <div class="pt-2">
              <button class="btn btn-secondary" @click="toggleSelection" :disabled="isBusy" v-if="!connecting && !inSession && !isSelected">{{$t('Select')}} </button>
              <button class="btn btn-success" @click="toggleSelection" :disabled="isBusy || inSession" v-else-if="!connecting && !inSession && isSelected">{{$t('Unselect')}} </button>
            </div>
          </div>
    </div>
    <!--
    {{statusObject}}
    -->
  </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('api')

// @ is an alias to /src

export default {
  name: 'Robot',
  components: {},
  props: { data: Object },
  methods: {
    buttonClicked () {
      console.log('Robot:buttonClicked')
      // Start a session
      this.connecting = true
      const devices = {}
      devices[this.data.device_uuid] = this.data
      this.$store.dispatch('api/startSession', devices).then(
        (session) => {
          console.log('Robot newSession:', session)
        },
        (error) => {
          console.log('Robot errorSession', error)
          this.connecting = false
        }
      )
    },
    goToSession () {
      this.$router.push('/session')
    },
    toggleSelection () {
      if (!(this.data.device_uuid in this.selectedDevices)) {
        this.$store.dispatch('api/addSelectedDevice', this.data)
      } else {
        this.$store.dispatch('api/removeSelectedDevice', this.data.device_uuid)
      }
    }
  },
  data: function () {
    return {
      connecting: false
    }
  },
  computed: {
    isBusy () {
      return this.data.device_busy
    },
    inCurrentSession () {
      return this.teleopSession?.sessionDevices ? this.teleopSession.sessionDevices.includes(this.data.device_uuid) : false
    },
    isSelected () {
      return this.data.device_uuid in this.selectedDevices
    },
    timestamp () {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }
      try {
        return new Date(this.data.device_status.status.timestamp * 1000).toLocaleString(undefined, options)
      } catch (err) {
        return new Date().toLocaleString(undefined, options)
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
    },
    // mix the getters into computed with object spread operator
    ...mapGetters(['teleopSession', 'inSession', 'inMultipleRobotsSession', 'selectedDevices'])
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card-size {
    width: 20rem;
    margin-top:0.5rem !important;
  }
</style>
