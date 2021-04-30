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
            <el-form :model="orderForm" :rules="orderFormRules" ref="orderForm" label-width="80px" class="demo-ruleForm"  @submit.native.prevent>
              <div class="skuInfos">
                <el-row v-if="orderForm.skuInfos">
                  <el-col v-for="(item,index) in orderForm.skuInfos" :key="index" class="skuInfosLI">
                    <el-form-item label="产品文件" :prop="`skuInfos.${index}.name`" :rules="skuInfosGroupRules.infoname">
                      <el-row type="flex" class="row-bg" justify="space-between">
                        <el-col :span="20" class="uploadBox">
                          <div class="upFile" @click="fileUpload(index)">
                            <img :src="file" alt="">
                            <p>上传文件</p>
                          </div>
                          <div v-if="item.name!=''" class="fileDiv">
                            <input type="text"  readonly v-model="item.name">
                            <img :src="delImg" alt="" @click="shanchuFile(index)">
                          </div>
                        </el-col>
                        <el-col :span="2" class="iconClose" >
                          <i class="el-icon-close" v-if="index!=0"  @click="deleteLadder(index)"></i>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <!-- <el-form-item label="字体颜色" :prop="`skuInfos.${index}.fontColor`" :rules="skuInfosGroupRules.infofontColor">
                      <el-radio-group v-model="item.fontColor" size="medium">
                        <el-radio border label="白色">白色</el-radio>
                        <el-radio border label="黄色">黄色</el-radio>
                      </el-radio-group>
                    </el-form-item> -->
                    <el-form-item label="产品尺寸" required>
                      <el-row>
                        <el-col :span="8">
                          <el-form-item :prop="`skuInfos.${index}.width`" :rules="skuInfosGroupRules.infowidth">
                            <el-input v-model="item.width" placeholder="宽（m）"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col class="line" :span="2">X</el-col>
                        <el-col :span="8">
                          <el-form-item :prop="`skuInfos.${index}.height`" :rules="skuInfosGroupRules.infoheight">
                            <el-input v-model="item.height" placeholder="高（m）"></el-input>
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
                <el-select v-model="orderForm.source" placeholder="请选择订单来源" style="width:100%" @change="sourceChange">
                  <el-option
                    v-for="item in cost.source"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客户姓名" prop="receiptName">
                <el-input v-model="orderForm.receiptName" placeholder="请输入客户姓名"></el-input>
              </el-form-item>
              <el-form-item label="联系方式" prop="receiptMobile">
                <el-input v-model="orderForm.receiptMobile" placeholder="请输入客户联系方式"></el-input>
              </el-form-item>
              <el-form-item label="配送方式" class="deliveryType">
                <el-radio-group v-model="orderForm.deliveryType" size="medium" @change="deliveryTypeChange">
                  <el-radio border v-for="item in cost.deliveryType" :label="item.value" :key="item.value">{{item.name}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-row v-if="orderForm.deliveryType!=3">
                <el-col>
                  <el-form-item label="物流公司" prop="waybillCode">
                    <el-select v-model="orderForm.waybillCode" placeholder="请选择物流公司" style="width:100%"  @change="waybillCodeChange">
                      <el-option v-for="item in wuliuList" :key="item.value" :label="item.name" :value="item.code"></el-option>
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
              <el-row v-else>
                <el-col>
                  <el-form-item label="自提地址" prop="pickUpAddress">
                    <el-select v-model="orderForm.pickUpAddress" placeholder="请选择自提地址" style="width:100%">
                      <el-option label="淮北·NO0001店：安徽省淮北市相山区古城路（二马路）与洪山路交叉口红绿灯路口68-5号" value="淮北·NO0001店：安徽省淮北市相山区古城路（二马路）与洪山路交叉口红绿灯路口68"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="orderButton">
                <el-col style="display:flex;align-items:center;justify-content: center;">
                  <span class="shibieqi" @click="shibieqiClick">地址识别器</span>
                  <el-form-item>
                    <el-button @click.prevent="resetForm('orderForm')" class="button">清除全部</el-button>
                    <el-button type="primary" @click.prevent="submitForm('orderForm')" class="button">提交订单</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </section>
          <section class="lookCont">
            <div class="imgbanner">
              <el-carousel :interval="5000" arrow="always" indicator-position="none" height="228px" :autoplay="false">
                <el-carousel-item v-for="item in 4" :key="item">
                  <img src="" alt="">
                </el-carousel-item>
              </el-carousel>
              <div class="magnifier">
                <i class="el-icon-search"></i>
              </div>
            </div>
            <ul>
              <li v-for="item in 4">
                <img src="" alt="">
                <p>禁止烧麦秸…</p>
              </li>
            </ul>
          </section>
        </div>
      </div>
      <!-- 弹框 -->
      <div class="mask" v-show="buzhouPorp" ref='select_frame' ondragstart="return false">
        <section class="uploadSection publicPorp">
          <div class="close" @click="Close">
            <i class="el-icon-close"></i>
          </div>
          <div class="buzhou">
            <el-steps :active="active" finish-status="success">
              <el-step title="上传文件"></el-step>
              <!-- <el-step title="上传文件"></el-step> -->
              <el-step title="确认上传"></el-step>
            </el-steps>
          </div>
          <div class="uploadcont">
            <section class="choicesection" v-if="active==1">
              <div class="choiceBox tuozhuai">
                <el-upload
                  class="upload-demo"
                  action=""
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  >
                  <img :src="file" alt="">
                  <p>上传文件</p>
                </el-upload>
              </div>
              <!-- <div class="choiceBox" @click="shejiqiClick(2)">
                <img :src="shejiqi" alt="">
                <p>上传文件</p>
              </div> -->
            </section>
            <div v-if="active==2">
              <section class="cont" v-if="buzhou==2">
                <h5>2021-03-21</h5>
                <ul>
                  <li>
                    <p class="rodioBox">
                      <el-radio v-model="radio" label="1"><br></el-radio>
                    </p>
                    <span>我认为，大多数设计师只是试图从他们已经做过的事情中努力，在讲故事方面并</span>
                  </li>
                  <li>
                    <p class="rodioBox">
                      <el-radio v-model="radio" label="1"><br></el-radio>
                    </p>
                    <span>我认为，大多数设计师只是试图从他们已经做过的事情中努力，在讲故事方面并</span>
                  </li>
                </ul>
              </section>
              <section class="cont" v-if="buzhou==1">
                <ul>
                  <li v-for="item in localList">
                    <span>{{item}}</span>
                  </li>
                </ul>
              </section>
            </div>
            <section class="complete" v-if="active==3">
              <img :src="complete" alt="">
              <span>上传完成</span>
            </section>
            <div class="btn" v-if="active==1">
                <button class="close" @click.prevent="Close">取消</button>
                <button @click.prevent="firstNext">下一步</button>
            </div>
            <div class="btn" v-if="active==2">
                <button @click.prevent="lastStep">上一步</button>
                <button @click.prevent="finishBtn">完成</button>
            </div>
            <!-- <div class="btn" v-if="active==3">
                <button @click.prevent="lastStep">上一步</button>
                <button @click.prevent="finishBtn">完成</button>
            </div> -->
          </div>
        </section>
      </div>
    
 

     <!-- 确认订单弹框 -->
      <section class="orderTruePorp publicPorp" v-show="orderTruePorp">
        <h3>商品详情</h3>
        <ul class="orderTrue" v-for="item in orderForm.skuInfos">
          <li>
            <span class="tit">产品文件</span>
            <div  class="info">
              <span class="titname">{{item.name}}</span>
            </div>
          </li>
          <!-- <li>
            <span class="tit">字体颜色</span>
            <div class="info">
              <span class="name">{{item.fontColor}}</span>
            </div>
          </li> -->
          <li>
            <span class="tit">产品尺寸</span>
            <div class="info">
              <span class="name">宽{{item.width}}m*高{{item.height}}m</span>
              <p>{{item.remark}}</p>
            </div>
          </li>
          <li>
            <span class="tit">产品数量</span>
            <div class="info">
              <span class="name">{{item.num}}</span>
            </div>
          </li>
        </ul>
        <ul class="orderTrue">
          <li>
            <span class="tit">订单标题</span>
            <div  class="info">
              <span class="name">{{orderForm.title}}</span>
            </div>
          </li>
          <li>
            <span class="tit">订单来源</span>
            <div  class="info">
              <span class="name">{{orderForm.sourceName}}</span>
            </div>
          </li>
          <li>
            <span class="tit">客户姓名</span>
            <div class="info">
              <span class="name">{{orderForm.receiptName}}</span>
            </div>
          </li>
          <li>
            <span class="tit">联系方式</span>
            <div class="info">
              <span class="name">{{orderForm.receiptMobile}}</span>
            </div>
          </li>
          <li>
            <span class="tit">配送方式</span>
            <div class="info">
              <span class="name">{{orderForm.deliveryTypeName}}</span>
              <span class="ziti" v-if="orderForm.deliveryType==3">（{{orderForm.pickUpAddress}}）</span>
            </div>
          </li>
          <template  v-if="orderForm.deliveryType!=3">
            <li>
              <span class="tit">物流公司</span>
              <div class="info">
                <span class="name">{{orderForm.waybillCodeName}}</span>
              </div>
            </li>
            <li>
              <span class="tit">配送地址</span>
              <div class="info">
                <span class="name">{{orderForm.Address+orderForm.receiptDetailAddress}}</span>
              </div>
            </li>
          </template>
        </ul>
        <div class="orderButton trueorderButton">
          <button @click.prevent="orderTrueClose" class="button">取消</button>
          <button type="primary" @click.prevent="submitOrder" v-button class="button">提交订单</button>
        </div>
      </section>

      <!-- 地址识别器弹窗 -->
      <section class="publicPorp shibieqiPorp" v-show="shibieqiPorp">
        <div class="textare">
          <el-input  type="textarea" placeholder="请粘贴或输入地址" v-model="orderForm.textarea"></el-input>
        </div>
        <div class="orderButton trueorderButton">
          <button @click.prevent="Close" class="button">取消</button>
          <button @click.prevent="trueShibie" v-button class="button">确定</button>
        </div>

      </section>
      <div class="mask" v-show="publicPorp"></div>
  </div>
</template>

<script>
import AddressParse from 'address-parse';
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  name: 'downOrder',
  data () {
    var widthHeight = (rule,value,callback) => {
      if(value){
        value = String(value)
        let values = value.replace('/(^\s*)|(\s*$)','')  //去除字符串前后空格
        let num = Number(values)  //将字符串转换为数
        if(isNaN(num)){  //判断是否是非数字
          callback(new Error('尺寸必须为数字'));
        }else if(value === ''|| value === null){  //空字符串和null都会被当做数字
          callback(new Error('尺寸必须为数字类型'));
        }else{

          if(value % 1 === 0){
            callback();
          }else{
            let changdu = value.toString().split(".")[1].length

            if(changdu>3){
              callback(new Error('最多输入小数点后3位'));
            }else{
              callback();
            }
          }
        }
      }else{
        callback(new Error('请输入尺寸'));
      }
    };
    var numRule = (rule,value,callback) => {
      if(value){
        console.log(value)
        value = String(value)
        let values = value.replace('/(^\s*)|(\s*$)','')  //去除字符串前后空格
        let num = Number(values)  //将字符串转换为数
        if(isNaN(num)){  //判断是否是非数字
          callback(new Error('数量必须为数字'));
        }else if(value === ''|| value === null){  //空字符串和null都会被当做数字
          callback(new Error('数量必须为数字类型'));
        }else{
          if(value>0){
            callback();
          }else{
            callback(new Error('数量必须大于0'));
          }
        }
      }else{
        callback(new Error('请输入数量'));
      }
    };
    var receiptMobileRule = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系人电话'));
      } else {
        let mobile = /^1(3|4|5|6|7|8|9)\d{9}$/; //最新16手机正则
        if (!mobile.test(value)) {
          return callback(
            new Error("手机号格式不正确")
          );
        } 
        callback();        
      }
    };
    return {
      radio:'1',
      active: 1,
      options: regionData,
      CodeToText,
      crumbsName:'',
      orderForm:{
        skuInfos:[],
        //  skuInfos:[
        //   {
        //     productCode:'',
        //     fontColor:'白色',
        //     height:'',
        //     num: 1,
        //     remark: '',
        //     width:'',
        //     name:'',//文件的名字
        //   }
        // ],
        title:'',
        source:'', //订单来源，
        sourceName:'',
        receiptName:'', //客户姓名
        receiptMobile:'',
        deliveryType:'1', //如果是邮寄和同城配送的话，要选择收货地址等，如果是自提需要选择自提门店
        deliveryTypeName:'邮寄',
        waybillCode:'STO', //物流公司
        waybillCodeName:'申通快递',
        receiptAddress:'', //收货人的地址 （省＋市＋区） //这是是省市区的码
        Address:'', //省市区码转换过的文字,下订单的时候用这个
        receiptDetailAddress:'', //收货人详情地址
        pickUpAddress:'', //自提点
        textarea:'', //自动识别的内容
      },
      orderFormRules: {
        title: [
          { required: true, message: '请输入订单标题', trigger: 'blur' }
        ],
        source: [
          { required: true, message: '请选择订单来源', trigger: 'change' }
        ],
        receiptName: [
          { required: true, message: '请输入客户姓名', trigger: 'blur' }
        ],
        receiptMobile: [
          { required: true, validator: receiptMobileRule, trigger: 'blur' }
        ],
        waybillCode: [
          { required: true, message: '请选择物流公司', trigger: 'change' }
        ],
        receiptAddress: [
          { required: true, message: '请选择省市区', trigger: 'change' }
        ],
        pickUpAddress: [
          { required: true, message: '请选择自提地址', trigger: 'change' }
        ],
        receiptDetailAddress: [
          { required: true, message: '请输入详情地址', trigger: 'blur' }
        ],
      },
      skuInfosGroupRules: {
        infoname: [{required: true,  message: '请上传文件',  trigger: 'blur'}],
        infowidth: [{required: true,  validator: widthHeight,  trigger: 'blur'}],
        infoheight: [{required: true, validator: widthHeight, trigger: 'blur'}],
        inforemark: [{required: true, message: '请输入订单具体信息', trigger: 'blur'}],
        infonum: [{required: true, validator: numRule, trigger: 'blur'}],
      },
      delImg:require('../../assets/img/delImg.png'),
      file:require('../../assets/img/file.png'),
      shejiqi:require('../../assets/img/shejiqi.png'),
      complete:require('../../assets/img/complete.png'),
      buzhou:1, //1.本地上传，2.设计器上传
      buzhouPorp:false,
      orderTruePorp:false, //订单确认
      publicPorp:false, //遮罩层
      wuliuList:[],
      localList:[],
      sort:0,
      wenjianNanme:'',
      wenjianCode:'',
      customerId:0,
      skuId:0,
      orderId:0,
      typesName:0,
      shibieqiPorp:false
    }
  },
  created(){
    this.listExpressCompany()   // 获取物流公司
    let userInfo = this.$store.getters.getUserInfo
    this.customerId = userInfo.id //用户的id
    this.skuId = this.$route.query.id //产品的id
    this.crumbsName = this.$route.query.name
    this.typesName = this.$route.query.type  //  0再来一单，1编辑订单
  },
  mounted(){
    // 拖拽上传文件
    this.$refs.select_frame.ondragleave = (e) => {
      e.preventDefault()  // 阻止离开时的浏览器默认行为
    }
    this.$refs.select_frame.ondrop = (e) => {
      e.preventDefault()    // 阻止拖放后的浏览器默认行为
      const data = e.dataTransfer.files[0]  // 获取文件对象
      if (data.length < 1) {
        return  // 检测是否有文件拖拽到页面
      }
      console.log(data)
      // this.upload(data)//上传文件的方法
      this.productionUpload(data)
    }
    this.$refs.select_frame.ondragenter = (e) => {
      e.preventDefault()  // 阻止拖入时的浏览器默认行为
      this.$refs.select_frame.border = '2px dashed red'
    }
    this.$refs.select_frame.ondragover = (e) => {
      e.preventDefault()    // 阻止拖来拖去的浏览器默认行为
    }
  },
  methods:{
    // 获取物流
    listExpressCompany(){
      this.$post('get',this.baseUrl + '/order/listExpressCompany',
      ).then((res) => {
        if (res.code == 200) {
          this.wuliuList = res.data
          let dingdanid = this.$route.query.orderId //订单的id
          if(dingdanid){
            this.orderId = dingdanid
            this.getByIdInfo(dingdanid) // 获取订单的信息
          }else{
            this.orderForm.skuInfos.push(
              {
                productCode:'',
                // fontColor:'白色',
                height: '',
                num: 1,
                remark: '',
                width: '',
                name:'',
              }
            );
          }
        }
       
      })
    },
    // 获取订单信息
    getByIdInfo(orderId){
        let { orderForm } = this
        this.$post('post',this.baseUrl + '/order/getById',{
          orderId
        }).then((res) => {
          if (res.code == 200) {
            let data = res.data
            data.orderSkus.forEach((item,index)=>{
              let info ={
                productCode:item.attributes.productCode,
                fontColor:item.attributes.fontColor,
                height:item.attributes.height/1000,
                num:item.num,
                remark:item.attributes.remark,
                width:item.attributes.width/1000,
                name:item.attributes.productName,//文件的名字
              }
              orderForm.skuInfos.push(info)
            })

            let source = data.source
            let deliveryType = data.orderAttr.deliveryType


            orderForm.title=data.orderAttr.title
            orderForm.source=data.source//订单来源，

            if(source==1){
              orderForm.sourceName = '淘宝'
            }
            if(source==2){
              orderForm.sourceName = '京东'
            }
            if(source==3){
              orderForm.sourceName = 'PDD'
            }
            if(source==4){
              orderForm.sourceName = '线下'
            }

            orderForm.receiptName = data.orderAttr.receiptName //客户姓名
            orderForm.receiptMobile = data.orderAttr.receiptMobile
            orderForm.deliveryType = data.orderAttr.deliveryType //如果是邮寄和同城配送的话，要选择收货地址等，如果是自提需要选择自提门店
            if(deliveryType==1){
              orderForm.deliveryTypeName = '邮寄'
            }
            if(deliveryType==2){
              orderForm.deliveryTypeName = '同城配送'
            }
            if(deliveryType==3){
              orderForm.deliveryTypeName = '自提'  
              //如果是自提 物流公司 省市区 详情地址为空 否则 自提地址为空
              orderForm.waybillCode='' // 物流的code
              orderForm.waybillCodeName='' // 物流的名字
              orderForm.receiptDetailAddress='' // 详细地址
              orderForm.receiptAddress='' // 省市区码
              orderForm.Address='' // 省市区
              orderForm.pickUpAddress = data.orderAttr.pickUpAddress //自提地址 
            }else{
              let wuliuCode = data.orderAttr.waybillCode
              orderForm.waybillCode = wuliuCode// 物流的code
              console.log(this.wuliuList)
              this.wuliuList.forEach((item,index)=>{
                if(wuliuCode==item.code){
                  console.log(item.name)
                   orderForm.waybillCodeName= item.name   // 物流的名字
                }
              })

              orderForm.receiptDetailAddress = data.orderAttr.receiptDetailAddress// 详细地址

              let dizhi = data.orderAttr.receiptAddress
              var reg = /.+?(省|市|自治区|自治州|县|区)/g;

              let addressInfo  = dizhi.match(reg)

              let prov = TextToCode[addressInfo[0]]
              let provCode = prov.code
  
              let city = TextToCode[addressInfo[0]] [addressInfo[1]]
              let cityCode = city.code
    

              let dist = TextToCode[addressInfo[0]] [addressInfo[1]] [addressInfo[2]]
              let distCode = dist.code
  
              orderForm.receiptAddress= [provCode, cityCode, distCode]// 省市区码
              
              orderForm.Address = data.orderAttr.receiptAddress// 省市区

              orderForm.pickUpAddress = '' //自提地址 
            }            
          }
        })
    },
    // 上传文件
    beforeAvatarUpload(file) {
      this.productionUpload(file)
    },

    // 上传文件请求
    productionUpload(file){
      this.localList = [] //上传之前先清空
      let name = file.name
      console.log(name)
      let param = new FormData(); // 创建form对象
      param.append("file",file);
      param.append("name",name); 
      this.$post('post',this.baseUrl +'/production/upload',param,'upload'
      ).then((res) => {
        if (res.code == 200) {
          let { localList } = this
          this.active =2
          this.buzhou = 1
          this.wenjianNanme = name
          localList.push(name)
          this.wenjianCode  = res.data
        }
      })
    },
    // 点击上传
    fileUpload(val){
      console.log(val)
      this.buzhouPorp = true
      this.sort = val
    },

    // 点击识别器
    shibieqiClick(){
      this.publicPorp=true
      this.shibieqiPorp = true
    },

    // 自动识别地址及姓名
    trueShibie(){

      this.pasteAddress(this.orderForm.textarea)
    },
    pasteAddress(val){
      let { orderForm } = this
      const [result, ...results] = AddressParse.parse(val, true);

      // console.log(result);
      // console.log(results)

      let info = result
      console.log(info)
      if(info==undefined){
        return false
      }
      
      orderForm.receiptName = info.name //姓名
      orderForm.receiptMobile = info.mobile //手机号

      if(orderForm.deliveryType!=3){
        let provCode
        let cityCode
        let distCode
        
        if(info.province){
          let prov = TextToCode[info.province]
          provCode = prov.code
        }

        if (info.city) {
          let city = TextToCode[info.province] [info.city]
          cityCode = city.code
        }

        if (info.area) {
          let dist = TextToCode[info.province] [info.city] [info.area]
          distCode = dist.code   
        }
        
        orderForm.receiptAddress = [provCode, cityCode, distCode]  //收货人的地址 （省＋市＋区） //这是是省市区的码
        orderForm.Address = info.province +  info.city + info.area  //收货人的地址 文字

        orderForm.receiptDetailAddress = info.details //收货人详情地址
      }

      this.publicPorp=false
      this.shibieqiPorp = false



    },
    // 下一步
    next() {this.active++},
    // 点击面包屑
    // 完后上传
    finishBtn(){
      let { sort, wenjianNanme, wenjianCode } = this
      this.orderForm.skuInfos[sort].name = wenjianNanme
      this.orderForm.skuInfos[sort].productCode = wenjianCode
      this.buzhou = 1 //1.本地上传，2.设计器上传
      this.buzhouPorp = false
      this.publicPorp = false
      this.active = 1
      this.wenjianNanme=''
      this.wenjianCode=''
    },
    pathIndex(){
      console.log(111)
      this.$router.go(-1)
    },
    // 移除整个产品
    deleteLadder(index){
      this.confirm_pop("确定移除该产品吗？").then(res=>{
        if(this.orderForm.skuInfos.length>1){
          this.orderForm.skuInfos.splice(index,1);
        }
      })
    },
    // 删除某个产品中的文件
    shanchuFile(val){
      this.confirm_pop("确定删除该文件吗？").then(res=>{
        this.orderForm.skuInfos[val].name = ''
        this.orderForm.skuInfos[val].productCode = ''
      })
    },
    // 选择订单来源
    sourceChange(val){
      console.log(val)
      if(val==1){
        this.orderForm.sourceName = '淘宝'
      }
      if(val==2){
        this.orderForm.sourceName = '京东'
      }
      if(val==3){
        this.orderForm.sourceName = 'PDD'
      }
      if(val==4){
        this.orderForm.sourceName = '线下'
      }
    },
    // 邮寄方式
    deliveryTypeChange(val){
      if(val==1){
        this.orderForm.deliveryTypeName = '邮寄'
      }
      if(val==2){
        this.orderForm.deliveryTypeName = '同城配送'
      }
      if(val==3){
        this.orderForm.deliveryTypeName = '自提'  

        //如果是自提 物流公司 省市区 详情地址为空 否则 自提地址为空
        this.orderForm.waybillCode='' // 物流的code
        this.orderForm.waybillCodeName='' // 物流的名字
        this.orderForm.receiptDetailAddress='' // 详细地址
        this.orderForm.receiptAddress='' // 省市区码
        this.orderForm.Address='' // 省市区码

      }else{
        this.orderForm.waybillCode='STO' // 物流的code
        this.orderForm.waybillCodeName='申通快递' // 物流的名字
        this.orderForm.pickUpAddress = '' //自提地址 
        this.pasteAddress(this.orderForm.textarea)
      }

    },
    // 物流公司
    waybillCodeChange(name){
      console.log(name)
      this.wuliuList.forEach((item,index)=>{
        if(name==item.code){
          this.orderForm.waybillCodeName= item.name
        }
      })
    },
    // 添加产品
    addLadder(){
      this.orderForm.skuInfos.push(
        {
          productCode:'',
          // fontColor:'白色',
          height: '',
          num: 1,
          remark: '',
          width: '',
          name:'',
        }
      );
    },
    // 订单提交验证
    submitForm(formName){
      console.log(formName)
      this.$refs[formName].validate((valid,obj) => {
        if (valid) {
          this.orderTruePorp = true
          this.publicPorp = true//遮罩层
        } else {
        }
      });
    },
    // 全部清除
    resetForm(formName){
      this.confirm_pop("确定要全部清空吗？").then(res=>{
        this.$refs[formName].resetFields();
        this.orderForm.skuInfos = [
          {
            productCode:'',
            // fontColor:'白色',
            height: '',
            num: 1,
            remark: '',
            width: '',
            name:'',
          }
        ];
        this.orderForm.deliveryType = '1'//如果是邮寄和同城配送的话，要选择收货地址等，如果是自提需要选择自提门店
        this.orderForm.deliveryTypeName = '邮寄'
        this.orderForm.waybillCode = 'STO' //物流公司
        this.orderForm.waybillCodeName = '申通快递'
        this.orderForm.textarea = ''
      })
    },
    cityChange(val){ //选择收货地址
      this.orderForm.Address = this.CodeToText[val[0]] + this.CodeToText[val[1]] + this.CodeToText[val[2]]
    }, 
    // 点击设计器
    shejiqiClick(val){
      this.active++
      this.buzhou = val
    },
    // 关闭上传弹框
    Close(){

      this.buzhouPorp=false
      this.publicPorp=false
      this.shibieqiPorp = false
    },
    // 关闭确认订单弹框
    orderTrueClose(){
      this.publicPorp=false
      this.orderTruePorp=false//订单确认
    },
    // 第一步
    firstNext(){
      this.$message('请选择一种方式上传文件');
    },
    // 上一步
    lastStep(){
      this.active--
    },
    // 订单确定弹框提交
    submitOrder(){
      let { orderForm,customerId,skuId,orderId,typesName } = this

      let skuInfosList = JSON.parse(JSON.stringify(orderForm.skuInfos));
      
      skuInfosList.forEach((i,key)=>{
        console.log(key)
        skuInfosList[key].width=i.width*1000
        skuInfosList[key].height=i.height*1000
      })
      
      let data = {
        customerId,
        deliveryType:orderForm.deliveryType,
        pickUpAddress:orderForm.pickUpAddress,
        receiptAddress:orderForm.Address,
        receiptDetailAddress:orderForm.receiptDetailAddress,
        receiptMobile:orderForm.receiptMobile,
        receiptName:orderForm.receiptName,
        skuId,
        title:orderForm.title,
        skuInfos:skuInfosList,
        source:orderForm.source,
        waybillCode:orderForm.waybillCode
      }

      console.log(data)

      let url 
      if(typesName!=1){
        url = '/order/submit'

        localStorage.removeItem('orderInfo');
        this.$store.state.orderInfo = '';

      }else{
        url = '/order/update'
        this.$set(data,'orderId',orderId)
      }
      console.log(url)
      console.log(data)
      this.$post('post',this.baseUrl + url,data
      ).then((res) => {
        if (res.code == 200) {
          this.$message({
            message:res.msg,
            type: 'success'
          });
          setTimeout(()=>{
           this.$router.replace('/order')
          },500)
        }else{
          this.$message({
            message:res.msg,
            type: 'warning'
          });
        }
      })
    }
    
  },
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

      .uploadBox {
        display: flex;
        align-items: center;
        .upFile{
          margin-right: 20px;
          width: 62px;
          height: 62px;
          border: 1px dashed #CDCEE1;
          line-height: normal;
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          img{
            width: 22px;
            height: 22px;
          }
          p{
            font-size: 12px;
            color: #666;
            line-height: normal;
          }
        }

        .fileDiv{
          line-height: normal;
          width: 88px;
          height: 32px;
          background: #E7E8F4;
          border-radius: 10px;
          padding: 0 5px;
          position: relative;
          // p{
          //   display: -webkit-box;
          //   -webkit-box-orient: vertical;
          //   -webkit-line-clamp: 1;
          //   overflow: hidden;
          //   line-height: 32px;
          //   font-size: 12px;
          // }
          input{
            font-size: 12px;
            line-height: 32px;
            width: 100%;
            height: 100%;
          }
          img{
            position: absolute;
            right: -5px;
            top: -5px;
            width: 16px;
            height: 16px;
            cursor: pointer;
          }
        }
      }
      .iconClose{
        text-align: right;
        i{
          font-size: 25px;
          color: #999;
          cursor: pointer;
        }
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
    height: 382px;
    padding: 24px 24px 8px;
    border-radius: 10px;

    .imgbanner{
      position: relative;
      .el-carousel__item{
        text-align: center;
      }
      img{
        width: 280px;
        height: 228px;
        border-radius: 10px;
      }

      .magnifier{
        position: absolute;
        bottom: 11px;
        right: 31%;
        z-index: 11;

        i{
          background: rgba(0, 0, 0, 0.4);
          width: 44px;
          height: 44px;
          display: inline-block;
          text-align: center;
          line-height: 44px;
          font-size: 28px;
          color: #fff;
          border-radius: 50%;
          cursor: pointer;
        }
      }
    }

  

    ul{
      border-top: 1px solid #CBCFE3;
      padding-top: 8px;
      display: flex;
      align-items: center;
      height:99px;
      overflow-x: scroll;
      margin-top: 24px;
      li{
        margin-right: 24px;
        img{
          width: 76px;
          height: 58px;
          border-radius: 10px;
          border: 1px solid #FFEF40;
        }
        p{
          font-size: 12px;
          margin-top: 8px;
        }
      }
    }
    
  }

  .orderButton{
    text-align: center;
    .button{
      width: 124px;
      height: 32px;
      background: #DBDBDB;
      border-radius: 4px;
      text-align: center;
      line-height: 32px;
      padding: 0;
      border: none;
    }
    .button:nth-child(2){
      background: #3551DF;
      color: #fff;
      margin-left: 32px;
    }

    .shibieqi{
      color: #409EFF;
      cursor: pointer;
      text-decoration: underline;
    }
  }
  .trueorderButton{
    margin-top: 32px;
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
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

          }
        }
      }
    }
    .choicesection{
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 84px;
      

      .choiceBox{
        width: 100px;
        height: 100px;
        text-align: center;
            border-radius: 8px;

        img{
          width: 22px;
          height: 22px;
        }
        p{
          font-size: 12px;
          color: #666;
        }
      }

      .tuozhuai{
        border: 1px dashed #CDCEE1;
      }
      .choiceBox:nth-child(2){
        background: #E6E9F8;
        border-radius: 8px;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        margin-left: 100px;
        p{
          color: #3551DF;
          margin-top: 3px;
        }
      }
      
    }

    .complete{
      display: flex;
      align-items: center;
      justify-content: center;
      padding-top: 118px;

      img{
        width: 32px;
        height: 32px;
        margin-right: 8px;
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
      .close{
        background: #DBDBDB;
        color: #333;
      }
    }
  }

  // 确认订单弹框
  .orderTruePorp{
    width: 624px;
    max-height: 80%;
    overflow-y: scroll;
    background: #FFFFFF;
    box-shadow: 0px 4px 31px 0px rgba(0, 0, 0, 0.13);
    border-radius: 10px;
    padding: 24px;

    h3{
      font-size: 16px;
    }

    .orderTrue{
      padding-top: 24px;
      border-bottom: 1px solid #CBCFE3;
      li{
        display: flex;
        margin-bottom: 24px;
        .titname{
          background: #DBDBE2;
          border-radius: 10px;
          padding: 8px 4px;
          font-size: 12px;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .tit{
          color: #666;
          width: 88px;
        }

        .info{
          flex: 1;
          overflow: hidden;
        }

        .name{
          margin-bottom: 8px;
          display: inline-block;
        }
        .ziti{
          color: #3551DF;
        }
        p{
          background: #F8F8FA;
          border-radius: 10px;
          width: 100%;
          padding: 8px;
          color: #666;
          line-height: 20px;
        }
      }
    }
  }

 
</style>
