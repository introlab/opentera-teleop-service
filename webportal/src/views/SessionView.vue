<template>
  <div class="session">
    <h1>This is the session page</h1>
    <iframe :src="iframe.src" width="100%" height="100%" frameborder="0" ref="frame" @load="load" v-show="iframe.loaded">
  </iframe>
  </div>
</template>

<script>

export default {
  name: 'SessionView',
  data () {
    return {
      iframe: {
        src: 'https://www.google.ca',
        loaded: false
      }
    }
  },
  methods: {
    load: function () {
      this.iframe.loaded = true
    }
  }

}
</script>
