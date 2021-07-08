<template>
  <div>
    <el-form :model="orderForm" :rules="orderFormRules" ref="orderForm" label-width="80px" class="demo-ruleForm"  @submit.native.prevent>
        <div class="skuInfos">
          <el-row v-if="orderForm.skuInfos">
            <el-col v-for="(item,index) in orderForm.skuInfos" :key="index" class="skuInfosLI">
              <p class="jiaobiao">文件{{index+1}}</p>
              <el-form-item label="产品文件" :prop="`skuInfos.${index}.name`" :rules="skuInfosGroupRules.infoname">
                  <el-row type="flex" class="row-bg" justify="space-between">
                  <el-col :span="20" class="uploadBox">
                      <div class="upFile" v-if="orderForm.skuInfos.length>1"  @click="fileUpload(index)">
                        <img :src="file" alt="">
                        <p>上传文件</p>
                      </div>
                      
                      <div class="upFile" v-else  @click="fileUpload(index,'more')">
                        <img :src="file" alt="">
                        <p>上传文件</p>
                      </div>
                      <div v-if="item.name!=''" class="fileDiv">
                          <el-tooltip class="item" effect="dark" :content="item.name" placement="right">
                            <input type="text"  readonly v-model="item.name">
                          </el-tooltip>
                        <img :src="delImg" alt="" @click="shanchuFile(index)">
                      </div>
                  </el-col>
                  <el-col :span="2" class="iconClose" >
                      <i class="el-icon-close" v-if="index!=0"  @click="deleteLadder(index)"></i>
                  </el-col>
                  </el-row>
              </el-form-item>
              <el-form-item label="字体颜色" :prop="`skuInfos.${index}.fontColor`" :rules="skuInfosGroupRules.infofontColor" class="pubilcRadio" v-if="shopSkuId==2">
                  <el-radio-group v-model="item.fontColor" size="medium">
                  <el-radio border label="白色">白色</el-radio>
                  <el-radio border label="黄色">黄色</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="产品尺寸" required>
                  <el-row>
                  <el-col :span="8">
                      <el-form-item :prop="`skuInfos.${index}.width`" :rules="skuInfosGroupRules.infowidth">
                      <el-input v-model="item.width" placeholder="长度（m）"></el-input>
                      </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2">X</el-col>
                  <el-col :span="8" class="inputSelect">
                      <el-form-item>
                          <el-select v-model="item.height" placeholder="请选择">
                          <el-option
                          v-for="item in restaurants"
                          :key="item.value"
                          :label="item.name"
                          :value="item.value">
                          </el-option>
                      </el-select>
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

              <el-form-item label="产品工艺" class="productCraft gongyiProduct">
                  <el-radio-group v-model="item.gongyi"  @change="handleCancel($event,index)">
                    <div class="li" v-for="i in chanpinGongyiList">
                        <el-radio :label="i">{{i}}</el-radio>
                        <template v-if="i == '打扣'">
                          <el-select v-model="item.dakouVal" placeholder="类型" @change="craftsName($event,index,'打扣')">
                            <el-option
                              v-for="item in dakouOptions"
                              :key="item"
                              :label="item"
                              :value="item">
                            </el-option>
                          </el-select>
                        </template>

                        <template v-if="i == '缝吊耳'">
                          <el-select v-model="item.diaoerVal" placeholder="四角缝吊耳" @change="craftsName($event,index,'缝吊耳')">
                              <el-option
                              v-for="item in diaoerOptions"
                              :key="item"
                              :label="item"
                              :value="item">
                              </el-option>
                          </el-select>
                        </template>

                         <template v-if="i == '绑带'">
                          <el-select v-model="item.bangdaiVal"  @change="craftsName($event,index,'绑带')">
                              <el-option
                              v-for="item in bangdaiOptions"
                              :key="item"
                              :label="item"
                              :value="item">
                              </el-option>
                          </el-select>
                        </template>


                        
                    </div>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="产品数量">
                  <el-col :span="4" class="num">
                  <el-input-number v-model="item.num" @change="handleChange($event,index)" :min="1"  label="产品数量"></el-input-number>
                  </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div @click="addLadder" class="addskuInfo">
            <i class="el-icon-plus"></i>
            <span>添加</span>
        </div>           
    </el-form>
    <!-- 上传图片弹框 -->
    <UploadImg ref="loadImgClick"  @func="getMsgFormSon"></UploadImg>
  </div>
</template>

<script>
import UploadImg from './uploadImg' //上传图片
export default {
  props:{
    skuInfos:{}
  },
  components: {
    UploadImg
  },
  data () {
    var widthHeight = (rule,value,callback) => {
      if(value){
        if(Number(value)>0){
          value = String(value)
          let values = value.replace('/(^\s*)|(\s*$)','')  //去除字符串前后空格
          let num = Number(values)  //将字符串转换为数
          if(isNaN(num)){  //判断是否是非数字
            callback(new Error('尺寸必须为数字'));
          }else if(value === ''|| value === null){  //空字符串和null都会被当做数字
            callback(new Error('尺寸必须为数字类型'));
          }else{
            
            if(Number(value)>380){
              callback(new Error(' 长度最长380m'));
            }

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
          callback(new Error('尺寸必须大于0'));
        }
      }else{
        callback(new Error('请输入尺寸'));
      }
    };
    return {
      radio:'1',
      active: 1,
      orderForm:{
        skuInfos:[],
      },
      orderFormRules: {
      },
      skuInfosGroupRules: {
        infoname: [{required: true,  message: '请上传文件',  trigger: 'blur'}],
        infofontColor: [{required: true, message: '请选择颜色',}],
        infowidth: [{required: true,  validator: widthHeight,  trigger: 'change'}],
        infoheight: [{required: true, validator: widthHeight, trigger: 'change'}],
        inforemark: [{required: true, message: '请输入订单具体信息', trigger: 'blur'}],
      },
      delImg:require('@/assets/img/delImg.png'),
      file:require('@/assets/img/file.png'),
      shopSkuId:0,
      restaurants: [],
      chanpinGongyiList:['打扣', '缝吊耳','缝筒','裁净边','条幅绑带','绑带'],
      dakouOptions:['四角打扣','每隔2米打一个扣'],
      diaoerOptions:['四角缝吊耳'],
      bangdaiOptions:['四角绑带','两角绑带'],
      yanzheng:false
    }
  },
  created(){
    let shopSkuId = this.$route.query.id //产品的id
    this.shopSkuId = shopSkuId
    if(this.$props.skuInfos!=''){
      this.getByIdInfo(this.$props.skuInfos);
    }else{
      this.firstInfo()
    }
    if(shopSkuId == 2){
      this.restaurants = this.cost.restaurants2
    }else{
      this.restaurants = this.cost.restaurants1
    }
  },
  mounted(){
  },
  methods:{
    // 父组件的点击事件
    onClick(param){
      if(param == true){
        this.submitForm() //表单验证
      }
      if(param == 'resetFields'){
        this.resetForm() //全部清除
      }
    },


    // 下拉选择
    craftsName(val,index,lab){
      console.log(val,index,lab);
      let { orderForm } = this
      let name = orderForm.skuInfos[index].gongyi //单选的名称
      if(name==lab){
        orderForm.skuInfos[index].crafts['产品工艺'] = lab + ':' + val
      }
      console.log(orderForm.skuInfos[index].crafts);
    },

    // 单选
    handleCancel(val,index){
      console.log(val);
      console.log(index);

      let { orderForm } = this
      orderForm.skuInfos[index].crafts['产品工艺'] = ''

      let valname
      if(val == '打扣'){
          valname = orderForm.skuInfos[index].dakouVal 
          if(valname){
            orderForm.skuInfos[index].crafts['产品工艺'] = val + ':' + valname
          }
          console.log(orderForm.skuInfos[index].crafts);
          return
      }

      if(val == '缝吊耳'){
          valname = orderForm.skuInfos[index].diaoerVal
          if(valname){
            orderForm.skuInfos[index].crafts['产品工艺'] = val + ':' + valname
          }
          console.log(orderForm.skuInfos[index].crafts);
          return
      }

      if(val == '绑带'){
          valname = orderForm.skuInfos[index].bangdaiVal
          if(valname){
            orderForm.skuInfos[index].crafts['产品工艺'] = val + ':' + valname
          }
          console.log(orderForm.skuInfos[index].crafts);
          return
      }

      orderForm.skuInfos[index].crafts['产品工艺'] = val
      console.log(orderForm.skuInfos[index].crafts);

    },

    firstInfo(){
      this.orderForm.skuInfos = []
      let info = {
        productCode:'',
        height: '',
        num: 1,
        remark: '',
        width: '',
        name:'',
        img:'', //文件的图片
        crafts:{},
        gongyi:'', 
        dakouVal:'',
        diaoerVal:'',
        bangdaiVal:'四角绑带'
      }

      if(this.shopSkuId == 2){
        this.$set(info,'fontColor','')
      }
      this.orderForm.skuInfos.push(info);
    },
    // 获取订单信息
    getByIdInfo(data){
      this.orderForm.skuInfos = []
      let { orderForm } = this
      data.forEach((item,index)=>{
        let info ={
          productCode:item.products[0].code,
          height:item.attributes.height/1000,
          num:item.num,
          remark:item.remark,
          width:item.attributes.width/1000,
          name:item.products[0].name,//文件的名字
          crafts:item.attributes.crafts?item.attributes.crafts:{},
          bangdaiVal:'四角绑带'
        }


        item.products.forEach((i,key)=>{
          this.$set(info,'img',this.baseUrl + i.img)
        })


        if(this.shopSkuId == 2){
          this.$set(info,'fontColor',item.attributes.fontColor)
        }


        let crafts = item.attributes.crafts
        for(let i in crafts){
          console.log(i);
          console.log(crafts[i]);

          
          if(i=='产品工艺'){
            let val = crafts[i].split(':')
            console.log(val);
            info['gongyi'] = val[0]
            if(val[0] == '打扣'){
              info['dakouVal'] = val[1]
            }


            if(val[0] == '缝吊耳'){
              info['diaoerVal'] = val[1]
            }

            if(val[0] == '绑带'){
              info['bangdaiVal'] = val[1]
            }
          }
        }
        orderForm.skuInfos.push(info)
      })

      this.$emit("detailChange",this.orderForm.skuInfos);
      console.log(this.orderForm.skuInfos);
    },
     
    // 移除整个产品
    deleteLadder(index){
      this.confirm_pop("确定移除该产品吗？").then(res=>{
        if(this.orderForm.skuInfos.length>1){
          this.orderForm.skuInfos.splice(index,1);
        }
      })
      this.$emit("detailChange",this.orderForm.skuInfos);
    },
    // 删除某个产品中的文件
    shanchuFile(val){
      this.confirm_pop("确定删除该文件吗？").then(res=>{
        this.orderForm.skuInfos[val].name = ''
        this.orderForm.skuInfos[val].productCode = ''
        this.orderForm.skuInfos[val].img = ''
      })
      this.$emit("detailChange",this.orderForm.skuInfos);
    },
    // 添加产品
    addLadder(){
      let info = {
        productCode:'',
        height: '',
        num: 1,
        remark: '',
        width: '',
        name:'',
        img:'', //文件的图片
        crafts:{},
        gongyi:'', 
        dakouVal:'',
        diaoerVal:'',
        bangdaiVal:'四角绑带'
      }
      if(this.shopSkuId == 2){
        this.$set(info,'fontColor','')
      }
      this.orderForm.skuInfos.push(info);
    },
    // 订单提交验证
    submitForm(){
      let arr = this.orderForm.skuInfos
      this.$refs.orderForm.validate((valid,obj) => {
        if (valid) {
          for (var i in arr) {
            this.yanzheng = false

            if(arr[i].gongyi==''){
              this.$message({
                message: '至少选择一种产品工艺',
                type: 'warning'
              });

              return false
            }
            if(arr[i].gongyi == '打扣' && arr[i].dakouVal=='' || arr[i].gongyi == '打扣' && arr[i].dakouVal==undefined){
              this.$message({
                message: '请选择打扣的类型',
                type: 'warning'
              });

              return false
            }

            if(arr[i].gongyi == '缝吊耳' && arr[i].diaoerVal=='' || arr[i].gongyi == '缝吊耳' && arr[i].diaoerVal==undefined){
              this.$message({
                message: '请选择缝吊耳的类型',
                type: 'warning'
              });

              return false
            } 
          }
          this.yanzheng = true 
        } else {
          this.yanzheng = false
        }
      });
    },
    // 全部清除
    resetForm(){
      this.$refs.orderForm.resetFields();
      this.orderForm.skuInfos = []
      let info = {
        productCode:'',
        height: '',
        num: 1,
        remark: '',
        width: '',
        name:'',
        img:'', //文件的图片
        crafts:{},
        gongyi:'', 
        dakouVal:'',
        diaoerVal:'',
        bangdaiVal:'四角绑带'
      }

      if(this.shopSkuId == 2){
        this.$set(info,'fontColor','')
      }
      this.orderForm.skuInfos.push(info);
      this.$emit("detailChange",this.orderForm.skuInfos);
    },
   
    // 数量计步器
    handleChange(value,index) {
      this.orderForm.skuInfos[index].num=value
    },

    // 点击上传
    fileUpload(val,type){
      console.log(val,type);
      this.$refs.loadImgClick.loadImgonClick(val,type,'tiaofu'); //给子组件传递点击事件
    },

    // 从子组件获取图片的信息
    getMsgFormSon(info){
      console.log(info);
      if(info.imgMore=='more'){
        this.orderForm.skuInfos = []
        info.imgInfo.forEach((item, index) => {
        　　console.log(item, index);
            let info = {
              productCode:item.code,
              height: '',
              num: 1,
              remark: '',
              width: '',
              name:item.name,
              img:item.img,
              crafts:{},
              gongyi:'', 
              dakouVal:'',
              diaoerVal:'',
              bangdaiVal:'四角绑带'
            }
            if(this.shopSkuId == 2){
              this.$set(info,'fontColor','')
            }
            this.orderForm.skuInfos.push(info);
            this.$emit("detailChange",this.orderForm.skuInfos);
             console.log(this.orderForm.skuInfos);
        })
      }else{
        this.orderForm.skuInfos[info.index].name = info.wenjianNanme
        this.orderForm.skuInfos[info.index].productCode = info.wenjianCode
        this.orderForm.skuInfos[info.index].img = info.wenjianImg
        this.$emit("detailChange",this.orderForm.skuInfos);
        console.log(this.orderForm.skuInfos);

      }
    },
    
  },
  watch:{
    skuInfos: {
      handler (newValue, oldValue) {
        console.log(11111111111111111111);
        console.log(JSON.stringify(newValue) + ' = == === newValue')
        console.log(JSON.stringify(oldValue) + ' = == === oldValue');
        if(newValue!=''){
          this.getByIdInfo(newValue);
        }else{
          this.firstInfo()
        }
      },
      // immediate:true,
      //     deep:true
    }
  }
}
</script>


<style lang="less" scoped>
  .skuInfos{
    .skuInfosLI{
      position: relative;
      margin-bottom: 24px;
      padding: 24px !important;
      background: #F5F6F9;
      border-radius: 10px;

      .jiaobiao{
        position: absolute;
        background: #ff6b16;
        color: #fff;
        width: 58px;
        height: 28px;
        text-align: center;
        line-height: 28px;
        font-size: 13px;
        border-radius: 0 10px 0 10px ;
        top: -14px;
        left: -14px;
      }
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
          cursor: pointer;
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
 
</style>
