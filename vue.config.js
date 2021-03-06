const path = require('path')

module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: 'manual',
      rtlSupport: false
    }
  },
  publicPath: '/data-renderer/',
  configureWebpack (cfg) {
    cfg.resolve.alias['@oarepo/data-renderer'] =
      path.join(__dirname, 'library/index.js')
  },
  transpileDependencies: [
    'quasar'
  ]
}
