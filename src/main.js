import Vue from 'vue'
import App from './App.vue'
import './quasar'
import DataRenderer from '@oarepo/data-renderer'
import VueQuerySynchronizer from '@oarepo/vue-query-synchronizer'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueQuerySynchronizer, {
    passUnknownProperties: true,
    router
})

Vue.use(DataRenderer, {})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
