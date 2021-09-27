<template>
      <div>
            <b>Name</b> : {{ data.device_name }}
            <b>UUID</b> : {{ data.device_uuid}}
            <b>Status</b> : {{ data.device_status }}
            <button @click="buttonClicked" :disabled="isBusy"> Connect </button>
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
      console.log('buttonClicked')

      // Start a session
      this.$router.push('/session')
    }
  },
  computed: {
    isBusy () {
      return this.data.device_status_busy
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
