<template>
  <div class="session">
    <h1>This is the session page</h1>
    <iframe :src="iframe.src" width="100%" height="1000" frameborder="0" ref="frame" @load="load" v-show="iframe.loaded">
  </iframe>
  </div>
</template>

<script>

export default {
  name: 'SessionView',
  props: { url: URL },
  data () {
    return {
      iframe: {
        src: 'https://telesante.3it.usherbrooke.ca',
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
