<template>
  <div>
    <el-form :model="orderForm" :rules="orderFormRules" ref="orderForm" label-width="80px" class="demo-ruleForm"  @submit.native.prevent>
        <div class="skuInfos">
          <el-row v-if="orderForm.skuInfos">
            <el-col v-for="(item,index) in orderForm.skuInfos" :key="index" class="dayinSkuInfosLI">
                <p class="jiaobiao">文件{{index+1}}</p>
                <el-row >
                    <h3 class="wenjianH3">文件信息</h3>
                    <el-col class="skuInfosLI">                    
                       <el-form-item label="打印文件" :prop="`skuInfos.${index}.name`" :rules="skuInfosGroupRules.infoname">
                            <el-row type="flex" class="row-bg" justify="space-between">
                                <el-col :span="20" class="uploadBox">
                                    <div class="upFile" @click="fileUpload(index,'more')">
                                    <img :src="file" alt="">
                                    <p>上传文件</p>
                                    </div>
                                    <div v-if="item.name.length!=0">
                                      <template v-if="item.name.length>1">
                                        <el-popover
                                          placement="right"
                                          width="338"
                                          trigger="click">
                                          <ul class="imgLookList">
                                            <li  v-for="(x,num) in item.name">
                                              <div class="fileDiv">
                                                <el-tooltip class="item" effect="dark" :content="x.val" placement="right">
                                                  <input type="text" readonly v-model="x.val">
                                                </el-tooltip>
                                                <img :src="delImg" alt="" @click="shanchuFile(index,num)">
                                              </div>
                                            </li>
                                          </ul>
                                          <div class="fileDiv" slot="reference">
                                            <input type="text" readonly v-model="item.name[0].val" style="width: 72%;">
                                            <i class="el-icon-caret-bottom icon"></i>
                                          </div>
                                        </el-popover>
                                      </template>
                                      <div v-else class="fileDiv">
                                          <el-tooltip class="item" effect="dark" :content="item.name[0].val" placement="right">
                                            <input type="text" readonly v-model="item.name[0].val" style="width: 72%;">
                                          </el-tooltip>
                                        <img :src="delImg" alt="" @click="shanchuFile(index,0)">
                                      </div>
                                    </div>
                                </el-col>
                                <el-col :span="2" class="iconClose" >
                                    <i class="el-icon-close" v-if="index!=0"  @click="deleteLadder(index)"></i>
                                </el-col>
                            </el-row>
                        </el-form-item>
                        <el-form-item label="打印风格" :prop="`skuInfos.${index}.dayinStyle`" :rules="skuInfosGroupRules.infodayinStyle" class="pubilcRadio">
                            <el-radio-group v-model="item.dayinStyle" size="medium">
                            <el-radio border label="黑白打印">黑白打印</el-radio>
                            <el-radio border label="彩色打印">彩色打印</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="打印面数" :prop="`skuInfos.${index}.dayinNum`" :rules="skuInfosGroupRules.infodayinNum" class="pubilcRadio">
                            <el-radio-group v-model="item.dayinNum" size="medium">
                            <el-radio border label="单面">单面</el-radio>
                            <el-radio border label="双面">双面</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="打印尺寸" :prop="`skuInfos.${index}.dayinSize`" :rules="skuInfosGroupRules.infodayinSize" class="pubilcRadio">
                            <el-radio-group v-model="item.dayinSize" size="medium">
                                <el-radio border label="A3">A3</el-radio>
                                <el-radio border label="A4">A4</el-radio>
                                <el-radio border label="A5">A5</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="打印材料"  class="productCraft gongyiProduct">
                            <el-radio-group v-model="item.dayinCailiao" @change="dayinCailiaochange($event,index)">
                                <div class="li"><el-radio label="复印纸70g">复印纸70g</el-radio></div>
                                <div class="li"><el-radio label="双胶纸120g">双胶纸120g</el-radio></div>
                                <div class="li"><el-radio label="不干胶">不干胶</el-radio></div>
                                <div class="li">
                                    <el-radio label="彩色复印纸">彩色复印纸</el-radio>
                                    <el-select v-model="item.caiseFuyin" placeholder="选择克数" @change="craftsName($event,index,'彩色复印纸')">
                                        <el-option
                                        v-for="i in caiseOptions"
                                        :key="i"
                                        :label="i"
                                        :value="i">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="li">
                                    <el-radio label="铜版纸">铜版纸</el-radio>
                                    <el-select v-model="item.tongbanzhi" placeholder="选择克数" @change="craftsName($event,index,'铜版纸')">
                                        <el-option
                                        v-for="i in tongbanOptions"
                                        :key="i"
                                        :label="i"
                                        :value="i">
                                        </el-option>
                                    </el-select>
                                </div>
                                <div class="li">
                                    <el-radio label="白卡纸">白卡纸</el-radio>
                                    <el-select v-model="item.baikazhi" placeholder="选择克数" @change="craftsName($event,index,'白卡纸')">
                                        <el-option
                                        v-for="i in baikaOptions"
                                        :key="i"
                                        :label="i"
                                        :value="i">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="材料颜色" v-if="item.dayinCailiao=='彩色复印纸'">
                            <el-popover
                                placement="bottom"
                                width="400"
                                trigger="click">
                                <ul class="fengmianyanse cailiaoPaper">
                                    <li v-for="i in cost.cailiaoColor" :class="item.cailiaoyanse == i.color? 'active ' + i.name:i.name" @click="colorCardClick1(index,i.color)"></li>
                                </ul>
                                <span class="colorCard" slot="reference" :style="'background:'+ item.cailiaoyanse"></span>
                            </el-popover>
                        </el-form-item>
                        <el-form-item label="装订方式" :prop="`skuInfos.${index}.zhaungding`" :rules="skuInfosGroupRules.infozhaungding" class="pubilcRadio">
                            <el-radio-group v-model="item.zhaungding" size="medium"  @change="zhaungdingchange($event,index)">
                                <el-radio border label="无">无</el-radio>
                                <el-radio border label="普通装订">普通装订</el-radio>
                                <el-radio border label="打孔装订">打孔装订</el-radio>
                                <el-radio border label="骑马钉">骑马钉</el-radio>
                                <el-radio border label="普通胶装">普通胶装</el-radio>
                                <el-radio border label="彩色精装">彩色精装</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row  v-if="item.zhaungding!='无' && item.zhaungding!=''">
                    <h3>封面信息</h3>
                    <el-col class="skuInfosLI">
                       <el-form-item label="封面材料"  class="productCraft gongyiProduct">
                            <el-radio-group v-model="item.fengmianCailiao" @change="fengmianCailiaochange($event,index)">
                                <div class="li"><el-radio label="平面皮纹纸">平面皮纹纸</el-radio></div>
                                <div class="li"><el-radio label="凹凸皮纹纸">凹凸皮纹纸</el-radio></div>
                                <div class="li"><el-radio label="布纹纸">布纹纸</el-radio></div>
                                <div class="li">
                                    <el-radio label="铜版纸">铜版纸</el-radio>
                                    <el-select v-model="item.fengmianTongbanzhi" placeholder="选择克数" @change="fengmiancraftsName($event,index,'铜版纸')">
                                        <el-option
                                        v-for="i in tongbanOptions"
                                        :key="i"
                                        :label="i"
                                        :value="i">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-radio-group>
                        </el-form-item>                        
                        <el-form-item label="封面工艺" :prop="`skuInfos.${index}.fengmianGongyi`" :rules="skuInfosGroupRules.infofengmianGongyi" class="pubilcRadio" v-if="item.fengmianCailiao == '铜版纸'">
                            <el-radio-group v-model="item.fengmianGongyi" size="medium">
                            <el-radio border label="亮膜">亮膜</el-radio>
                            <el-radio border label="哑膜">哑膜</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="封面颜色" v-if="item.fengmianCailiao=='平面皮纹纸' || item.fengmianCailiao=='凹凸皮纹纸' ">
                            <el-popover
                                placement="bottom"
                                width="400"
                                trigger="click">
                                <ul :class="item.fengmianCailiao=='平面皮纹纸'?'fengmianyanse tupongPaper':'fengmianyanse aotuPaper'">
                                    <template v-if="item.fengmianCailiao=='平面皮纹纸'">
                                        <li v-for="i in cost.putongColor" :class="item.yanse == i.color? 'active ' + i.name:i.name" @click="colorCardClick(index,i.color)"></li>
                                    </template>
                                    <template v-else>
                                        <li v-for="i in cost.aotuColor" :class="item.yanse == i.color? 'active ' + i.name:i.name" @click="colorCardClick(index,i.color)"></li>
                                    </template>
                                </ul>
                                <span class="colorCard" slot="reference" :style="'background:'+ item.yanse"></span>
                            </el-popover>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row >
                    <h3>订单数量</h3>
                    <el-col class="skuInfosLI">                        
                        <el-form-item label="打印数量">
                            <el-col :span="4" class="num">
                            <el-input-number v-model="item.num" @change="handleChange($event,index)" :min="1"  label="产品数量"></el-input-number>
                            </el-col>
                        </el-form-item>
                        <el-form-item label="备注信息" :prop="`skuInfos.${index}.remark`" :rules="skuInfosGroupRules.inforemark">
                            <el-input  type="textarea" v-model="item.remark" placeholder="请输入订单具体信息"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>        
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
    return {
      caiseOptions: ['彩色复印纸70g','彩色复印纸80g'],
      tongbanOptions: ['铜版纸128g','铜版纸157g','铜版纸200g','铜版纸250g','铜版纸300g'],
      baikaOptions: ['白卡纸160g','白卡纸300g'],
      radio:'1',
      active: 1,
      orderForm:{
        skuInfos:[],
      },
      orderFormRules: {
      },
      skuInfosGroupRules: {
        infoname: [{required: true,  message: '请上传文件',  trigger: 'blur'}],
        infodayinStyle: [{required: true, message: '请选择打印风格',}],
        infodayinNum: [{required: true, message: '请选择打印面数',}],
        infodayinSize: [{required: true, message: '请选择打印尺寸',}],


        infozhaungding: [{required: true, message: '请选择装订方式',}],

        infofengmianGongyi: [{required: true, message: '请选择封面工艺',}],

        inforemark: [{required: true, message: '请输入订单具体信息', trigger: 'blur'}],
      },
      delImg:require('@/assets/img/delImg.png'),
      file:require('@/assets/img/file.png'),
      shopSkuId:0,
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
    // 选择材料颜色
    colorCardClick1(index,color){
      let { orderForm } = this
      orderForm.skuInfos[index].cailiaoyanse = color
    },
    // 选择颜色
    colorCardClick(index,color){
      console.log(index);
        let { orderForm } = this
        orderForm.skuInfos[index].yanse = color
    },
    // 选择打印材料
    dayinCailiaochange(val,index){
        let { orderForm } = this
        orderForm.skuInfos[index].crafts['打印材料'] = ''
        console.log(val,index);
        let valname
        if(val == '彩色复印纸'){
            valname = orderForm.skuInfos[index].caiseFuyin 
            if(valname){
                orderForm.skuInfos[index].crafts['打印材料'] = val + '-' + valname
            }
            console.log(orderForm.skuInfos[index].crafts);
            return
        }

        if(val == '铜版纸'){
            valname = orderForm.skuInfos[index].tongbanzhi 
            console.log(valname);
            if(valname){
                orderForm.skuInfos[index].crafts['打印材料'] = val + '-' + valname 
            }
            console.log(orderForm.skuInfos[index].crafts);

            return
        }

         
         
        if(val == '白卡纸'){
            valname = orderForm.skuInfos[index].baikazhi 
            console.log(valname);
            if(valname){
                orderForm.skuInfos[index].crafts['打印材料'] = val + '-' + valname 
            }

            console.log(orderForm.skuInfos[index].crafts);

            return
        }

        if(val != '彩色复印纸'){
          delete orderForm.skuInfos[index].crafts.材料颜色
        }

        orderForm.skuInfos[index].crafts['打印材料'] = val
        console.log(orderForm.skuInfos[index].crafts);
    },
    // 下拉选择
    craftsName(val,index,lab){
      console.log(val,index,lab);
      let { orderForm } = this
      let name = orderForm.skuInfos[index].dayinCailiao //单选的名称
      if(name==lab){
        orderForm.skuInfos[index].crafts['打印材料'] = lab + '-' + val
      }
      console.log(orderForm.skuInfos[index].crafts);
    },

    // 封面材料选择
    fengmianCailiaochange(val,index){
      console.log(val);

      console.log(index);

      let { orderForm } = this
      orderForm.skuInfos[index].crafts['封面材料'] = ''
      orderForm.skuInfos[index].yanse = '#C23247'

      if(val!='铜版纸'){
        orderForm.skuInfos[index].crafts['封面材料'] = val
        orderForm.skuInfos[index].fengmianGongyi = ''
      }else{
        let valname = orderForm.skuInfos[index].fengmianTongbanzhi 
        console.log(valname);
        if(valname){
          orderForm.skuInfos[index].crafts['封面材料'] = val + '-' + valname
        }
      }
      console.log(orderForm.skuInfos[index].crafts);
    },

    // 封面下拉选择
    fengmiancraftsName(val,index,lab){
      console.log(val,index,lab);
      let { orderForm } = this
      let name = orderForm.skuInfos[index].fengmianCailiao //单选的名称
      if(name==lab){
        orderForm.skuInfos[index].crafts['封面材料'] = lab + '-' + val
      }
      console.log(orderForm.skuInfos[index].crafts);
    },

    zhaungdingchange(val,index){
      let { orderForm } = this
      console.log(val,index);
      if(val == '无'){
        delete orderForm.skuInfos[index].crafts.封面材料
        delete orderForm.skuInfos[index].crafts.封面工艺
        delete orderForm.skuInfos[index].crafts.封面颜色

        orderForm.skuInfos[index].fengmianCailiao = '' //封面材料
        orderForm.skuInfos[index].fengmianGongyi = '' //封面工艺
      }
      console.log(orderForm.skuInfos[index].crafts);
    },
    // 取消单选
    handleCancel(val,index){
      console.log(val);
      console.log(index);
      let { orderForm} = this
      orderForm.skuInfos[index].crafts = {}

      orderForm.skuInfos[index].gongyi = val == orderForm.skuInfos[index].gongyi ? '' : val
  
      let tit = orderForm.skuInfos[index].gongyi

      if(tit){
        let name
        if(val=='打扣'){
          name = orderForm.skuInfos[index].dakouVal 
        }

        if(val=='缝吊耳'){
          name = orderForm.skuInfos[index].diaoerVal 
        }
        orderForm.skuInfos[index].crafts[val] = name?name:null
      }
    },
    firstInfo(){
      this.orderForm.skuInfos = []
      let info = {
        productCodes:[],
        name:[],
        dayinStyle:'',
        dayinNum:'',
        dayinSize:'',
        dayinCailiao:'',
        cailiaoyanse:'#C23247',
        zhaungding:'',
        fengmianCailiao:'',
        fengmianGongyi:'',
        yanse:'#C23247',
        num: 1,
        remark: '',
        crafts:{},
        caiseFuyin:'', //彩色复印纸
        tongbanzhi:'', //铜版纸
        baikazhi:'', //白卡纸
        fengmianTongbanzhi:'',
      }

      this.orderForm.skuInfos.push(info);
    },
    // 获取订单信息
    getByIdInfo(data){
      console.log(data);
      this.orderForm.skuInfos = []
      let { orderForm } = this
      data.forEach((item,index)=>{
        let info ={
          num:item.num,
          remark:item.remark,
          crafts:item.attributes.crafts?item.attributes.crafts:{},
          cailiaoyanse:'#C23247',
          fengmianCailiao:'',
          fengmianGongyi:'',
          yanse:'#C23247',
          caiseFuyin:'', //彩色复印纸
          tongbanzhi:'', //铜版纸
          baikazhi:'', //白卡纸
          fengmianTongbanzhi:'',
        }

        let imgName = item.products

        let codes = []
        let vals = []

        imgName.forEach((i,index)=>{

          codes.push(i.code);

          this.$set(info,'productCodes',codes)

          vals.push(
            {
              val:i.name
            }
          )

          this.$set(info,'name',vals)

        })
        // return


        let crafts = item.attributes.crafts
        for(let i in crafts){
          console.log(i,crafts[i]);
          this.$set(info,'gongyi',i)

          if(i=='打印风格'){
            info['dayinStyle'] = crafts[i]?crafts[i]:''
          }

          if(i=='打印面数'){
            info['dayinNum'] = crafts[i]?crafts[i]:''
          }

          if(i=='打印尺寸'){
            info['dayinSize'] = crafts[i]?crafts[i]:''
          }

          if(i=='打印材料'){
            let val = crafts[i].split('-')
            console.log(val);
            info['dayinCailiao'] = val[0]
            console.log(val[0]);

            if(val[0] == '彩色复印纸'){
              info['caiseFuyin'] = val[1]
            }

            if(val[0] == '铜版纸'){
              info['tongbanzhi'] = val[1]
            }
            if(val[0] == '白卡纸'){
              info['baikazhi'] = val[1]
            }
          }

          if(i=='材料颜色'){
            info['cailiaoyanse'] = crafts[i]?crafts[i]:''
          }

          if(i=='装订方式'){
            info['zhaungding'] = crafts[i]?crafts[i]:''
          }

          if(i=='封面材料'){
            let val = crafts[i].split('-')
            console.log(val);
            info['fengmianCailiao'] = val[0]
            if(val[0] == '铜版纸'){
              info['fengmianTongbanzhi'] = val[1]
            }
          }

          if(i=='封面工艺'){
            info['fengmianGongyi'] = crafts[i]?crafts[i]:''
          }

          if(i=='封面颜色'){
            info['yanse'] = crafts[i]?crafts[i]:''
          }

        }
        orderForm.skuInfos.push(info)
        console.log(this.orderForm.skuInfos);
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
    shanchuFile(val,index){
      console.log(val,index);
      this.orderForm.skuInfos[val].name.splice(index,1);
      this.orderForm.skuInfos[val].productCodes.splice(index,1);
    },
    // 添加产品
    addLadder(){
      let info = {
        productCodes:[],
        dayinStyle:'',
        dayinNum:'',
        dayinSize:'',
        dayinCailiao:'',
        cailiaoyanse:'#C23247',
        zhaungding:'',
        fengmianCailiao:'',
        fengmianGongyi:'',
        yanse:'#C23247',
        num: 1,
        remark: '',
        name:[],
        crafts:{},
        caiseFuyin:'', //彩色复印纸
        tongbanzhi:'', //铜版纸
        baikazhi:'', //白卡纸
        fengmianTongbanzhi:'',
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
            if(arr[i].dayinCailiao==''){
              this.$message({
                message: '至少选择一种打印材料',
                type: 'warning'
              });

              return false
            }
            if(arr[i].dayinCailiao == '彩色复印纸' && arr[i].caiseFuyin=='' || arr[i].dayinCailiao == '彩色复印纸' && arr[i].caiseFuyin==undefined){
              this.$message({
                message: '请选择彩色复印纸的克数',
                type: 'warning'
              });

              return false
            }

            if(arr[i].dayinCailiao == '铜版纸' && arr[i].tongbanzhi=='' || arr[i].dayinCailiao == '铜版纸' && arr[i].tongbanzhi==undefined){
              this.$message({
                message: '请选择铜版纸的克数',
                type: 'warning'
              });

              return false
            }

            if(arr[i].dayinCailiao == '白卡纸' && arr[i].baikazhi=='' || arr[i].dayinCailiao == '白卡纸' && arr[i].baikazhi==undefined){
              this.$message({
                message: '请选择白卡纸的克数',
                type: 'warning'
              });

              return false
            }

            if(arr[i].zhaungding!=='' && arr[i].zhaungding!=='无'){
              console.log(111);

              if(arr[i].fengmianCailiao==''){
                this.$message({
                  message: '至少选择一种封面材料',
                  type: 'warning'
                });

                return false
              }
            }


            if(arr[i].fengmianCailiao == '铜版纸' && arr[i].fengmianTongbanzhi=='' || arr[i].dayinCailiao == '铜版纸' && arr[i].fengmianTongbanzhi==undefined){
              this.$message({
                message: '请选择封面铜版纸的克数',
                type: 'warning'
              });

              return false
            }



            let data = arr[i].crafts
       
            this.$set(data,'打印风格',arr[i].dayinStyle)
            this.$set(data,'打印面数',arr[i].dayinNum)
            this.$set(data,'打印尺寸',arr[i].dayinSize)
            this.$set(data,'装订方式',arr[i].zhaungding)
            if(arr[i].dayinCailiao == '彩色复印纸'){
              this.$set(data,'材料颜色',arr[i].cailiaoyanse)
            }

            if(arr[i].dayinCailiao == '彩色复印纸'){
              this.$set(data,'材料颜色',arr[i].cailiaoyanse)
            }

            if(arr[i].fengmianCailiao == '平面皮纹纸' || arr[i].fengmianCailiao == '凹凸皮纹纸' ){
              this.$set(data,'封面颜色',arr[i].yanse)
            }

            console.log(arr[i].fengmianCailiao  + '-----------------619');

            if(arr[i].fengmianCailiao == '铜版纸'){
              this.$set(data,'封面工艺',arr[i].fengmianGongyi)
            }

            arr[i].crafts =  data

            console.log(arr[i].crafts);
          }

          console.log(this.orderForm.skuInfos);

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
        productCodes:[],
        dayinStyle:'',
        dayinNum:'',
        dayinSize:'',
        dayinCailiao:'',
        cailiaoyanse:'#C23247',
        zhaungding:'',
        fengmianCailiao:'',
        fengmianGongyi:'',
        yanse:'#C23247',
        num: 1,
        remark: '',
        name:[],
        crafts:{},
        caiseFuyin:'', //彩色复印纸
        tongbanzhi:'', //铜版纸
        baikazhi:'', //白卡纸
        fengmianTongbanzhi:'',
      }

      if(this.shopSkuId == 2){
        this.$set(info,'fontColor','')
      }
      this.orderForm.skuInfos.push(info);
    },
   
    // 数量计步器
    handleChange(value,index) {
      this.orderForm.skuInfos[index].num=value
    },

    // 点击上传
    fileUpload(val,type){
      this.$refs.loadImgClick.loadImgonClick(val,type); //给子组件传递点击事件
    },

    // 从子组件获取图片的信息
    getMsgFormSon(info){
      console.log(info);
      info.imgInfo.forEach((item)=>{
        this.orderForm.skuInfos[info.index].name.push({
          val:item.name
        })
        this.orderForm.skuInfos[info.index].productCodes.push(item.code)
      })
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
    //   margin-bottom: 24px;
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
        input{
          font-size: 12px;
          line-height: 32px;
          height: 100%;
          cursor: pointer;
          overflow:hidden;
          white-space:nowrap;
          text-overflow: ellipsis;
        }
        img{
          position: absolute;
          right: -5px;
          top: -5px;
          width: 16px;
          height: 16px;
          cursor: pointer;
        }

        .icon{
          position: absolute;
          right: 3px;
          top: 50%;
          font-size: 20px;
          transform: translate(0,-50%);
            // cursor: pointer;
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
    margin: 0 0 24px;

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

  .dayinSkuInfosLI{
    background: #F5F6F9;
    border-radius: 10px;
    // overflow: hidden;
    margin-bottom: 24px;
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
      top: -19px;
      left: -14px;
    }
      h3{
          background: rgba(53,81,223,0.09);
          color: #333;
          font-size: 16px;
          height: 40px;
          line-height: 40px;
          padding-left: 23px;
      }
      .wenjianH3{
        border-radius: 10px 10px 0 0;
      }

      .colorCard{
        width: 32px;
        height: 32px;
        // background: #C23247;
        border-radius: 8px;
        border: 1px solid #FFFFFF;
        display: block;
        margin-top: 3px;
        cursor: pointer;
      }
  }


   .fengmianyanse{
       display: flex;
       align-items: center;
       flex-wrap: wrap;
        li{
            width: 28px;
            height: 28px;
            border-radius: 8px;
            display: block;
            margin-right:16px;
            margin-bottom: 16px;
            cursor: pointer;
            border: 2px solid #fff;
        }
        .active{
            border: 2px solid #DADDEE;
        }
    }
    .tupongPaper{
        .color1{
            background: #C23247;
        }
        .color2{
            background: #B9DB8F;
        }
        .color3{
            background: #A2DA87;
        }
        .color4{
            background: #89C890;
        }
        .color5{
            background: #7ED5E3;
        }
        .color6{
            background: #8BD9C3;
        }
        .color7{
            background: #5FC6C3;
        }
        .color8{
            background: #CBAE82;
        }
        .color9{
            background: #604A33;
        }
        .color10{
            background: #DFE0E8;
        }
    }

    .aotuPaper{
        .color1{
            background: #C23247;
        }
        .color2{
            background: #F08C4E;
        }
        .color3{
            background: #F0F9F9;
        }
        .color4{
            background: #F8E892;
        }
        .color5{
            background: #FFC25E;
        }
        .color6{
            background: #FFD2B0;
        }
        .color7{
            background: #C1DF96;
        }
        .color8{
            background: #378A53;
        }
        .color9{
            background: #92DAD0;
        }
        .color10{
            background: #169FB6;
        }
        .color11{
            background: #23527B;
        }
    }

    .cailiaoPaper{
        .color1{
            background: #C23247;
        }
        .color2{
            background: #94C7ED;
        }
        .color3{
            background: #ECA8CD;
        }
        .color4{
            background: #D4DEC6;
        }
        .color5{
            background: #E4DAB3;
        }
    }
  .imgLookList{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    li{
       margin: 0 24px 16px 0;
    }
    li:nth-child(3n+3){
      margin-right: 0;
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
          // width: 100%;
              width: 72%;
          height: 100%;
          cursor: pointer;
          overflow:hidden;
          white-space:nowrap;
          text-overflow: ellipsis;
        }
        img{
          position: absolute;
          right: 5px;
          top: 50%;
          width: 16px;
          height: 16px;
          transform: translate(0,-50%);
          cursor: pointer;
        }
      }
  }
 
</style>
