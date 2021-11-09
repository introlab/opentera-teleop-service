<template>
  <div class="container h-100 w-100">
    <SessionList> </SessionList>
  </div>
</template>

<script>

// @ is an alias to /src
import SessionList from '@/components/SessionList.vue'

export default {
  name: 'StatsView',
  components: { SessionList },
  created () {

  }
}
</script>
