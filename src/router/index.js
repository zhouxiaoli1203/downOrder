import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'hash',
  routes: [
    {
      path: '/',
      redirect: '/login', // 默认
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
        component: () =>import('@/views/login.vue'),
    },

    {
      path: '/home',
      name: 'home',
      meta: {
          title: '下单系统'
      },
      component: () =>import('../views/home.vue'),
      children:[
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
          path: '/index/downOrderAll',
          name: 'downOrderAll',
          component: () => import('@/views/index/downOrderAll.vue'),
        },
        {
          path: '/order',
          name: 'order',
          component: () => import('@/views/order/index.vue'),
        },
        {
          path: '/order/detail',
          name: 'detail',
          component: () => import('@/views/order/detail.vue'),
        },
    
      ]
  },
  ]
})
