<template>
  <div class="connonBg main">
       <div class="crumbsHeader">
            <div class="crumbs">
              <span @click="pathIndex()">订单提交&nbsp/&nbsp</span>
              <span>{{crumbsName}}</span>
          </div>
        </div>
      <div class="center">
        <div class="orderContBox">
          <section class="orderCont">
            <component :is="shopInfoComponent" ref="sonMethod" :skuInfos="shopInfo" @detailChange="attrDetails"></component>
            <el-form :model="orderForm" :rules="orderFormRules" ref="orderForm" label-width="80px" class="demo-ruleForm"  @submit.native.prevent>         
              <el-form-item label="订单标题" prop="title" class="orderTitle">
                <el-input v-model="orderForm.title" placeholder="请输入订单标题"  maxlength="200" show-word-limit></el-input>
              </el-form-item>
              <el-form-item label="订单来源" prop="source">
                <el-select v-model="orderForm.source" placeholder="请选择订单来源" style="width:100%" @change="sourceChange" :disabled="orderForm.sourceDisabled">
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
              <el-form-item label="物流公司" prop="waybillCode" v-if="orderForm.deliveryType==1">
                <el-select v-model="orderForm.waybillCode" placeholder="请选择物流公司" style="width:100%"  @change="waybillCodeChange">
                  <el-option v-for="item in wuliuList" :key="item.value" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-row v-if="orderForm.deliveryType!=3">
                <el-col>
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
            <div class="imgbannerBox">
              <div class="imgbanner" v-if="skuId==2 || skuId==5">
                <el-carousel :interval="5000" arrow="always" indicator-position="none" height="228px" :autoplay="false">
                    <el-carousel-item  v-for="(item,index) in orderForm.skuInfos" :key="index" >
                      <img :src="item.img" alt="">
                          <div class="magnifier"  @click="lookBigImg(item.img)">
                            <i class="el-icon-search"></i>
                          </div>
                    </el-carousel-item>
                </el-carousel>
              </div>
              <ul v-if="skuId==2 || skuId==5">
                <li v-for="(item,index) in orderForm.skuInfos" :key="index" >
                  <img :src="item.img" alt="">
                  <p>{{item.name}}</p>
                </li>
              </ul>
            </div>
            <div class="url">
              <iframe :src="skuIdUrl" frameborder="0"></iframe>
            </div>
          </section>
        </div>
      </div>
 
     <!-- 确认订单弹框 -->
      <section class="orderTruePorp publicPorp" v-show="orderTruePorp">
        <template v-if="skuId!=4">
          <h3>商品详情</h3>
          <ul class="orderTrue" v-for="(item,index) in orderForm.skuInfos" :key="index">
            <li>
              <span class="tit">产品文件</span>
              <div  class="info">
                <span class="titname">{{item.name}}</span>
              </div>
            </li>
            <li v-if="item.fontColor">
              <span class="tit">字体颜色</span>
              <div class="info">
                <span class="name">{{item.fontColor}}</span>
              </div>
            </li>
            <li v-if="item.paper">
              <span class="tit">材料选择</span>
              <div class="info">
                <span class="name">{{item.paper}}</span>
              </div>
            </li>
            <li>
              <span class="tit">产品尺寸</span>
              <div class="info">
                <span class="name">长度{{item.width}}m*宽度{{item.height}}m</span>
                <p>{{item.remark}}</p>
              </div>
            </li>

            <li v-for="(i,key) in item.crafts" > 

              <span class="tit">{{key}}{{index+1}}</span>
              <div class="info">
                <span class="name">{{i}}</span>
              </div>
            </li>   
            <li>
              <span class="tit">产品数量</span>
              <div class="info">
                <span class="name">{{item.num}}</span>
              </div>
            </li>
          </ul>
        </template>
        <template v-else>
          <div  v-for="(item,index) in orderForm.skuInfos" :key="index">
            <div class="ullist">
              <h3>文件信息{{index+1}}</h3>
              <ul class="orderTrue">
                <li>
                  <span class="tit">产品文件</span>
                  <div  class="info">
                    <span class="titname">{{item.name}}</span>
                  </div>
                </li>
                <!-- <li>
                  <span class="tit">产品文件{{index+1}}</span>
                  <div class="info infoUL">
                    <template v-if="item.name.length>1">
                      <div v-for="i in item.name" class="li">
                             <el-tooltip class="item" effect="dark" :content="i.val" placement="bottom-start">
                              <span class="titname">{{i.val}}</span>
                            </el-tooltip>
                      </div>
                    </template>
                    <template v-else>
                      <span class="titname" v-for="i in item.name">{{i.val}}</span>
                    </template>
                  </div>
                </li> -->
                <li v-if="item.dayinStyle">
                  <span class="tit">打印风格{{index+1}}</span>
                  <div class="info">
                    <span class="name">{{item.dayinStyle}}</span>
                  </div>
                </li>
                <li v-if="item.dayinNum">
                  <span class="tit">打印面数{{index+1}}</span>
                  <div class="info">
                    <span class="name">{{item.dayinNum}}</span>
                  </div>
                </li>
                <li v-if="item.dayinSize">
                  <span class="tit">打印尺寸{{index+1}}</span>
                  <div class="info">
                    <span class="name">{{item.dayinSize}}</span>
                  </div>
                </li>
                <li v-if="item.dayinCailiao">
                  <span class="tit">打印材料{{index+1}}</span>
                  <div class="info">
                    <span class="name" v-if="item.dayinCailiao == '彩色复印纸'">{{item.caiseFuyin}}</span>
                    <span class="name" v-if="item.dayinCailiao == '铜版纸'">{{item.tongbanzhi}}</span>
                    <span class="name" v-if="item.dayinCailiao == '白卡纸'">{{item.baikazhi}}</span>

                    <span class="name" v-if="item.dayinCailiao != '白卡纸' && item.dayinCailiao != '铜版纸' && item.dayinCailiao != '彩色复印纸'">{{item.dayinCailiao}}</span>
                  </div>
                </li>
                <li v-if="item.dayinCailiao == '彩色复印纸'">
                  <span class="tit">材料颜色{{index+1}}</span>
                  <div class="info color">
                    <span class="name" :style="'background:'+ item.cailiaoyanse"></span>
                  </div>
                </li>
                <li v-if="item.zhaungding">
                  <span class="tit">装订方式{{index+1}}</span>
                  <div class="info">
                    <span class="name">{{item.zhaungding}}</span>
                  </div>
                </li>
              </ul>
            </div>

            <div class="ullist" v-if="item.zhaungding!='无' && item.zhaungding!=''">
              <h3>封面信息{{index+1}}</h3>
              <ul class="orderTrue">
                <li v-if="item.fengmianCailiao">
                  <span class="tit">封面材料{{index+1}}</span>
                  <div class="info">
                    <span class="name" v-if="item.fengmianCailiao!='铜版纸'">{{item.fengmianCailiao}}</span>
                    <span class="name" v-else>{{item.fengmianTongbanzhi}}</span>
                  </div>
                </li>
                <li v-if="item.fengmianGongyi">
                  <span class="tit">封面工艺{{index+1}}</span>
                  <div class="info">
                    <span class="name">{{item.fengmianGongyi}}</span>
                  </div>
                </li>
                <li v-if="item.fengmianCailiao == '平面皮纹纸' || item.fengmianCailiao == '凹凸皮纹纸' ">
                  <span class="tit">封面颜色{{index+1}}</span>
                  <div class="info color">
                    <span class="name" :style="'background:'+ item.yanse"></span>
                  </div>
                </li>
              </ul>
            </div>

            <div class="ullist">
              <h3>订单数量{{index+1}}</h3>
              <ul class="orderTrue">
                <li>
                  <span class="tit">订单数量{{index+1}}</span>
                  <div class="info">
                    <span class="name">{{item.num}}</span>
                  </div>
                </li>
                <li>
                  <span class="tit">备注信息{{index+1}}</span>
                  <div class="info">
                    <p>{{item.remark}}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </template>
        

        

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
            <li v-if="orderForm.waybillCodeName!=''">
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
        <div class="orderButton trueorderButton" style="margin-top:25px">
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


      <!-- 查看大图 -->
      <el-image-viewer 
        v-if="showViewer" 
        :on-close="closeViewer" 
        :url-list="[showViewerUrl]" />


  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import RedBanner from './components/redBanner' //条幅
import FlagBanner from './components/flagBanner' //旗帜
import AllOrder from './components/allOrder' //通用下单
import PrinTing from './components/prinTing' //打印
import huwaiXiezhen from './components/huwaiXiezhen' //户外写真
import huneiXiezhen from './components/huneiXiezhen' //户内写真
import huwaiJingpen from './components/huwaiJingpen' //户外精喷
import penhui from './components/penhui' //喷绘
import AddressParse, {AREA, Utils} from 'address-parse' 
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  name: 'downOrder',
  components: {
    RedBanner,
    FlagBanner,
    AllOrder,
    PrinTing,
    ElImageViewer,
    huwaiXiezhen,
    huneiXiezhen,
    huwaiJingpen,
    penhui
  },
  data () {
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
      chongzhiPorp:false,
      radio:'1',
      active: 1,
      options: regionData,
      CodeToText,
      crumbsName:'',
      orderForm:{
        skuInfos:[],
        title:'',
        source:'4', //订单来源，
        sourceDisabled:false,
        sourceName:'线下',
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
      orderTruePorp:false, //订单确认
      publicPorp:false, //遮罩层
      wuliuList:[],
      customerId:0,
      skuId:0,
      orderId:0,
      typesName:0,
      shibieqiPorp:false,
      skuIdUrl:'',
      shopInfo:[],
      shopInfoComponent:'',
      showViewer:false,// 显示查看器
      showViewerUrl:'',
    }
  },
  created(){
    
    this.listExpressCompany()   // 获取物流公司
    let userInfo = this.$store.getters.getUserInfo
    this.customerId = userInfo.id //用户的id
    let skuId = this.$route.query.id //产品的id
    this.skuId = skuId
    this.crumbsName = this.$route.query.name
    this.typesName = this.$route.query.type  //  0再来一单，1编辑订单
    this.skuIdUrl = 'https://api.gundongyongheng.com/new/?act=get&id='+ this.$route.query.id

    console.log(skuId);



    if (skuId==2 || skuId==5) {
      this.shopInfoComponent = 'RedBanner'
    }

    if (skuId==6) {
      this.shopInfoComponent = 'FlagBanner'
    }

    if (skuId==7) {
      this.shopInfoComponent = 'AllOrder'
    }

    if (skuId==4) {
      this.shopInfoComponent = 'PrinTing'
    }

    if (skuId==8) {
      this.shopInfoComponent = 'penhui'
    }

    if (skuId==9) {
      this.shopInfoComponent = 'huwaiXiezhen'
    }

    if (skuId==10) {
      this.shopInfoComponent = 'huneiXiezhen'
    }

    if (skuId==11) {
      this.shopInfoComponent = 'huwaiJingpen'
    }
    

  },
  mounted(){
  },
  methods:{
    // 大图预览
    lookBigImg(val){
      console.log(val);
      if(val){
        this.showViewer = true
        this.showViewerUrl = val 
      }else{
        this.$message({
          message: '该文件暂不支持预览哦！',
          type: 'warning'
        });
      }
    },

    // 关闭查看器
    closeViewer() {
      this.showViewer = false
      this.showViewerUrl = ''
    },

    attrDetails: function (val) {
      this.orderForm.skuInfos=val
    },

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
            this.shopInfo =  []  //产品信息传给子组件
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
            this.shopInfo =  data.orderSkus  //产品信息传给子组件
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

              let wuliuCode = data.orderAttr.waybillCode
              orderForm.waybillCode = wuliuCode// 物流的code
              this.wuliuList.forEach((item,index)=>{
                if(wuliuCode==item.code){
                   orderForm.waybillCodeName= item.name   // 物流的名字
                }
              })


            }
            if(deliveryType==2){
              orderForm.deliveryTypeName = '同城配送'

              orderForm.waybillCode='' // 物流的code
              orderForm.waybillCodeName='' // 物流的名字
              
              
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

              orderForm.sourceDisabled = true


            }else{
              orderForm.sourceDisabled = false
        
              orderForm.receiptDetailAddress = data.orderAttr.receiptDetailAddress// 详细地址

              let dizhi = data.orderAttr.receiptAddress

              const [info] = AddressParse.parse(dizhi,true);

              console.log(info);
              const [province, city] = Utils.getTargetAreaListByCode('province', info.code, true);  //根据区码获取省与市

              let provCode = province.code
              let cityCode = city.code
              let distCode = info.code
      
  
              orderForm.receiptAddress= [provCode, cityCode, distCode]// 省市区码
              
              orderForm.Address = data.orderAttr.receiptAddress// 省市区

              orderForm.pickUpAddress = '' //自提地址 
            }            
          }
        })
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

      const [info] = AddressParse.parse(val,true);

      console.log(info);
      if(info==undefined){
        return false
      }

      const [province, city] = Utils.getTargetAreaListByCode('province', info.code, true);  //根据区码获取省与市
      console.log(province, city);


      orderForm.receiptName = info.name?info.name:orderForm.receiptName //姓名
      orderForm.receiptMobile = info.mobile?info.mobile:orderForm.receiptMobile //手机号
    
      if(orderForm.deliveryType!=3){
        let provCode
        let cityCode
        let distCode
      
        if(info.area!=''){
          provCode = province.code
          cityCode = city.code
          distCode = info.code
        }else{

          const list = Utils.getTargetAreaListByCode('area', info.code); //获得所有区域

          provCode = province.code
          cityCode = city.code
          distCode = list[0].code

        }
        orderForm.receiptAddress = [provCode, cityCode, distCode]  //收货人的地址 （省＋市＋区） //这是是省市区的码
        orderForm.Address = info.province +  info.city + info.area  //收货人的地址 文字
        orderForm.receiptDetailAddress = info.details //收货人详情地址
      }

      this.publicPorp=false
      this.shibieqiPorp = false
    },
    // 点击面包屑
    pathIndex(){
      console.log(111)
      this.$router.go(-1)
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

        this.orderForm.waybillCode='STO' // 物流的code
        this.orderForm.waybillCodeName='申通快递' // 物流的名字

      }
      if(val==2){

        this.orderForm.deliveryTypeName = '同城配送'

        this.orderForm.waybillCode='' // 物流的code
        this.orderForm.waybillCodeName='' // 物流的名字

        

      }
      if(val==3){
        this.orderForm.deliveryTypeName = '自提'  

        //如果是自提 物流公司 省市区 详情地址为空 否则 自提地址为空
        this.orderForm.waybillCode='' // 物流的code
        this.orderForm.waybillCodeName='' // 物流的名字
        this.orderForm.receiptDetailAddress='' // 详细地址
        this.orderForm.receiptAddress='' // 省市区码
        this.orderForm.Address='' // 省市区码

        this.orderForm.source = '4' //订单来源，
        this.orderForm.sourceDisabled = true
        this.orderForm.sourceName = '线下'



      }else{
        this.orderForm.pickUpAddress = '' //自提地址 
        this.pasteAddress(this.orderForm.textarea)
        this.orderForm.sourceDisabled = false
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
    // 订单提交验证
    submitForm(formName){
      let skuInfos = this.$refs.sonMethod.orderForm.skuInfos  //子组件验证通过  获取产品信息的值
          console.log(skuInfos);
      this.$refs.sonMethod.onClick(true); //给子组件传递点击事件
      let yanzheng = this.$refs.sonMethod.yanzheng  //获取子组件验证是否通过  false 未通过， true 通过    
      if(yanzheng==false){
        return false
      }
      this.$refs[formName].validate((valid,obj) => {
        if (valid) {
          let skuInfos = this.$refs.sonMethod.orderForm.skuInfos  //子组件验证通过  获取产品信息的值
          console.log(skuInfos);
          this.orderForm.skuInfos = skuInfos
          this.orderTruePorp = true
          this.publicPorp = true//遮罩层
        } else {
        }
      });
    },
    // 全部清除
    resetForm(formName){
      this.confirm_pop("确定要全部清空吗？").then(res=>{
        this.$refs.sonMethod.onClick('resetFields'); //给子组件传递全部清除点击事件
        this.$refs[formName].resetFields();
        this.orderForm.deliveryType = '1'//如果是邮寄和同城配送的话，要选择收货地址等，如果是自提需要选择自提门店
        this.orderForm.deliveryTypeName = '邮寄'
        this.orderForm.waybillCode = 'STO' //物流公司
        this.orderForm.waybillCodeName = '申通快递'
        this.orderForm.textarea = ''

        this.orderForm.source = '4' //订单来源，
        this.orderForm.sourceDisabled = false
        this.orderForm.sourceName = '线下'
      })
    },
    cityChange(val){ //选择收货地址
      if(val[2]!=undefined){
        this.orderForm.Address = this.CodeToText[val[0]] + this.CodeToText[val[1]] + this.CodeToText[val[2]]
      }else{
        this.orderForm.Address = this.CodeToText[val[0]] + this.CodeToText[val[1]]
      }
      
    }, 

    // 关闭确认订单弹框
    orderTrueClose(){
      this.publicPorp=false
      this.orderTruePorp=false//订单确认
    },

  
    Close(){
      this.publicPorp=false
      this.shibieqiPorp = false
    },


    // 订单确定弹框提交
    submitOrder(){
      let { orderForm,customerId,skuId,orderId,typesName } = this
      let arr = orderForm.skuInfos
      let skuInfosList = []
       for (var i in arr) {
        let info = {
          crafts:arr[i].crafts,
          num:arr[i].num,
          remark:arr[i].remark,
        }

        if(skuId!=4){
          this.$set(info,'height',arr[i].height*1000) 
          this.$set(info,'width',arr[i].width*1000)  
          this.$set(info,'productCode',arr[i].productCode)    
        }else{
          // this.$set(info,'productCodes',arr[i].productCodes)  
          this.$set(info,'productCode',arr[i].productCode)      
        }

        if (skuId==2) {          
          this.$set(info,'fontColor',arr[i].fontColor)  //红色条幅带颜色
        }

        if (skuId==6 || skuId==8 || skuId==9 || skuId==10 || skuId==11) {          
          this.$set(info,'paper',arr[i].paper)  //旗帜材料
        }

        skuInfosList.push(info)
      }

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
    },
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
  }
  .lookCont{
    width: 45%;
    display: flex;
    flex-flow: column;
  
    
    .imgbannerBox{

      background: #F5F6F9;
      height: 382px;
      border-radius: 10px;
      padding: 24px 24px 8px;
  
    }
    .url{
      flex: 1;
      width: 100%;

      iframe{
        width: 100%;
        height: 100%;
      }
    }

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
          width: 76px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
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
    // margin-top: 32px;
    height: 32%;
    align-items: center;
    justify-content: center;
    display: flex;
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

    .ullist{
      h3{
        margin-top: 16px;
      }
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
          flex: 1;
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

        .color{
          .name{
            display: inline-block;
            width: 28px;
            height: 28px;
            border-radius: 8px;
            border: 1px solid #FFFFFF;
          }
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

      .infoUL{
        display: flex;
        flex-wrap: wrap;
        .li{
          width: 100px;
          margin: 0 16px 16px 0;
        }
      }
    }
  }

 
</style>
