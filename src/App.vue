<template>
  <div id="app">
    <NavLeft></NavLeft>
    <navHead></navHead>
    <router-view/>
  </div>
</template>

<script>
import navHead from './components/navhead'
import NavLeft from './components/navLeft'
export default {
  name: 'App',
  components: {
    // 当键名与值名相同，可省略写一个, ES6增强的写法
    navHead,
    NavLeft
    // NavFooter,
    // CommonIcon
  },
}
</script>

<style>

</style>
