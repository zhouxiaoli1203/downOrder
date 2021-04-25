<template>
  <div class="connonBg main">
    <div class="search-head">
       <div class="fl drops">
        <el-dropdown class="yhc-dropdown" trigger="click">
          <span class="el-dropdown-link">
            订单状态<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="x in cost.receiveStatus" :key="x.value">{{x.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown class="yhc-dropdown" trigger="click">
          <span class="el-dropdown-link">
            订单类型<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="x in cost.orderType" :key="x.value">{{x.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown class="yhc-dropdown" trigger="click">
          <span class="el-dropdown-link">
            时间选择<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="x in cost.orderStatus" :key="x.value">{{x.name}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="yhc-item yhc-date">
          <el-date-picker
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
          <el-input placeholder="订单号/客户姓名/联系方式" class="input-with-select">
            <el-button slot="append">搜索</el-button>
          </el-input>
        </div>
        <div class="btn bgWhite export" @click="openExport">导出</div>
      </div>
    </div>
    <div class="center">
      <div class="table-content">
        <ul class="list-items">
          <li class="list-card" v-for="x in 12" @click="goDetail">
            <div class="head">
              <h3>这里是订单标题这…</h3>
              <span class="yixiadan">已下单</span>
            </div>
            <div class="content">
              <p>创建：2021-01-21 13:22</p>
              <p>发货：2021-01-21 13:22</p>
            </div>
            <div class="footer">
              <span class="fl status blue">打印资料</span>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage4"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="sizes, prev, pager, next"
          :total="1000">
        </el-pagination>
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
      currentPage4: 4
    }
  },
    components: {},
  created() {
    this.getList()
  },
  mounted() {},
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 获取订单列表
    getList() {
      this.$post('post', this.baseUrl + '/order/list').then((res) => {
        if (res.code == 200) {
          this.orderList = res.data
        }
      })
    },
    renling(){
        let this_ = this;
        this_.confirm_pop("确定认领该条订单","认领").then(()=>{

        });
    },
    openBohui(){
        let this_ = this;
        this_.dialogVisible = true;
        this_.form.desc = "";
    },
    openExport(){
        let this_ = this;
        this_.exportVisible = true;
        this_.exportDate = "";
    },
    goDetail(){
         this.$router.push({
        //核心语句
        path: '/index/order/detail', //跳转的路径
        query: {
            from:"order",
            id:""
          //路由传参时push和query搭配使用 ，作用时传递参数
        },
      })
    }
  },
}
</script>


<style lang='less' scoped>
  .center{
    height: 96.5%;
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

