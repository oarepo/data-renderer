import Vue from 'vue'
import VueRouter from 'vue-router'
import DataRendererPage from '../components/DataRendererPage'
import { query } from '@oarepo/vue-query-synchronizer'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: DataRendererPage,
    props: query(['schema'])
  }
]

const router = new VueRouter({
  routes
})

export default router
