<template>
  <div class="connonBg main">
       <div class="crumbsHeader">
            <div class="crumbs">
              <span @click="pathIndex()">订单提交 / </span>
              <span>{{crumbsName}}</span>
          </div>
        </div>
      <div class="center">
        <div class="orderContBox">
          <section class="orderCont">
            <el-form :model="orderForm" :rules="orderFormRules" ref="orderForm" label-width="80px" class="demo-ruleForm">
              <div class="skuInfos">
                <el-row :gutter="10">
                  <el-col v-for="(item,index) in orderForm.skuInfos" :key="index" class="skuInfosLI">
                    <el-form-item label="产品文件">
                      <el-col :span="4" class="uploadBox">
                        <el-upload
                          class="upload-demo"
                          drag
                          action="https://jsonplaceholder.typicode.com/posts/"
                          multiple>
                          <i class="el-icon-upload"></i>
                          <p>上传文件</p>
                        </el-upload>
                      </el-col>
                      <el-col :span="11">
                        <el-dropdown>
                          <el-button type="primary">
                            更多菜单<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>黄金糕</el-dropdown-item>
                            <el-dropdown-item>狮子头</el-dropdown-item>
                            <el-dropdown-item>螺蛳粉</el-dropdown-item>
                            <el-dropdown-item>双皮奶</el-dropdown-item>
                            <el-dropdown-item>蚵仔煎</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </el-col>
                    </el-form-item>
                    <el-form-item label="字体颜色" :prop="`skuInfos.${index}.fontColor`" :rules="skuInfosGroupRules.infofontColor">
                      <el-radio-group v-model="item.fontColor" size="medium">
                        <el-radio border label="白色"></el-radio>
                        <el-radio border label="黄色"></el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="产品尺寸" required>
                      <el-row>
                        <el-col :span="6">
                          <el-form-item :prop="`skuInfos.${index}.width`" :rules="skuInfosGroupRules.infowidth">
                            <el-input v-model="item.width" placeholder="宽（mm）"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col class="line" :span="2">X</el-col>
                        <el-col :span="6">
                          <el-form-item :prop="`skuInfos.${index}.height`" :rules="skuInfosGroupRules.infoheight">
                            <el-input v-model="item.height" placeholder="高（mm）"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row class="remark">
                        <el-col>
                          <el-form-item :prop="`skuInfos.${index}.remark`" :rules="skuInfosGroupRules.inforemark">
                            <el-input  type="textarea" v-model="item.remark" placeholder="请输入订单具体信息"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="产品数量" :prop="`skuInfos.${index}.num`" :rules="skuInfosGroupRules.infonum">
                      <el-col :span="4" class="num">
                        <el-input v-model="item.num"></el-input>
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
              </div>
                <div @click="addLadder" class="addskuInfo">
                  <i class="el-icon-plus"></i>
                  <span>添加</span>
                </div>           
              <el-form-item label="订单标题" prop="title">
                <el-input v-model="orderForm.title" placeholder="请输入订单标题"></el-input>
              </el-form-item>
              <el-form-item label="订单来源" prop="source">
                <el-select v-model="orderForm.source" placeholder="请选择订单来源" style="width:100%">
                  <el-option label="淘宝" value="1"></el-option>
                  <el-option label="京东" value="2"></el-option>
                  <el-option label="PDD" value="3"></el-option>
                  <el-option label="线下" value="4"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客户姓名" prop="receiptName">
                <el-input v-model="orderForm.receiptName" placeholder="请输入客户姓名"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="receiptMobile">
                <el-input v-model="orderForm.receiptMobile" placeholder="请输入客户联系方式"></el-input>
              </el-form-item>
              <el-form-item label="配送方式" class="deliveryType">
                <el-radio-group v-model="orderForm.deliveryType" size="medium">
                  <el-radio border label="邮寄"></el-radio>
                  <el-radio border label="同城配送"></el-radio>
                  <el-radio border label="自提"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-row>
                <el-col>
                  <el-form-item label="物流公司" prop="source">
                    <el-select v-model="orderForm.source" placeholder="请选择物流公司" style="width:100%">
                      <el-option label="淘宝" value="1"></el-option>
                      <el-option label="京东" value="2"></el-option>
                      <el-option label="PDD" value="3"></el-option>
                      <el-option label="线下" value="4"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="地址信息" prop="receiptAddress">
                    <el-cascader class="width100"
                        v-model="orderForm.receiptAddress"
                        size="large"
                        :options="options"
                        placeholder="请选择省市区"
                        @change="cityChange">
                    </el-cascader>
                  </el-form-item>
                  <el-form-item  prop="receiptDetailAddress">
                    <el-input v-model="orderForm.receiptDetailAddress" placeholder="请输入详细地址"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-form-item label="自提地址" prop="source">
                    <el-select v-model="orderForm.source" placeholder="请选择自提地址" style="width:100%">
                      <el-option label="淘宝" value="1"></el-option>
                      <el-option label="京东" value="2"></el-option>
                      <el-option label="PDD" value="3"></el-option>
                      <el-option label="线下" value="4"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item>
                <el-button type="primary" @click="submitForm('orderForm')">立即创建</el-button>
                <el-button @click="resetForm('orderForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </section>
          <section class="lookCont">

          </section>
        </div>
      </div>
      <!-- 弹框 -->
      <section class="uploadSection publicPorp">
        <div class="close">
          <i class="el-icon-close"></i>
        </div>
        <div class="buzhou">
          <el-steps :active="active" finish-status="success">
            <el-step title="选择文件"></el-step>
            <el-step title="上传文件"></el-step>
            <el-step title="上传完成"></el-step>
          </el-steps>
        </div>
        <div class="uploadcont">
          <section class="cont">
            <h5>2021-03-21</h5>
            <ul>
              <li>
                <p class="rodioBox">
                  <el-radio v-model="radio" label="1" @class="radioPublic"><br></el-radio>
                </p>
                <span>我认为，大多数设计师只是试图从他们已经做过的事情中努力，在讲故事方面并</span>
              </li>
            </ul>
          </section>
          <div class="btn">
              <button @click.prevent="next">上一步</button>
              <button @click.prevent="next">下一步</button>
          </div>
        </div>
      </section>
      <div class="mask"></div>
  </div>
</template>

<script>
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  name: 'downOrder',
  data () {
    return {
      radio:'1',
      active: 0,
      options: regionData,
      crumbsName:'',
      orderForm:{
        skuInfos:[
          {
            productCode:'',
            fontColor:'',
            height:'',
            num: 1,
            remark: '',
            width:''
          }
        ],
        title:'',
        source:'', //订单来源，
        receiptName:'', //客户姓名
        receiptMobile:'',
        deliveryType:'', //如果是邮寄和同城配送的话，要选择收货地址等，如果是自提需要选择自提门店
        waybillCode:'', //物流公司
        receiptAddress:'', //收货人的地址 （省＋市＋区）
        receiptDetailAddress:'', //收货人详情地址
        pickUpAddress:'', //自提点
      },
      orderFormRules: {
        title: [
          { required: true, message: '请输入订单标题', trigger: 'blur' }
        ],
      },
      skuInfosGroupRules: {
        infofontColor: [{required: true, message: '请选择字体颜色', trigger: 'blur'}],
        infowidth: [{required: true, message: '请输入宽(单位：mm)', trigger: 'blur'}],
        infoheight: [{required: true, message: '请输入高(单位：mm)', trigger: 'blur'}],
        inforemark: [{required: true, message: '请输入订单具体信息', trigger: 'blur'}],
      },
      
    }
  },
  mounted(){
    this.crumbsName = this.$route.query.name

  },
  methods:{
    next() {
        if (this.active++ > 2) this.active = 0;
      },
    // 点击面包屑
    pathIndex(){
      console.log(111)
      this.$router.go(-1)
    },
    deleteLadder(index){
      if(this.form.productGroup.length>1){
        this.form.productGroup.splice(index,1);
      }
    },
    // 添加产品
    addLadder(){
      console.log(111)
      this.orderForm.skuInfos.push(
        {
          productCode:'',
          fontColor:'',
          height: 0,
          num: 1,
          remark: '',
          width: 0
        }
      );
    },
    submitForm(formName){
      console.log(formName)
      this.$refs[formName].validate((valid,obj) => {
        if (valid) {
          this.submitFormAction();
        } else {
          this.$message.error("验证不通过");
        }
      });
    },
    submitFormAction()
    {
      this.$message.success("提交成功");
    },
    resetForm(formName)
    {
      this.$refs[formName].resetFields();
      this.form.productGroup = [{num:"",price:""}];
    },
    cityChange(val){ //选择收货地址
      // this.prov = this.CodeToText[val[0]]
      // this.city = this.CodeToText[val[1]]
      // this.dist = this.CodeToText[val[2]]
    }, 
  
  }
}
</script>


<style lang="less" scoped>
  .main{
    overflow-y: scroll;
  }
  .orderContBox{
    display: flex;
    justify-content: space-between;
    padding: 24px;
    background: #fff;
    margin-bottom: 24px;
    border-radius: 10px;
  }
  .orderCont{
    width: 50%;
    .skuInfos{
      .skuInfosLI{
        margin-bottom: 24px;
        padding: 24px !important;
        background: #F5F6F9;
        border-radius: 10px;
      }
      .line{
        text-align: center;
      }

      .remark{
        margin-top: 24px !important;
      }
    }

    .addskuInfo{
      width: 100%;
      height: 44px;
      background: #F5F6F9;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;

      i{
        width: 28px;
        height: 28px;
        background: #E1E4ED;
        border-radius: 4px;
        text-align: center;
        line-height: 28px;
        color: #fff;
        font-size: 20px;
        margin-right: 19px;
      }
    }
  }
  .lookCont{
    width: 45%;
    background: #F5F6F9;
    height: 500px;
  }

  // 选择文件步骤条
  .uploadSection{
    width: 772px;
    height: 493px;
    background: #FFFFFF;
    box-shadow: 0px 8px 23px 0px rgba(80, 85, 108, 0.23);
    border-radius: 10px;
    padding: 32px;

    .close{
      text-align: right;
      i{
        font-size: 26px;
        color: #999;
        cursor: pointer;
      }
    }

    .buzhou{

    }

    .uploadcont{
      position: relative;
      height: 332px;
      background: rgba(242,243,248,0.5);
      border-radius: 10px;

      .cont{
        padding: 32px;
        h5{
          color: #3551DF;
          margin-bottom: 16px;
        }

        li{
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          span{
            height: 32px;
            background: #E7E8F4;
            border-radius: 4px;
            line-height: 32px;
            flex: 1;
            padding: 0 16px;
          }
        }
      }
    }

    .btn{
      position: absolute;
      bottom: 25px;
      left: 50%;
      transform: translate(-50%,0);
      button{
        width: 82px;
        height: 32px;
        background: #3551DF;
        border-radius: 8px;
        text-align: center;
        line-height: 32px;
        color: #fff;
      }
      button:first-child{
        margin-right: 80px;
      }
    }
  }
</style>
