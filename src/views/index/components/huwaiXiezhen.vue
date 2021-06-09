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
              <el-form-item label="材料选择" :prop="`skuInfos.${index}.paper`" :rules="skuInfosGroupRules.infofontPaper" class="pubilcRadio">
                <el-select v-model="item.paper" placeholder="请选择材料" @change="cailiaoChang($event,index)">
                    <el-option
                      v-for="x in cost.cailiaoList"
                      :key="x.name"
                      :label="x.name"
                      :value="x.name">
                    </el-option>
                  </el-select>
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
                    <el-form-item :prop="`skuInfos.${index}.height`" :rules="skuInfosGroupRules.infoheight">
                      <el-input v-model="item.height" placeholder="宽度（m）"></el-input>
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
              
              <el-form-item label="产品工艺"  class="productCraft gongyiProduct xiezhengongyi" >
                <el-radio-group v-model="item.gongyi" @change="handleCancel($event,index)">
                  
                  <div class="li" v-for="i in item.chanpinGongyiList.list">
                    <el-radio :label="i.name">{{i.name}} 
                      <span>{{i.tip}}</span>
                    </el-radio>
                  </div>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="产品数量" >
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
      orderForm:{
        skuInfos:[],
      },
      orderFormRules: {
      },
      skuInfosGroupRules: {
        infoname: [{required: true,  message: '请上传文件',  trigger: 'blur'}],
        infofontPaper: [{required: true,message: '请选择材料',}],
        infowidth: [{required: true,  validator: widthHeight,  trigger: 'change'}],
        infoheight: [{required: true, validator: widthHeight, trigger: 'change'}],
        inforemark: [{required: true, message: '请输入订单具体信息', trigger: 'blur'}],
      },
      delImg:require('@/assets/img/delImg.png'),
      file:require('@/assets/img/file.png'),
      yanzheng:false
    }
  },
  created(){
    if(this.$props.skuInfos!=''){
      this.getByIdInfo(this.$props.skuInfos);
    }else{
      this.firstInfo()
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

    // 产品工艺单选
    handleCancel(val,index){
      console.log(val,index);
      let { orderForm} = this
      orderForm.skuInfos[index].crafts = {}
      orderForm.skuInfos[index].gongyi = val 
      orderForm.skuInfos[index].crafts[val] = null
    },
    
    // 材料选择
    cailiaoChang(e,index){
      let { orderForm} = this
      let obj = {};
      obj = this.cost.cailiaoList.find((item)=>{//这里的userList就是上面遍历的数据源
        return item.name === e;//筛选出匹配数据
      });
      let xuhao =  orderForm.skuInfos[index].chanpinGongyiList
      if(obj.val!=xuhao){
        orderForm.skuInfos[index].crafts = {}
        orderForm.skuInfos[index].gongyi = ''
      }

      this.gongyiFuzhi(obj.val,index)

    },


    // 给工艺赋值
    gongyiFuzhi(val,index){
      console.log(val,index);
       let { orderForm} = this
      if(val==1){
        orderForm.skuInfos[index].chanpinGongyiList = this.cost.gongyiList1
      }

      if(val==2){
        orderForm.skuInfos[index].chanpinGongyiList =  this.cost.gongyiList2
      }

      if(val==3){
        orderForm.skuInfos[index].chanpinGongyiList =  this.cost.gongyiList3
      }

      if(val==4){
        orderForm.skuInfos[index].chanpinGongyiList =  this.cost.gongyiList4
      }

      if(val==5){
        orderForm.skuInfos[index].chanpinGongyiList =  this.cost.gongyiList5
      }
      if(val==6){
        orderForm.skuInfos[index].chanpinGongyiList =  this.cost.gongyiList6
      }

      if(val==7){
        orderForm.skuInfos[index].chanpinGongyiList =  this.cost.gongyiList7
      }
    },


    firstInfo(){
      this.orderForm.skuInfos = []
      let info = {
        chanpinGongyiList:this.cost.gongyiList1,
        productCode:'',
        height: '',
        num: 1,
        remark: '',
        width: '',
        crafts:{},
        name:'',
        gongyi:'', 
        gongyiOrder:'',
        paper:'',
      }
      this.orderForm.skuInfos.push(info);
    },
    // 获取订单信息
    getByIdInfo(data){
      this.orderForm.skuInfos = []
      let { orderForm } = this
      data.forEach((item,index)=>{
        console.log(item.products[0].name);
        let info ={
          chanpinGongyiList:[],
          productCode:item.products[0].code,
          paper:item.attributes.paper,
          height:item.attributes.height/1000,
          num:item.num,
          remark:item.remark,
          width:item.attributes.width/1000,
          name:item.products[0].name,//文件的名字
          crafts:item.attributes.crafts?item.attributes.crafts:{}
        }
        
        let crafts = item.attributes.crafts
        if(JSON.stringify(item.attributes.crafts)!='{}'){    
          for(let i in crafts){
            console.log(i)
            console.log(crafts[i]);
            this.$set(info,'gongyi',i)
          }
        }else{
          info['gongyi'] = ''
        }  

        orderForm.skuInfos.push(info)
        let paperName = item.attributes.paper
        console.log(paperName);

        let obj = {};
        obj = this.cost.cailiaoList.find((i)=>{//这里的userList就是上面遍历的数据源
          return i.name === paperName;//筛选出匹配数据
        });

        this.gongyiFuzhi(obj.val,index)

      })


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
    // 添加产品
    addLadder(){
      let info = {
        chanpinGongyiList:this.cost.gongyiList1,
        productCode:'',
        height: '',
        num: 1,
        remark: '',
        width: '',
        crafts:{},
        name:'',
        gongyi:'', 
        fengtongVal:'',
        dakouVal:'',
        paper:'',
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

            if(arr[i].gongyi == '缝筒' && arr[i].fengtongVal=='' || arr[i].gongyi == '缝筒' && arr[i].fengtongVal==undefined){
              this.$message({
                message: '请选择类型',
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
        chanpinGongyiList:this.cost.gongyiList1,
        productCode:'',
        height: '',
        num: 1,
        remark: '',
        width: '',
        crafts:{},
        name:'',
        gongyi:'', 
        fengtongVal:'',
        dakouVal:'',
        paper:'',
      }
      this.orderForm.skuInfos.push(info);
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
              chanpinGongyiList:this.cost.gongyiList1,
              productCode:item.code,
              height: '',
              num: 1,
              remark: '',
              width: '',
              crafts:{},
              name:item.name,
              // img:item.img,
              gongyi:'', 
              fengtongVal:'',
              dakouVal:'',
              paper:'',
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
        // this.orderForm.skuInfos[info.index].img = info.wenjianImg
        this.$emit("detailChange",this.orderForm.skuInfos);
        console.log(this.orderForm.skuInfos);

      }
    },

    
  },
  watch:{
    skuInfos: {
      handler (newValue, oldValue) {
        console.log(JSON.stringify(newValue) + ' = == === newValue')
        console.log(JSON.stringify(oldValue) + ' = == === oldValue');
        if(newValue!=''){
          this.getByIdInfo(newValue);
        }else{
          this.firstInfo()
        }
      },
    }
  }
}
</script>


<style lang="less" scoped>

  .skuInfos{
    .skuInfosLI{
      margin-bottom: 24px;
      padding: 24px !important;
      background: #F5F6F9;
      border-radius: 10px;
      position: relative;

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

  .productCraft{
    span{
      color: #FF3B30;
      font-size: 12px;
    }
  }


 
</style>
