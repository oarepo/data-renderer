const path = require('path')

module.exports = {
  pluginOptions: {
    quasar: {
      importStrategy: 'manual',
      rtlSupport: false
    }
  },
  configureWebpack (cfg) {
    cfg.resolve.alias['@oarepo/data-renderer-2'] =
      path.join(__dirname, 'library/index.js')
  },
  transpileDependencies: [
    'quasar'
  ]
}
