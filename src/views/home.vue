<template>
  <div>
    <Header></Header>
    <router-view></router-view>
    <!-- <CommonIcon></CommonIcon>
    <NavFooter></NavFooter> -->
  </div>
</template>
<script>
import Header from './../components/header'
// import NavFooter from './../components/navFooter'
// import CommonIcon from './../components/commonIcon'
export default {
  name: 'home',
  components: {
    // 当键名与值名相同，可省略写一个, ES6增强的写法
    Header,
    // NavFooter,
    // CommonIcon
  },
  data () {
    return {
     
    }
  },
  methods: {

  }
}
</script>
