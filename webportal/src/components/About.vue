<template>
      <div class="d-grid container-fluid bg-white">
            <div class="row">
                  <div class="col-md-12">
                        <h1 class="bg-info">Robot Teleoperation Service</h1>
                  </div>
            </div>

            <div class="row mt-1">
                  <h3 class="mt-4">Project Page</h3>
                  <div class="col-md-12">
                        <a href="https://github.com/introlab/opentera-teleop-service" target="window" class="link-info">
                        <img src="@/assets/GitHub.png" alt="GitHub" class="img-fluid mx-2" width="300">
                        </a>
                  </div>

                  <h3 class="mt-4">Powered By</h3>
                  <div class="col-md-12">
                  <a href="https://github.com/introlab/opentera" target="window" class="link-info">
                  <img src="@/assets/LogoOpenTera.png" alt="3IT" class="img-fluid mx-2" width="200">
                  </a>
                  </div>

                  <h3 class="mt-5">Acknowledgements</h3>
                  <div class="col-md-12 mt-4">
                        <a href="https://agewell-nce.ca/" target="window" class="link-info">
                        <img src="@/assets/AgeWell.png" alt="3IT" class="img-fluid mx-4" width="300">
                        </a>
                        <a href="https://introlab.3it.usherbrooke.ca" target="window" class="link-info">
                        <img src="@/assets/IntRoLab.png" alt="3IT" class="img-fluid mx-2" width="300">
                        </a>
                        <a href="https://usherbrooke.ca/3it" target="window" class="link-info">
                        <img src="@/assets/3IT.png" alt="3IT" class="img-fluid mx-2" width="300">
                        </a>
                  </div>
                  <p class="fst-italic mt-4 text-end">
                  Version: 1.0.0
                  </p>
            </div>
      </div>
</template>

<script>

export default {
  name: 'About',
  props: {
  },
  methods: {

  },
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
    console.log('mounted')
  },
  created () {
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  background-color: coral;
</style>
