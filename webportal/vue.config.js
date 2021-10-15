module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  outputDir: 'dist',
  assetsDir: 'static',
  publicPath: process.env.NODE_ENV === 'production'
    ? '/robot/'
    : '/'
}
