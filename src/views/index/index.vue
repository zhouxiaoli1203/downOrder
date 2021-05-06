<template>
  <div class="indexCont connonBg main">
      <div class="center">
        <ul>
          <template v-for="item in list">
            <li class="cursor_p" @click="downOrder(item.name,item.id)">
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
      list:[],
    }
  },
  created(){
    this.listGoodAndSkus();
  },
  methods:{
    downOrder(name,id){
      console.log(id)
      // if(id!=2){
      //   this.$message({
      //     message: '该功能正在开发，敬请期待哦！',
      //     type: 'warning'
      //   });

      //   return false
      // }
      if(id==2){
        this.$router.push({  
            path: '/index/downOrder',   
            name: 'downOrder',  
            query: {  
              name:name,
              id:id
            }
        })  
      }
      if(id==5){
        this.$router.push({  
          path: '/index/downOrderColor',   
          name: 'downOrderColor',  
          query: {  
            name:name,
            id:id
          }
        })  

        return false
      }

      if(id==6){
        this.$router.push({  
          path: '/index/downOrderCraft',   
          name: 'downOrderCraft',  
          query: {  
            name:name,
            id:id
          }
        })  

        return false
      }

      if(id==7){
        this.$router.push({  
            path: '/index/downOrder',   
            name: 'downOrderAll',  
            query: {  
              name:name,
              id:id
            }
        })  
      }


    },
    // 查询主产品和单品列表
    listGoodAndSkus() {
      this.list=[]
      this.$post('get', this.baseUrl + '/goods/listGoodAndSkus').then((res) => {
        if (res.code == 200) {
          let info = res.data
          info.forEach((item,index)=>{
            item.skus.forEach((i)=>{
              console.log(i)
              let data = {
                name:i.name,
                img:this.baseUrl + i.url,
                id:i.id,
              }
              this.list.push(data)
            })
          })
        }
      })
    },
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
