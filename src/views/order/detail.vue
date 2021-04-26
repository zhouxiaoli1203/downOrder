<template>
  <div class="connonBg main">
    <div class="center" v-if="info">
        <div class="crumbsHeader">
            <div class="crumbs">
              <span @click="pathIndex()">我的订单 / </span>
              <span>{{crumbsName}}</span>
          </div>
        </div>
        <div>
            <section class="detailSection orderinfo">
                <h3>订单信息</h3>
                <ul>
                    <li>
                        <span class="lable">订单标题</span>
                        <div class="info">
                            <p>{{info.orderAttr.title}}</p>
                        </div>
                    </li>
                    <li>
                        <span class="lable">订单编号</span>
                        <div class="info">
                            <p>{{info.orderCode}}</p>
                        </div>
                    </li>
                    <li>
                        <span class="lable">订单状态</span>
                        <div class="info">
                            <p v-if="info.status==0">待生产</p>
                            <p v-if="info.status==1">已驳回</p>
                            <p v-if="info.status==2">待生产</p>
                            <p v-if="info.status==3">生产中</p>
                            <p v-if="info.status==4">生产完成</p>
                            <p v-if="info.status==5">已发货</p>
                            <p v-if="info.status==6">退单中</p>
                            <p v-if="info.status==7">已退单</p>
                            <p v-if="info.status==8">请求返厂</p>
                            <p v-if="info.status==9">返厂中</p>
                            <img src="" alt="">
                        </div>
                    </li>
                    <li>
                        <span class="lable">订单来源</span>
                        <div class="info">
                            <p v-if="info.source=='1'">淘宝</p>
                            <p v-if="info.source=='2'">京东</p>
                            <p v-if="info.source=='3'">PDD</p>
                            <p v-if="info.source=='4'">线下</p>
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
                            <p>{{info.orderAttr.goodsName}}</p>
                        </div>
                    </li>
                </ul>
            </section>

            <section class="detailSection chanpininfo">
                <h3>产品规格</h3>
                <ul v-for="(item,index) in info.orderSkus" :key="index">
                    <li>
                        <span class="lable">产品尺寸{{index+1}}</span>
                        <div class="info">
                            <p>{{item.crafts.width}}*{{item.crafts.height}}mm</p>
                        </div>
                    </li>
                    <li class="fileBox">
                        <span class="lable">产品文件{{index+1}}</span>
                        <div class="info">
                            <p>{{item.crafts.productName}}</p>
                            <span class="look">查看</span>
                            <span class="xiazai">下载</span>
                        </div>
                    </li>
                    <li>
                        <span class="lable">产品数量{{index+1}}</span>
                        <div class="info">
                            <p>{{item.num}}</p>
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
                            <p v-if="info.orderAttr.deliveryType==1">邮寄</p>
                            <p v-if="info.orderAttr.deliveryType==2">同城配送</p>
                            <p v-if="info.orderAttr.deliveryType==3">自提</p>
                        </div>
                    </li>
                    <li v-if="info.orderAttr.deliveryType!=3">
                        <span class="lable">配送地址</span>
                        <div class="info">
                            <p>{{info.orderAttr.receiptAddress+info.orderAttr.receiptDetailAddress}}</p>
                        </div>
                    </li>
                    <li v-else>
                        <span class="lable">配送地址</span>
                        <div class="info">
                            <p>{{info.orderAttr.pickUpAddress}}</p>
                        </div>
                    </li>
                    <li>
                        <span class="lable">联系方式</span>
                        <div class="info">
                            <p>{{info.orderAttr.receiptMobile}}</p>
                        </div>
                    </li>
                    <li v-if="info.orderAttr.deliveryType!=3">
                        <span class="lable">快递公司</span>
                        <div class="info">
                            <p>10</p>
                        </div>
                    </li>
                </ul>
            </section>
        </div>
        <div class="btnBox">
            <div class="btn" v-if="info.status==2 || info.status==0">
                <span @click="downOrder(info.orderSkus[0].skuId,info.orderSkus[0].skuName,info.id)" class="downOrder">再来一单</span>
                <span @click="orderCancel" class="tuidan">退单</span>
            </div>
            <div class="btn" v-if="info.status==1">
                <span @click="downOrder" class="bianji">编辑订单</span>
            </div>
            <div class="btn" v-if="info.status==3">
                <span @click="downOrder" class="downOrder">再来一单</span>
                <span @click="orderCancel" class="tuidan">退单</span>
            </div>
            <div class="btn" v-if="info.status==6">
                <span @click="downOrder" class="downOrder">再来一单</span>
                <span @click="" class="quxiao">取消退单</span>
            </div>
            <div class="btn" v-if="info.status==7">
                <span @click="downOrder" class="downOrder">再来一单</span>
            </div>
            <div class="btn" v-if="info.status==5">
                <span @click="downOrder" class="downOrder">再来一单</span>
                <span @click="backOrderapplyReturn" class="fanchang">返厂</span>
            </div>
            <div class="btn" v-if="info.status==8">
                <span @click="downOrder" class="downOrder">再来一单</span>
            </div>
            <div class="btn" v-if="info.status==9">
                <span @click="downOrder" class="downOrder">再来一单</span>
            </div>
        </div>
    </div>
    <!-- 弹框 -->
    <section class="publicPorp applyReturnPorp" v-show="applyReturnPorp">
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
                 <!-- @click="handleRemove(file)" -->
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
            <span  @click="close">取消</span>
            <span @click="fanchangTure">确定</span>
        </div>
    </section>
    <div class="mask" v-show="publicPorp" @click="close"></div>
    
  </div>
</template>


<script>
export default {
  name: 'navhead',
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
    }
  },
  created(){
    this.orderId = this.$route.query.id,
    this.crumbsName = this.$route.query.title
    this.getByIdInfo(this.$route.query.id)
    let userInfo = this.$store.getters.getUserInfo
    this.customerId = userInfo.id
  },
  methods: {
    // 获取订单信息
    getByIdInfo(orderId){
        this.$post('post',this.baseUrl + '/order/getById',{
            orderId
        }
        ).then((res) => {
            if (res.code == 200) {
                this.info = res.data
            }
        })
    },
    downOrder(id,name,orderId){
        this.$router.push({
            path: '/index/downOrder', //跳转的路径
            query: {
                id:id,
                name:name,
                orderId:orderId
            }
        })
    },

    // 退单
    orderCancel(){
        this.confirm_pop("确认要取消该订单？").then(res=>{
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
    handlePictureCardPreview(file) {
        const isJPG = file.type === 'image/jpg';
        const isJPEG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png'
        if (!isJPG  &&  !isPNG && !isJPEG) {
            return this.$message.error('上传头像图片只能JPG,PNG!');
        }

        let param = new FormData(); // 创建form对象
        param.append("file",file);
        param.append("orderId",this.orderId); 
        this.$post('post',this.baseUrl +'/backOrder/uploadCredentialImage',param,'upload'
        ).then((res) => {
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
        this.$post('post',this.baseUrl + '//backOrder/applyReturn',data
        ).then((res) => {
            if (res.code == 200) {
                this.getByIdInfo(orderId)
                this.$message({
                    message:res.msg,
                    type: 'success'
                });
                this.fileList=[]
                this.picsList=[]
            }
        })
    },
    // 取消返厂
    close(){
        this.publicPorp = false
        this.applyReturnPorp = false
        this.fileList=[]
        this.picsList=[]
    },
    pathIndex(){
      console.log(111)
      this.$router.go(-1)
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
                    width: 315px;
                    height: 32px;
                    background: #F2F3F8;
                    padding: 16px;

                    p{
                        display: block;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
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
                p{
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
                width: 1055px;
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
            padding: 100px 0 48px;

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
            span{
                width: 65px;
                height: 32px;
                background: #DBDBDB;
                text-align: center;
                line-height: 32px;
                display: inline-block;
                border-radius: 3px;
                margin-right: 32px;
            }
            span:last-child{
                margin: 0;
                background: #3551DF;
                color: #fff;

            }
        }
    }


</style>
