<template>
  <div class="home">
    <RobotList> </RobotList>
  </div>
</template>

<script>
// @ is an alias to /src
import RobotList from '@/components/RobotList.vue'

export default {
  name: 'HomeView',
  components: { RobotList },
  created () {

  }
}
</script>
