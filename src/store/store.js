import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    //所有的数据都放在state中
    state:{
      currentIndex:"",
      userInfo:'',
      expCompany:[],
      orderInfo:''
    },

    //操作数据，唯一的通道是mutations/*配置全局函数*/
    mutations:{
      setUserInfo(state, info){ //储存用户信息
        state.userInfo = info
        localStorage.setItem('userInfo',JSON.stringify(info))
      },
      setExpCompany(state, info){ 
        state.setExpCompany = info
        localStorage.setItem('expCompany',JSON.stringify(info))
      },

      setOrderInfo(state, info){ 
        state.orderInfo = info
        localStorage.setItem('orderInfo',JSON.stringify(info))
      },

    },
    getters : {
      getUserInfo(state){ //获取用户信息
        if (!state.userInfo) {
          let info = JSON.parse(localStorage.getItem('userInfo'))
          state.userInfo = info?info:''
        }
        return state.userInfo
      },
      getExpCompany(state){ 
        console.log(state)
        if (!state.expCompany) {
          let info = JSON.parse(localStorage.getItem('expCompany'))
          state.setExpCompany = info?info:''
        }
        return state.setExpCompany
      },

      getOrderInfo(state){ 
        if (!state.orderInfo) {
          let info = JSON.parse(localStorage.getItem('orderInfo'))
          state.orderInfo = info?info:''
        }
        return state.orderInfo
      },

    },

    //actions,可以来做异步操作，然后提交给mutations，而后再对state(数据)进行操作
    actions:{}
})