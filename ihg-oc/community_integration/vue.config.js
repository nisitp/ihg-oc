module.exports = {
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: false
    },
    output: {
      filename: '[name].js'
    }
  },
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        prependData: '@import "@/_utils.scss";'
      }
    }
  }
}
