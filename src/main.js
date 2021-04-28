
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import ElementUI from 'element-ui';
import { yhcReq,baseUrl } from './utils/http'
import constant from './utils/constant'
import 'element-ui/lib/theme-chalk/index.css';
import './utils/directive' //阻止按钮同一时间内多次触发


// 样式
import './assets/css/base.css';
import './assets/css/common.css';
import './assets/css/public.css';

//全局公用函数
import Fns from './utils/common'
Object.keys(Fns).forEach(key => {
    Vue.prototype[key] = Fns[key]
})

//全局的filter
import filters from './utils/filters'
filters(Vue);


Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$post = yhcReq;
Vue.prototype.baseUrl = baseUrl;
Vue.prototype.cost = constant;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
