<template>
  <div class="connonBg main">
    <div class="center" v-if="info">
        <div class="crumbsHeader">
            <div class="crumbs">
                <i class="el-icon-back" @click="pathIndex()"></i>
                <span @click="pathIndex()">我的订单&nbsp/</span>
                <span style="flex:1">&nbsp{{crumbsName}}</span>
          </div>
        </div>
        <div class="orderinfoBox">
            <section class="detailSection orderinfo">
                <h3>订单信息</h3>
                <ul>
                    <li>
                        <span class="lable">订单标题</span>
                        <div class="info">
                            <input type="text" readonly  v-model="info.orderAttr.title" class="p">
                        </div>
                    </li>
                    <li>
                        <span class="lable">订单编号</span>
                        <div class="info">
                            <input type="text" readonly  v-model="info.orderCode" class="p">
                        </div>
                       
                    </li>
                    <li class="orderStaus">
                        <span class="lable">订单状态</span>
                        <div class="info">
                            <p >{{info.status | yhc_status}} <span v-if="info.status==5">（{{info.expressCompanyName}}）</span></p>
                            <el-tooltip class="item" effect="dark" :content="info.operationLogs[0].remark" placement="left-end" v-if="info.status==1 && info.operationLogs[0].remark!=null">
                                <img :src="tips" alt="" >
                            </el-tooltip>
                            <img :src="wenben" alt="" v-if="info.status==5" @click="copyText">
                        </div>
                    </li>
                    <li>
                        <span class="lable">订单来源</span>
                        <div class="info">
                            <p>{{info.source | source}}</p>
                        </div>
                    </li>
                    <li>
                        <span class="lable">下单时间</span>
                        <div class="info">
                            <p>{{info.createTime}}</p>
                        </div>
                    </li>
                    <li>
                        <span class="lable">订单类型</span>
                        <div class="info">
                            <p>{{info.orderAttr.skuName}}</p>
                        </div>
                    </li>
                    <li v-if="info.status==5">
                        <span class="lable">物流单号</span>
                        <div class="info">
                            <input type="text" readonly  v-model="info.expressCode" class="p">
                        </div>
                    </li>
                </ul>
            </section>

            <section class="detailSection chanpininfo" v-if="info.orderAttr.skuId!=4">
                <h3>产品规格</h3>
                <ul v-for="(item,index) in info.orderSkus" :key="index">
                    <li>
                        <span class="lable">产品尺寸{{index+1}}</span>
                        <div class="info">
                            <p>{{item.attributes.width/1000}}*{{item.attributes.height/1000}}m</p>
                        </div>
                    </li>
                    <li class="fileBox" v-for="x in item.products">
                        <span class="lable">产品文件{{index+1}}</span>
                        <div class="info">
                            <input type="text" readonly  v-model="x.name" class="p">
                            <span class="look"  @click="lookBigImg(x.img)">查看</span>
                            <span class="xiazai" @click="downloadUrl(x.code)">下载</span>
                        </div>
                    </li>
                    <li>
                        <span class="lable" style="color:red;font-weight: bold;">产品数量{{index+1}}</span>
                        <div class="info">
                            <p style="color:red;font-weight: bold;">{{item.num}}</p>
                        </div>
                    </li>
                    <li v-if="item.skuId==2">
                        <span class="lable">产品颜色{{index+1}}</span>
                        <div class="info">
                            <p>{{item.attributes.fontColor}}</p>
                        </div>
                    </li>
                    <li v-if="item.attributes.paper">
                        <span class="lable">产品材料{{index+1}}</span>
                        <div class="info">
                            <p>{{item.attributes.paper}}</p>
                        </div>
                    </li>
                    <li v-for="(i,key) in item.attributes.crafts">
                        <span class="lable" v-if="key=='款数'" style="color:#FF8F1C;font-weight: bold;">{{key}}{{index+1}}</span>
                        <span class="lable" v-else>{{key}}{{index+1}}</span>
                        <div class="info">
                            <p v-if="key=='款数'" style="color:#FF8F1C;font-weight: bold;">{{i}}</p>
                            <p v-else>{{i}}</p>
                        </div>
                    </li>      
              
                    <li class="remarkBox">
                        <span class="lable">产品描述{{index+1}}</span>
                        <div class="info">
                            <p>{{item.remark}}</p>
                        </div>
                    </li>                
                </ul>
            </section>

             <section class="detailSection chanpininfo" v-else>
                <h3>文件信息</h3>
                <ul v-for="(item,index) in info.orderSkus" :key="index">
                    <li v-for="(i,key) in item.attributes.crafts">
                        <span class="lable">{{key}}{{index+1}}</span>
                        <div :class="key!='材料颜色' && key!='封面颜色'?'info':'info color'">
                            <p v-if="key!='材料颜色' && key!='封面颜色'">{{i}}</p>
                            <span v-else :style="'background:'+ i"></span>
                        </div>
                    </li>

                    <li class="fileBox" v-for="x in item.products">
                        <span class="lable">产品文件{{index+1}}</span>
                        <div class="info">
                            <input type="text" readonly  v-model="x.name" class="p">
                            <span class="look"  @click="lookBigImg(x.img)">查看</span>
                            <span class="xiazai" @click="downloadUrl(x.code)">下载</span>
                        </div>
                    </li>
                    <li>
                        <span class="lable" style="color:red;font-weight: bold;">打印数量{{index+1}}</span>
                        <div class="info">
                            <p style="color:red;font-weight: bold;">{{item.num}}</p>
                        </div>
                    </li>
                    <li class="remarkBox">
                        <span class="lable">产品描述{{index+1}}</span>
                        <div class="info">
                            <p>{{item.remark}}</p>
                        </div>
                    </li>
                </ul>
            </section>

            <section class="detailSection orderinfo">
                <h3>客户信息</h3>
                <ul>
                    <li>
                        <span class="lable">客户姓名</span>
                        <div class="info">
                            <p>{{info.orderAttr.receiptName}}</p>
                        </div>
                    </li>
                    <li>
                        <span class="lable">配送方式</span>
                        <div class="info">
                            <p>{{info.orderAttr.deliveryType | yhc_dlyType}}</p>
                        </div>
                    </li>
                    <li v-if="info.orderAttr.deliveryType!=3">
                        <span class="lable">配送地址</span>
                        <div class="info">
                            <input type="text" readonly  v-model="info.orderAttr.receiptAddress+info.orderAttr.receiptDetailAddress" class="p">
                        </div>
                    </li>
                    <li v-else>
                        <span class="lable">配送地址</span>
                        <div class="info">
                            <input type="text" readonly  v-model="info.orderAttr.pickUpAddress" class="p">
                        </div>
                    </li>
                    <li>
                        <span class="lable">联系方式</span>
                        <div class="info">
                            <p>{{info.orderAttr.receiptMobile}}</p>
                        </div>
                    </li>
                    <li v-if="info.orderAttr.deliveryType==1">
                        <span class="lable">快递公司</span>
                        <div class="info">
                            <p>{{info.orderAttr.waybillCode}}</p>
                        </div>
                    </li>
                </ul>
            </section>
        </div>
        <div class="btnBox">
            <div class="btn">
                <span @click="downOrder(info.orderAttr.skuId,info.orderAttr.skuName,info.id,0)" class="downOrder" v-if="info.status!=1">再来一单</span>
                <span @click="editOrder(info.orderAttr.skuId,info.orderAttr.skuName,info.id,1)" class="bianji" v-if="info.status==1">编辑订单</span>
                <span @click="orderCancel" class="tuidan" v-if="info.status==0">退单</span>
                <span @click="orderCancel" class="tuidan" v-if="info.status==2">退单</span>
                <span @click="orderCancel" class="tuidan" v-if="info.status==3">退单</span>
                <span @click="backOrderapplyReturn" class="fanchang" v-if="info.status==5">返厂</span>
                <span @click="orderResetCancel" class="quxiao" v-if="info.status==6">取消退单</span>    
            </div>
            
     
        </div>
    </div>
    <!-- 返厂弹框 -->
    <div class="mask" v-show="applyReturnPorp" ref='select_frame' ondragstart="return false">
        <section class="publicPorp applyReturnPorp">
            <h3>返厂理由</h3>
            <div class="info">
                <el-input
                resize="none"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入返厂理由"
                    v-model="description">
                </el-input>
                <div class="shangchuan">
                    <ul>
                        <li v-for="(item, index) in fileList" :key="index">
                            <img :src="item.url" alt="" class="img">
                            <img :src="upDEL" alt="" class="upDEL" @click="handleRemove(index)">
                        </li>
                    </ul>
                    <el-upload
                        :show-file-list="false"
                        multiple
                        action="#"
                        list-type="picture-card"
                        :before-upload="handlePictureCardPreview"
                        :auto-upload="true">
                        <i slot="default" class="el-icon-plus"></i>
                    </el-upload>
                </div>
            </div>
            <div class="btn">
                <button @click.prevent="close" class="span">取消</button>
                <button @click.prevent="fanchangTure" v-button class="span">确定</button>
            </div>
        </section>
    </div>

    <!-- 查看大图 -->
    <el-image-viewer 
      v-if="showViewer" 
      :on-close="closeViewer" 
      :url-list="[showViewerUrl]" />


  </div>
</template>


<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
export default {
  name: '',
  components: { ElImageViewer },
  data () {
    return {
        info:'',
        orderId:0,
        publicPorp:false,
        applyReturnPorp:false,
        description:'',
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        fileList:[],
        picsList:[],
        upDEL:require('../../assets/img/upDEL.png'),
        crumbsName:'',
        tips:require('../../assets/img/tips.png'),
        wenben:require('../../assets/img/wenben.png'),
        danhao:'',
        showViewer:false,// 显示查看器
        showViewerUrl:'',
    }
  },
  created(){
    this.crumbsName = this.$route.query.title
    this.orderId = this.$route.query.id,
    this.getByIdInfo(this.$route.query.id)
    let userInfo = this.$store.getters.getUserInfo
    this.customerId = userInfo.id
  },
 mounted(){
    // 拖拽上传文件
    this.$refs.select_frame.ondragleave = (e) => {
      e.preventDefault()  // 阻止离开时的浏览器默认行为
    }
    this.$refs.select_frame.ondrop = (e) => {
      e.preventDefault()    // 阻止拖放后的浏览器默认行为
      const data = e.dataTransfer.files  // 获取文件对象
      if (data.length < 1) {
        return  // 检测是否有文件拖拽到页面
      }
        for (let i = 0; i < data.length; i++) {
            let info = data[i]
            this.uploadCredentialImage(info)
        }
    }
    this.$refs.select_frame.ondragenter = (e) => {
      e.preventDefault()  // 阻止拖入时的浏览器默认行为
      this.$refs.select_frame.border = '2px dashed red'
    }
    this.$refs.select_frame.ondragover = (e) => {
      e.preventDefault()    // 阻止拖来拖去的浏览器默认行为
    }
  },
  methods: {
    // 大图预览
    lookBigImg(val){
      console.log(val);
      if(val){
        this.showViewer = true
        this.showViewerUrl = this.baseUrl + val 
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
    // 获取订单信息
    getByIdInfo(orderId){
        this.$post('post',this.baseUrl + '/order/getById',{
            orderId
        }).then((res) => {
            if (res.code == 200) {
                this.info = res.data
                if(res.data.status==5){
                    this.danhao = res.data.expressCode
                }
                if (res.data.orderAttr.deliveryType == 1) {
                
                    this.info.orderAttr.waybillCode = this.$store.getters.getExpCompany.filter(
                        (item) => {
                        return item.code == this.info.orderAttr.waybillCode
                        }
                    )[0].name
                    
                }
            }

        })
    },
    // 再来一单
    downOrder(id,name,orderId,type){
        this.confirm_pop("是否再一次下单").then(res=>{
            this.$router.push({
                path: '/index/downOrder', //跳转的路径
                query: {
                    id:id,
                    name:name,
                    orderId:orderId,
                    type
                }
            })
        })
    },
    // 编辑订单
    editOrder(id,name,orderId,type){
        console.log(name);
        console.log(orderId);
        console.log(id);
        console.log(type);
        this.confirm_pop("是否对该订单进行编辑？").then(res=>{
            this.$router.push({
                path: '/index/downOrder', //跳转的路径
                query: {
                    id:id,
                    name:name,
                    orderId:orderId,
                    type
                }
            })
        })
    },
    // 退单
    orderCancel(){
        this.confirm_pop("是否退该订单？").then(res=>{
            this.$post('post', this.baseUrl + '/order/cancel',{
                orderId:this.orderId
            }).then((res) => {
                if (res.code == 200) {
                    this.getByIdInfo(this.orderId)
                    this.$message({
                        message:res.msg,
                        type: 'success'
                    });
                }
            })
        })
    },
    // 取消退单
    orderResetCancel(){
        this.confirm_pop("确定取消退单吗？").then(res=>{
            this.$post('post', this.baseUrl + '/order/resetCancel',{
                orderId:this.orderId
            }).then((res) => {
                if (res.code == 200) {
                    this.getByIdInfo(this.orderId)
                    this.$message({
                        message:res.msg,
                        type: 'success'
                    });
                }
            })
        })
    },

    // 申请返厂
    backOrderapplyReturn(){
        this.publicPorp = true
        this.applyReturnPorp = true
    },
    // 删除返厂图片
    handleRemove(index) {
        this.fileList.splice(index,1);
        this.picsList.splice(index,1);
    },
    // 返厂上传图片
    handlePictureCardPreview(file) {
        this.uploadCredentialImage(file)
    },

    // 返厂图片请求上传
    uploadCredentialImage(file){
        const isJPG = file.type === 'image/jpg';
        const isJPEG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png'
        if (!isJPG  &&  !isPNG && !isJPEG) {
            return this.$message.error('上传头像图片只能JPG,PNG!');
        }
        let param = new FormData(); // 创建form对象
        param.append("file",file);
        param.append("orderId",this.orderId); 

        this.openFullScreen(); //调用加载中

        this.$post('post',this.baseUrl +'/backOrder/uploadCredentialImage',param
        ).then((res) => {

            this.closeFullScreen(this.openFullScreen()); //关闭加载框

            if (res.code == 200) {
                let data = {
                    name: File.name,
                    url:this.baseUrl+res.data
                }
                this.fileList.push(data)
                this.picsList.push(res.data)
            }
        })
    },
    // 确定返厂
    fanchangTure(){
        let { customerId, description, orderId, picsList } = this
        let pics = picsList.join(",")
        let data = {
            customerId,
            description,
            orderId,
            pics
        }
        this.$post('post',this.baseUrl + '/backOrder/applyReturn',data
        ).then((res) => {
            if (res.code == 200) {
                this.publicPorp = false
                this.applyReturnPorp = false
                this.getByIdInfo(orderId)
                this.$message({
                    message:res.msg,
                    type: 'success'
                });
                this.fileList=[]
                this.picsList=[]
                this.description=''
            }
        })
    },
    // 关闭返厂弹框
    close(){
        this.publicPorp = false
        this.applyReturnPorp = false
        this.fileList=[]
        this.picsList=[]
    },
     // 文件下载
    downloadUrl(productCode){
        console.log(productCode);
        this.$post('post', this.baseUrl + '/production/getDownloadUrl',{
            productCode
        }).then((res) => {
            if (res.code == 200) {
                window.open(this.baseUrl + res.data);
            }
        })
    },
    // 跳转
    pathIndex(){

      this.$router.go(-1)
    },
    // 复制单号
    copyText(){ 
        const input = document.createElement("input");
        input.setAttribute("readonly", "readonly");
        input.setAttribute("value", this.danhao);
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, 9999);
        if (document.execCommand("copy")) {
            document.execCommand("copy");
            this.$message({
                message: '复制成功',
                type: 'success'
            });

        }
        document.body.removeChild(input);
    },
    
  }
}
</script>


<style lang="less" scoped>
    .main{
        overflow-y: scroll;
    }
    .center{
        background: none;
    }
    .detailSection{
        background: #fff;
        border-radius: 10px;
        padding: 24px 24px 0;
        margin-bottom: 26px;
        h3{
            height: 40px;
            line-height: 40px;
            background-color: rgba(53, 81, 223, 0.1);
            padding-left: 16px;
            color: #333;
            font-size: 16px;
            font-weight: 500;
            text-align: left;
            margin-bottom: 24px;
        }

        ul{
            display: flex;
            align-items: center ;
            flex-wrap: wrap;
            
            li{
                display: flex;
                align-items: center;
                margin-right: 48px;
                margin-bottom: 24px;
                .info{
                    display: flex;
                    align-items: center;
                    width: 200px;
                    height: 32px;
                    background: #F2F3F8;
                    padding: 16px;

                    p, .p{
                        display: block;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        flex: 1;
                    }
                    
                }

                .color{
                    background: none;
                    padding-left: 0;
                    span{
                        width: 32px;
                        height: 32px;
                    }
                }

                .lable{
                    color: #999;
                    display: inline-block;
                    margin-right: 10px;
                    width: 68px;
                    display: inline-block;
                }
            }

            .orderStaus{
                .info{
                    justify-content: space-between;
                    img{
                        width: 16px;
                        height: 16px;
                        cursor: pointer;
                    }
                }
            }
            
        }
    }

    .chanpininfo{
        ul{
            margin-bottom: 40px;
        }
        ul:last-child{
            margin-bottom: 0;
        }
        

        .fileBox{
            .info{
                background: none;
                padding: 0;
                p, .p{
                    background: #F2F3F8;
                    height: 32px;
                    line-height: 32px;
                    padding: 0 16px;
                    flex: 1;
                }
                span{
                    width: 47px;
                    height: 32px;
                    background: #F2F3F8;
                    text-align: center;
                    line-height: 32px;
                    cursor: pointer;
                }
                .look{
                    color: #3551DF;
                    margin: 0 4px;
                }
                .xiazai{
                    background: #3551DF;
                    color: #fff;
                }
            }
        }

        .remarkBox{
            .info{
                width: 1092px;
                min-height: 86px;
                background: #F2F3F8;
                display: block;
               p{

                    line-height: 20px;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    white-space: normal;
               }
            }
        }
    }

    .btnBox{
        .btn{
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 0 48px;

            span{
                cursor: pointer;
                width: 108px;
                height: 40px;
                background: #3551DF;
                border-radius: 4px;
                display: block;
                text-align: center;
                line-height: 40px;
                margin-right: 55px;
                color: #fff;
            }
            span:last-child{
                margin-right: 0;
            }
            .tuidan{
                background: #FF3333;
            }
            .fanchang{
                background: #6DC4EE;
            }
            .quxiao{
                background: #D3D3D3;
            }
        }
    }
    .orderinfoBox{
        padding-bottom: 100px;
    }

    // 返厂弹框
    .applyReturnPorp{
        width: 432px;
        height: 321px;
        background: #FFFFFF;
        box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        padding: 24px;

        h3{
            font-size: 16px;
            color: #000;
            margin-bottom: 16px;
        }
        .info{
            padding: 8px;
            background: #F2F3F8;
            border-radius: 10px;
            .el-textarea__inner{
                height: 83px;
                background-color: #F2F3F8;

            }

            .shangchuan{
                margin-top: 10px;
                display: flex;
                align-items: center;
                ul{
                    display: flex;
                    align-items: center;
                }
                li{
                    margin-right: 13px;
                    position: relative;
                    .img{
                        width: 40px;
                        height: 40px;
                        border-radius: 6px;
                        cursor: pointer;
                    }
                    .upDEL{
                        position: absolute;
                        width: 12px;
                        height: 12px;
                        top: -7px;
                        right: -6px;
                        cursor: pointer;
                    }
                }
            }
            
        }

        .btn{
            margin-top: 30px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .span{
                width: 65px;
                height: 32px;
                background: #DBDBDB;
                text-align: center;
                line-height: 32px;
                display: inline-block;
                border-radius: 3px;
                margin-right: 32px;
            }
            .span:last-child{
                margin: 0;
                background: #3551DF;
                color: #fff;

            }
        }
    }


</style>
