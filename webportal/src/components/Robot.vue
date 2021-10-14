<template>
      <div class="card-body">
            <h5 class="card-title">{{ data.device_name }}</h5>
            <p><b>UUID</b> : {{ data.device_uuid}}</p>
            <p><b>Status</b> : {{ data.device_status }}</p>
            <div class="card-footer text-muted">
              <button class="btn btn-primary" @click="buttonClicked" :disabled="isBusy"> Connect </button>
            </div>
      </div>
      <!--
      <div>
            <h1> Debug </h1>
            {{ data }}
      </div>
      -->
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
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
