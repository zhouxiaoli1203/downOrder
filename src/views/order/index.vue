<template>
  <div class="connonBg main">
    <div class="search-head">
       <div class="fl drops">
        <el-select v-model="status" placeholder="订单状态"  clearable class="yhc-dropdown" @change="orderStatus">
          <el-option
            v-for="item in cost.receiveStatus"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>

        <el-select v-model="skuId" placeholder="订单类型"  clearable class="yhc-dropdown" @change="orderType">
          <el-option
            v-for="item in listGoodAndSkus"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        
        <el-select v-model="timeType" placeholder="时间选择"  clearable class="yhc-dropdown" @change="orderTypeTime" :disabled="timeTypedisabled">
          <el-option
            v-for="item in cost.orderTime"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>

        <div class="yhc-item yhc-date">
          <el-date-picker
            :disabled="orderTimedisabled"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            @change="orderTimeChange"
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </div>

      <div class="fr displayFl right-btns">
        <div class="search-input yhc-item">
          <el-input placeholder="订单号/客户姓名/联系方式" class="input-with-select" v-model="keyword" clearable @change="keywordSearch">
            <el-button slot="append" @click="keywordBtn">搜索</el-button>
          </el-input>
        </div>
        <div class="btn bgWhite export" @click="openExport">导出</div>
      </div>
    </div>
    <div class="center">
      <section v-if="orderList!=''">
        <div class="table-content">
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
        <div class="pageblock">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :page-size="10"
            :total="total">
          </el-pagination>
        </div>
      </section>
      <div class="noCont" v-else>
        <img :src="noOrder" alt="">
        <p>暂无订单</p>
      </div>
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
      value1:"",
      exportDate:"",
      form:{desc:""},
      currentPage4: 4,
      orderList:[],
      noOrder:require('../../assets/img/noOrder.png'),
      listGoodAndSkus:[], //订单类型
      pageNum:1, //页码
      pageSize:10, //每页多少条
      status:'',//订单状态
      skuId:'',//订单类型 (单品Id)
      timeType:'',//时间天数,
      startDate:'',//开始时间
      endDate:'',//结束时间
      keyword:'', //关键词
      total:0,
      timeTypedisabled:false,
      orderTimedisabled:false
    }
  },
  components: {},
  created() {
    this.listGoodAndSku();
    let {pageNum,pageSize,status,skuId,timeType,startDate,endDate,keyword} = this
    this.getList(pageNum,pageSize,status,skuId,timeType,startDate,endDate,keyword);
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
      this.pageNum = val
      let {pageSize,status,skuId,timeType,startDate,endDate,keyword} = this
      this.getList(val,pageSize,status,skuId,timeType,startDate,endDate,keyword);
    },
    //选择订单的状态
    orderStatus(val){
      console.log(val)
      this.status = val
      let {pageNum,pageSize,status,skuId,timeType,startDate,endDate,keyword} = this
      this.getList(1,pageSize,val,skuId,timeType,startDate,endDate,keyword);
    }, 
    //选择订单的类型
    orderType(val){
      console.log(val)
      this.skuId = val
      let {pageNum,pageSize,status,skuId,timeType,startDate,endDate,keyword} = this
      this.getList(1,pageSize,status,val,timeType,startDate,endDate,keyword);
      
    }, 
    // 时间选择
    orderTypeTime(val){
      if(val){
        this.orderTimedisabled = true
      }else{
        this.orderTimedisabled = false
      }
      console.log(val)
      this.timeType = val
      let {pageNum,pageSize,status,skuId,timeType,startDate,endDate,keyword} = this
      this.getList(1,pageSize,status,skuId,val,startDate,endDate,keyword);
    },
    // 时间范围
    orderTimeChange(val){
      let {pageNum,pageSize,status,skuId,timeType,startDate,endDate,keyword} = this

      if(val){
        this.timeTypedisabled = true
        let start = val[0]
        let end = val[1]
        this.getList(1,pageSize,status,skuId,timeType,start,end,keyword);
      }else{
        this.timeTypedisabled = false

        this.getList(1,pageSize,status,skuId,timeType,"","",keyword);
      }
    },

    keywordSearch(val){
      console.log(val)
      let {pageNum,pageSize,status,skuId,timeType,startDate,endDate,keyword} = this
      this.getList(1,pageSize,status,skuId,timeType,startDate,endDate,val);
    },
    // 按钮搜索
    keywordBtn(){
      let {pageNum,pageSize,status,skuId,timeType,startDate,endDate,keyword} = this
      this.getList(1,pageSize,status,skuId,timeType,startDate,endDate,keyword);
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
    },
  }
}
</script>


<style lang='less' scoped>
  .center{
    height: 96.5%;
    position: relative;
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
    background: #fff;
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

  // 页码定位
  .pageblock{
    position: absolute;
    bottom: 24px;
    left: 50%;
    transform: translate(-50%,0);
  }
</style>

