<template>
  <div class="indexCont connonBg main">
      <div class="center">
        <ul>
          <template v-for="item in list">
            <li class="cursor_p" @click="downOrder(item.name)">
              <div class="img">
                <img :src="item.img" alt="">
              </div>
              <span>{{item.name}}</span>
            </li>
          </template>
        </ul>
      </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      list:[
        {
          name:'红色条幅',
          img:require('../../assets/img/tiaofu.png'),
          id:1,
        },
        {
          name:'打印资料',
          img:require('../../assets/img/dayin.png'),
          id:2,
        },
        {
          name:'印刷',
          img:require('../../assets/img/yinshu.png'),
          id:3,
        },
        {
          name:'喷绘',
          img:require('../../assets/img/penhui.png'),
          id:5,
        },
        {
          name:'写真',
          img:require('../../assets/img/xiezhen.png'),
          id:6,
        },
        {
          name:'旗帜',
          img:require('../../assets/img/qizhi.png'),
          id:7,
        }
      ]
    }
  },
  methods:{
    downOrder(name){
      this.$router.push({  
          path: '/index/downOrder',   
          name: 'downOrder',  
          query: {  
            name:name,
          }
      })  
    }
  },
}
</script>


<style scoped lang="less">
  .indexCont{

    ul{
      display: flex;
      align-items: center;
      padding: 24px;

      li{
        text-align: center;
        width: 144px;
        padding: 16px 0;
        background: #F5F6FA;
        border-radius: 10px;
        margin-right: 48px;
        .img{
          text-align: center;
          margin-bottom: 16px;
          img{
            width: 44px;
            height: 44px;
            display: inline-block;
          }
        }
        span{
          width: 68px;
          height: 28px;
          background: #3551DF;
          border-radius: 16px;
          display: inline-block;
          text-align: center;
          line-height: 28px;
          color: #fff;
        }
      }
      li:last-child{
        margin-right: 0;
      }
    }
  
  }
</style>
