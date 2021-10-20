module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },

  outputDir: 'dist',
  assetsDir: 'assets',

  publicPath: process.env.NODE_ENV === 'production'
    ? '/robot/'
    : '/',

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableLegacy: true,
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true
    }
  }
}
