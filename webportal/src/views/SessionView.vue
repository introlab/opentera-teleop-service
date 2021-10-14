<template>
  <div class="container-fluid h-100 w-100">
    <iframe :src="sessionUrl" class="h-100 w-100" frameborder="0" ref="frame" @load="load" v-show="iframe.loaded" allow="camera;microphone">
  </iframe>
  </div>
</template>

<script>

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('auth')

export default {
  name: 'SessionView',
  props: { url: URL },
  data () {
    return {
      iframe: {
        loaded: false
      }
    }
  },
  methods: {
    load: function () {
      this.iframe.loaded = true
      console.log('sessionURL', this.sessionUrl)
    }
  },
  computed: {
    ...mapGetters(['sessionUrl'])
  }

}
</script>
