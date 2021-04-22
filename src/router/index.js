import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/index' },
    {
      path: '/index',
      name: 'index',
      // component: resolve => (require(['@/components/login'], resolve))
      component: () => import('@/views/index/index.vue'),
    },
    {
      path: '/index/downOrder',
      name: 'downOrder',
      component: () => import('@/views/index/downOrder.vue'),
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('@/views/order/index.vue'),
    },


  ]
})
