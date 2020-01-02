const path = require('path');


module.exports = {
    pluginOptions: {
        quasar: {
            importStrategy: 'manual',
            rtlSupport: false
        }
    },
    transpileDependencies: [
        'quasar'
    ],
    configureWebpack (cfg) {
        cfg.resolve.alias['@oarepo/data-renderer'] =
            path.join(__dirname, 'library/index.js')
    },
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        disableHostCheck: true,
        before: function (app/*, server, compiler*/) {
            const morgan = require('morgan')
            app.use(morgan('combined'))
        }
    },
    publicPath: process.env.DEMO_DEPLOY_PATH || './'
}
