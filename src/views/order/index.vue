<template>
  <div class="connonBg main">
    <div class="center">
      <div class="search-head">
       <div class="fl drops">
        <el-select v-model="orderInfo.status" placeholder="订单状态"  clearable class="yhc-dropdown" @change="orderStatus">
          <el-option
            v-for="item in cost.receiveStatus"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>

        <el-select v-model="orderInfo.skuId" placeholder="订单类型"  clearable class="yhc-dropdown" @change="orderType">
          <el-option
            v-for="item in listGoodAndSkus"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        
        <el-select v-model="orderInfo.timeType" placeholder="时间选择"  clearable class="yhc-dropdown" @change="orderTypeTime" :disabled="orderInfo.timeTypedisabled">
          <el-option
            v-for="item in cost.orderTime"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>

        <div class="yhc-item yhc-date">
          <el-date-picker
            :editable="false"
            :disabled="orderInfo.orderTimedisabled"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            @change="orderTimeChange"
            v-model="orderInfo.timeValue"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>

      <div class="fr displayFl right-btns">
        <div class="search-input yhc-item">
          <el-input placeholder="订单号/客户姓名/联系方式" class="input-with-select" v-model="orderInfo.keyword" clearable @change="keywordSearch">
            <el-button slot="append" @click="keywordBtn">搜索</el-button>
          </el-input>
        </div>
        <div class="btn bgWhite export" @click="openExport">导出</div>
      </div>
    </div>


      <section class="contBOX">
        <div class="table-content" v-if="orderList!=''">
          <ul class="list-items">
            <li class="list-card" v-for="item in orderList" @click="goDetail(item.id,item.orderAttr.title)">
              <div class="head">
                <h3>{{item.orderAttr.title}}</h3>
                <span class="yixiadan" v-if="item.status==0">认领中</span>
                <span class="yixiadan" v-if="item.status==1" style="color:#FF8F1C">已驳回</span>
                <span class="yixiadan" v-if="item.status==2">待生产</span>
                <span class="yixiadan" v-if="item.status==3">生产中</span>
                <span class="yixiadan" v-if="item.status==4">生产完成</span>
                <span class="yixiadan" v-if="item.status==5" style="color:#3551DF">已发货</span>
                <span class="yixiadan" v-if="item.status==6" style="color:#394250">退单中</span>
                <span class="yixiadan" v-if="item.status==7" style="color:#394250">已退单</span>
                <span class="yixiadan" v-if="item.status==8" style="color:#FF3333">请求返厂</span>
                <span class="yixiadan" v-if="item.status==9" style="color:#FF3333">返厂中</span>
              </div>
              <div class="content">
                <p>创建：{{item.createTime}}</p>
                <p v-if="item.deliveryTime!=null">发货：{{item.deliveryTime}}</p>
              </div>
              <div class="footer">
                <span class="fl status red" v-if="item.orderAttr.goodsName=='条幅'">{{item.orderAttr.goodsName}}</span>
                <span class="fl status blue" v-if="item.orderAttr.goodsName=='打印'">{{item.orderAttr.goodsName}}</span>
                <span class="fr icon">
                  <i class="el-icon-arrow-right"></i>
                </span>
              </div>
            </li>
          </ul>
        </div>

        <div class="noCont" v-else>
          <img :src="noOrder" alt="">
          <p>暂无订单</p>
        </div>

        <div class="pageblock" v-if="orderList!=''">
          <el-pagination
            background
            :current-page.sync="orderInfo.pageNum"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :page-size="15"
            :total="total">
          </el-pagination>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'order',
  data () {
     return {
      dialogVisible:false,
      exportVisible:false,
      orderList:[],
      noOrder:require('../../assets/img/noOrder.png'),
      listGoodAndSkus:[], //订单类型
      total:0,
      pageSize:15, //每页多少条
      orderInfo:{
        timeValue:"", //时间范围选择
        pageNum:1, //页码
        status:'',//订单状态
        skuId:'',//订单类型 (单品Id)
        timeType:'',//时间天数,
        startDate:'',//开始时间
        endDate:'',//结束时间
        keyword:'', //关键词
        timeTypedisabled:false, //时间选择
        orderTimedisabled:false //时间范围
      }
    }
  },
  components: {},
  created() {
    console.log(380)
    this.listGoodAndSku();
    let {pageSize,orderInfo} = this

    let xinxi = this.$store.getters.getOrderInfo

    console.log(xinxi)
 
    if(xinxi){ //存

      this.$store.commit('setOrderInfo',xinxi)

      this.orderInfo = xinxi

      this.getList(
        xinxi.pageNum,
        pageSize,
        xinxi.status,
        xinxi.skuId,
        xinxi.timeType,
        xinxi.startDate,
        xinxi.endDate,
        xinxi.keyword
      );

    }else{
      this.$store.commit('setOrderInfo',orderInfo)

      this.getList(
        orderInfo.pageNum,
        pageSize,
        orderInfo.status,
        orderInfo.skuId,
        orderInfo.timeType,
        orderInfo.startDate,
        orderInfo.endDate,
        orderInfo.keyword
      );

    }

   
  },
  mounted() {},
  methods: {
    // 查询主产品和单品列表
    listGoodAndSku() {
      this.$post('get', this.baseUrl + '/goods/listGoodAndSkus').then((res) => {
        if (res.code == 200) {
          let info = res.data
          info.forEach((item,index)=>{
            item.skus.forEach((i)=>{
              let data = {
                name:i.name,
                id:i.id,
              }
              this.listGoodAndSkus.push(data)
            })
          })
        }
      })
    },
    // 获取订单列表
    getList(pageNum,pageSize,status,skuId,timeType,startDate,endDate,keyword) {
      let data = {
        pageNum, //页码
        pageSize, //每页多少条
        status,//订单状态
        skuId,//订单类型 (单品Id)
        timeType,//时间天数,
        startDate,//开始时间
        endDate,//结束时间
        keyword, //关键词
      }
      this.$post('post', this.baseUrl + '/order/page',data).then((res) => {
        if (res.code == 200) {
          this.orderList = res.data.rows
          this.total = res.data.total
        }
      })
    },

    // 点击页数
    handleCurrentChange(val) {
      this.orderInfo.pageNum = val
      let {pageSize,orderInfo} = this
      this.getList(
        val,
        pageSize,
        orderInfo.status,
        orderInfo.skuId,
        orderInfo.timeType,
        orderInfo.startDate,
        orderInfo.endDate,
        orderInfo.keyword
      );

      this.$store.commit('setOrderInfo',orderInfo)

    },
    //选择订单的状态
    orderStatus(val){
      this.orderInfo.status = val
      this.orderInfo.pageNum = 1
      let {pageSize,orderInfo} = this
      this.getList(
        1,
        pageSize,
        val,
        orderInfo.skuId,
        orderInfo.timeType,
        orderInfo.startDate,
        orderInfo.endDate,
        orderInfo.keyword
      );
      this.$store.commit('setOrderInfo',orderInfo)
    }, 
    //选择订单的类型
    orderType(val){
      this.orderInfo.skuId = val
      this.orderInfo.pageNum = 1
      let {pageSize,orderInfo} = this

      this.getList(
        1,
        pageSize,
        orderInfo.status,
        val,
        orderInfo.timeType,
        orderInfo.startDate,
        orderInfo.endDate,
        orderInfo.keyword
      );

      this.$store.commit('setOrderInfo',orderInfo)
    }, 
    // 时间选择
    orderTypeTime(val){
      if(val){
        this.orderInfo.orderTimedisabled = true
      }else{
        this.orderInfo.orderTimedisabled = false
      }
      this.orderInfo.timeType = val
      this.orderInfo.pageNum = 1
      let {pageSize,orderInfo} = this
      this.getList(
        1,
        pageSize,
        orderInfo.status,
        orderInfo.skuId,
        val,
        orderInfo.startDate,
        orderInfo.endDate,
        orderInfo.keyword
      );
      this.$store.commit('setOrderInfo',orderInfo)
    },
    // 时间范围
    orderTimeChange(val){
      let {pageSize,orderInfo} = this
      this.orderInfo.pageNum = 1
      this.orderInfo.timeValue = val
      if(val){
        this.orderInfo.timeTypedisabled = true
        let start = val[0]
        let end = val[1]
        this.getList(1,pageSize,orderInfo.status,orderInfo.skuId,orderInfo.timeType,start,end,orderInfo.keyword);
      }else{
        this.orderInfo.timeTypedisabled = false

        this.getList(1,pageSize,orderInfo.status,orderInfo.skuId,orderInfo.timeType,"","",orderInfo.keyword);
      }
      this.$store.commit('setOrderInfo',orderInfo)

    },

    keywordSearch(val){
      this.orderInfo.pageNum = 1
      this.orderInfo.keyword = val
      let {pageSize,orderInfo} = this
      this.getList(
        1,
        pageSize,
        orderInfo.status,
        orderInfo.skuId,
        orderInfo.timeType,
        orderInfo.startDate,
        orderInfo.endDate,
        val
      )
      this.$store.commit('setOrderInfo',orderInfo)
    },
    // 按钮搜索
    keywordBtn(){
      let {pageSize,orderInfo} = this
      this.orderInfo.pageNum = 1
      this.getList(
        1,
        pageSize,
        orderInfo.status,
        orderInfo.skuId,
        orderInfo.timeType,
        orderInfo.startDate,
        orderInfo.endDate,
        orderInfo.keyword
      )
      this.$store.commit('setOrderInfo',orderInfo)
    },
    // /跳转的路径
    goDetail(id,title){
      this.$router.push({
        path: '/order/detail', 
        query: {
          id:id,
          title:title
        }
      })
    },
    openBohui(){
      let this_ = this;
      this_.dialogVisible = true;
      // this_.form.desc = "";
    },
    openExport(){
      let this_ = this;
      this_.exportVisible = true;
      // this_.exportDate = "";
       this.$message({
          message: '该功能正在开发，敬请期待哦！',
          type: 'warning'
        });
    },
  }
}
</script>


<style lang='less' scoped>

  .main{
    overflow-y: scroll;
  }
  .center{
    background: none;
    display: flex;
    flex-flow: column;
  }
  
  .search-head {
    height: 32px;
    margin-bottom: 18px;

    .drops{
      display: flex;
      align-items: center;
    }
    .yhc-item .el-input {
      line-height: 29px;
    }
    /deep/.el-input-group__append {
      color: #fff;
      background: #3551df;
      border: 1px;
    }
    .export {
      height: 30px;
      line-height: 16px;
      margin-left: 40px;
      color: #3551df;
      background: #FFFFFF;
      border: 1px solid #3551DF;
      padding: 6px 11px;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
    }
  }
  .table-content {
    padding: 24px;
    // background: #fff;
  }
  .list-items {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    .list-card {
      width: 274px;
      height: 149px;
      background: #ffffff;
      border-radius: 10px;
      padding: 16px 12px;
      box-shadow: 2px 3px 20px #ccc;
      margin:0 16px 20px 0;
      cursor: pointer;
      .head {
        display: flex;
        justify-content: space-between;
        h3 {
          font-size: 16px;
          font-weight: 500;
          color: #333;
        }
      }
      .content {
        margin: 8px 0 28px;
        p {
          font-size: 12px;
          color: #abaebb;
          line-height: 17px;
        }
      }
      .footer {
        clear: both;
        overflow: hidden;
        i{
          font-size: 20px;
          color: #999;
        }
      }
    }
    .yixiadan{
        color:#35A3DF;
    }
    .yipohui{
        color:#FF8F1C;
    }
    .status{
      width: 64px;
        height: 25px;
        line-height: 25px;
        border-radius: 4px;
        text-align: center;
        &.blue{
            color:#3A65FF;
            background-color:rgba(58,101,255,0.09);
        }
        &.red{
            color:#FF3333;
            background-color:rgba(255,51,51,0.09);
        }
      }
  }

  .contBOX{
    flex: 1;
    display: flex;
    justify-content: center;
    flex-flow: column;
    background: #fff;
    border-radius: 10px;
    padding-bottom: 24px;
    .table-content{
      flex: 1;
    }
  }

  // 页码定位
  .pageblock{
    .el-pagination{
      text-align: center;
    }
  }
</style>

