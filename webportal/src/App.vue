<template>
  <div class="container-fluid px-0 h-100 d-flex flex-column">
    <div class="row gx-0 h-100 overflow-auto">
      <div id="statusbar" class="container-fluid px-0 gx-2 sticky-top">
        <StatusBar> </StatusBar>
      </div>
      <div class="container-fluid" style="height:calc(100% - 62px)">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #3c1e50;
  background-color: grey;
  height: 100%;
  width: 100%;
}

#nav {
  padding: 0px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

html, body {
  width: 100%;
  height: 100%;
}

#statusbar {
  width: 100%;
  height: 50px;
  z-index: 1100;
}

</style>
