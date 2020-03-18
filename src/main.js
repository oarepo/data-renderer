import Vue from 'vue'
import App from './App.vue'
import './quasar'
import DataRenderer2 from '@oarepo/data-renderer-2'
import VueQuerySynchronizer from '@oarepo/vue-query-synchronizer'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueQuerySynchronizer, {
  passUnknownProperties: true,
  router
})

Vue.use(DataRenderer2, {})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
