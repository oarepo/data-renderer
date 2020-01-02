import Vue from 'vue'
import App from './App.vue'
import './quasar'
import DataRenderer from '@oarepo/data-renderer'

Vue.config.productionTip = false

Vue.use(VueQuerySynchronizer, {
  passUnknownProperties: true,
  router
});

Vue.use(DataRenderer, {});

new Vue({
  render: h => h(App),
}).$mount('#app')
