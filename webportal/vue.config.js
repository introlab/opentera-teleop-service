module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  outputDir: 'dist',
  assetsDir: 'assets',
  publicPath: process.env.NODE_ENV === 'production'
    ? '/robot/'
    : '/'
}
