// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
module.exports = {
  build: {
    env: require('./dev.env')
  },
  buildDev: {
    env: require('./dev.env')
  },
  buildProduction: {
    env: require('./prod.env')
  }
}
