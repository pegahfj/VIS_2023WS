module.exports = {
  chainWebpack: config => {
    config.module
      .rule('json')
      .test(/\.json$/)
      .use('json5-loader')
      .loader('json5-loader')
      .end();
  },
  publicPath: './',
  css: {
    loaderOptions: {
      css: {
        url: false,
      }
    }
  }
}