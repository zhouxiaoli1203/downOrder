<template>
  <div>
    <div class="navHead">
      <!-- <div class="downNum">下单次数剩余：1000次</div> -->
      <div class="headLeft">
        <!-- <span class="down cursor_p">条幅设计器下载</span> -->
        <!-- <div class="img cursor_p" v-clickoutside="handleClose">
          <img :src="headOrder" alt=""  @click="checkpop = !checkpop">
          <div class="rizhiBox" v-show="checkpop">
            <div class="top">
              <h2>操作日志</h2>
              <i class="el-icon-close" @click="checkpop = !checkpop"></i>
            </div>
            <div class="bot">
              <ul>
                <li v-for="x in 10">
                  <p class="time">2021-04-11</p>
                  <p>定制了30条条幅</p>
                </li>
              </ul>
            </div>
          </div>
        </div> -->
        <div class="img cursor_p" @click="nocticePorpclick">
          <img :src="headNoctice" alt="">
          <span v-if="weiDutotal!=0">{{weiDutotal}}</span>
        </div>
        <div class="info">
          <el-popover
            v-model="reviseBox"
            placement="bottom"
            width="200"
            trigger="click">
            <div class="reviseBox">
              <p @click="nickNamePorpclick">修改昵称</p>
              <p @click="passwordPorpclick">修改密码</p>
            </div>
            <p slot="reference">{{info.nickname}} 
              <i class="el-icon-caret-bottom"></i>
            &nbsp/</p>
          </el-popover>


          <span class="cursor_p" @click="loginOut">&nbsp退出</span>
        </div>
      </div>
    </div>
    <!-- 修改密码弹出层 -->
    <section class="publicPorp passwordPorp"  v-show="passwordPorp">
      <h2 v-show="unEdit">修改密码</h2>
      <div class="eidt-complete t_a_c" v-show="!unEdit">
          <img src="@/assets/img/duigou.png" alt="" width="44px" height="44px">
          <div style="margin-top:16px;">修改完成</div>
      </div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" :hide-required-asterisk="true" v-show="unEdit" style="width: 394px;">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="ruleForm.oldPassword" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.passive="submitForm('ruleForm')" v-button>修改</el-button>
        </el-form-item>
      </el-form>
    </section>

    <!-- 修改昵称 -->
    <section class="publicPorp passwordPorp nickNamePorp"  v-show="nickNamePorp">
      <h2>修改昵称</h2>
      <el-form :model="numberValidateForm" :rules="rulesNickname" ref="numberValidateForm" class="demo-ruleForm" :hide-required-asterisk="true" style="width: 394px;">
        <el-form-item prop="newNikeName">
          <el-input v-model="numberValidateForm.newNikeName" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.passive="nickNameForm('numberValidateForm')" v-button>修改</el-button>
        </el-form-item>
      </el-form>
    </section>

    <!-- 通知信息 -->
    <section class="publicPorp nocticePoro" v-show="nocticePorp">
      <div class="title">
        <h3>系统消息</h3>
        <i class="el-icon-close"  @click="LognClose">
        </i>
      </div>
      <div class="contentBox">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            :key="item.name"
            v-for="(item, index) in editableTabs"
            :label="item.title"
            :name="item.name"
          >
            <ul class="" v-if="Notifylist!=''">
              <li v-for="item in Notifylist" @click="readNotify(item.id)">
                <div class="state">
                  <i class="weiDu" v-if="item.state == 0"></i>
                  <span class="yiDu" v-if="item.state == 1">已读</span>
                </div>
                <div class="cont">
                  <span>{{item.createTime}}</span>
                  <p>{{item.content}}</p>
                </div>
              </li>
            </ul>
            <div v-else class="noXiaoxi">
              <img src="@/assets/img/xiaoxi.png" alt="">
              <p>暂无任何系统消息</p>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="pageblock" v-if="Notifylist!=''">
          <el-pagination
            background
            :current-page.sync="pageNum"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :page-size="10"
            :total="total">
          </el-pagination>
        </div>
      </div>
      
    </section>


    <audio
      ref="audio"
      @ended="audioEnd"
    >
      <source type="audio/ogg"  :src="resData.questionAudio">
    </audio>

    <div class="mask" @click="LognClose" v-show="publicPorp"></div>
  </div>
</template>

<script>
export default {
  name: 'navhead',
  data () {
    return {
      numberValidateForm: {
        newNikeName: ''
      },
      reviseBox:false,
      nickNamePorp:false, //修改昵称
      headOrder:require('../assets/img/headOrder.png'),
      headNoctice:require('../assets/img/headNoctice.png'),
      ruleForm: {
        newPassword: '',
        oldPassword: '',
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
        ],
      },

      rulesNickname: {
        newNikeName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
        ],
      },


      passwordPorp: false,
      publicPorp:false,
      nocticePorp:false,
      unEdit:true,
      info:'',
      checkpop: false,
      editableTabs: [
        {
          title: '全部',
          name: '2',
        },
        {
          title: '仅未读',
          name: '0',
        }, 
        {
          title: '仅已读',
          name: '1',
        }
      ],
      activeName: '2',
      Notifylist:[],
      total:0,
      pageNum:1,
      state:2,
      resData: {
        questionAudio: 'https://api.gundongyongheng.com/clock.mp3', // 音频
      },
      totalChange: '',
      timer: null,
      weiDutotal:0,
    }
  },
  created(){
    this.userInfo()
    // this.pageNotify(this.pageNum,this.state)
    this.tipsPageNotify();
    this.weiDuPageNotify() //未读
  },
  mounted() {
    // this.timer = setInterval(() => {
    //   this.tipsPageNotify();
    //   this.weiDuPageNotify() //未读
    // }, 5000)
  },
  methods: {
    // 点击喇叭图标, 开始播放音频
		handlePlayAudio() {
	    this.$refs.audio.play() // 这里使用了audio的原生开始播放事件,同样不加on, 并使用ref获取dom

	  },
    // 音频停止后, 把喇叭置灰
    audioEnd() {
      console.log(1111)
    },
    // 点击修改密码
    passwordPorpclick(){
      this.reviseBox=false,
      this.publicPorp=true
      this.passwordPorp=true
    },
    // 修改昵称
    nickNamePorpclick(){
      this.reviseBox=false,
      this.publicPorp=true
      this.nickNamePorp=true
    },

    // 点击通知
    nocticePorpclick(){
      this.publicPorp=true
      this.nocticePorp=true
      this.pageNotify(this.pageNum,this.state)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            newPassword: this.ruleForm.newPassword,
            oldPassword: this.ruleForm.oldPassword,
          }
          this.$post('post',this.baseUrl + '/customer/updatePassword',
            data
          ).then((res) => {
            if (res.code == 200) {
              this.$refs[formName].resetFields();
              this.unEdit = false;
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // 修改昵称
    nickNameForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            newNikeName: this.numberValidateForm.newNikeName,
          }
          this.$post('post',this.baseUrl + '/customer/updateNickName',
            data
          ).then((res) => {
            if (res.code == 200) {
              this.$refs[formName].resetFields();
              this.$message({
                message: res.msg,
                type: 'success'
              });
              this.publicPorp=false
              this.nickNamePorp=false
              this.userInfo();
            }
          })
        }
      })
    },

    // 获取用户信息
    userInfo(){
      this.$post('get',this.baseUrl + '/customer/userInfo',
      ).then((res) => {
        if (res.code == 200) {
          this.info = res.data
          this.$store.commit('setUserInfo',res.data)
        }
      })
    },

    // 退出登录
    loginOut(){
      this.confirm_pop("确认退出登录？").then(res=>{
        this.$post('post',this.baseUrl + '/logout',
        ).then((res) => {
          if (res.code == 200) {
            localStorage.removeItem('userInfo');
            this.$store.state.userInfo = '';
            localStorage.removeItem('expCompany');
            this.$store.state.expCompany = [];              
            localStorage.removeItem('token');
            localStorage.removeItem('orderInfo');
            this.$store.state.orderInfo = '';
            this.$router.replace('/');
          }
        })
      })
    },


    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 关闭登录注册弹框
    LognClose(){
      this.passwordPorp=false
      this.publicPorp=false
      this.unEdit=true
      this.nocticePorp=false
      this.nickNamePorp=false

      this.activeName ='2'
      this.pageNum = 1
      this.state = 2

    },
    handleClose() {
      this.checkpop = false
    },

    handleClick(e){
      console.log(e.name);
      this.state = e.name
      this.activeName = e.name
      this.pageNum = 1
      this.pageNotify(1,e.name)
    },

    // 获取通知消息列表
    pageNotify(pageNum,state){
      this.$post('post',this.baseUrl + '/order/pageNotify',{
        pageNum,
        pageSize:10,
        state
      }).then((res) => {
        if (res.code == 200) {
          this.Notifylist = res.data.rows
          this.total = res.data.total
        }
      })
    },

    // 提示音的总条数
    tipsPageNotify(){
      this.$post('post',this.baseUrl + '/order/pageNotify',{
        pageNum:1,
        pageSize:10,
        state:2
      }).then((res) => {
        if (res.code == 200) {
          this.totalChange = res.data.total 
        }
      })
    },

    // 获取未读消息的总条数
    weiDuPageNotify(){
      this.$post('post',this.baseUrl + '/order/pageNotify',{
        pageNum:1,
        pageSize:10,
        state:0
      }).then((res) => {
        if (res.code == 200) {
          this.weiDutotal = res.data.total 
        }
      })
    },

    // 点击分页
    handleCurrentChange(val){
      this.pageNum = val
      this.pageNotify(val,this.state)
    },

    // 标记已读
    readNotify(id){
      let arr = [id]
      this.$post('post',this.baseUrl + '/order/readNotify',{
        ids:arr
      }).then((res) => {
        if (res.code == 200) {
          this.pageNotify(this.pageNum,this.state)
          this.weiDuPageNotify();
        }
        
      })

    },


  },
  watch:{
    totalChange: {
      handler: function (val, oldval) {
        if (oldval !== '' && val != oldval) {
            this.handlePlayAudio()
        }
      },
    },
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
}
</script>


<style lang="less" scoped>
  .navHead{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: absolute;
    top: 0;
    left: 200px;
    right: 0;
    height: 64px;
    background: #FFFFFF;
    padding: 0 24px;

    .downNum{
      width: 191px;
      height: 32px;
      background: #FFF3F3;
      border-radius: 8px;
      text-align: center;
      line-height: 32px;
      color: #FF4545;
    }

    .headLeft{
      display: flex;
      align-items: center;

      .down{
        width: 146px;
        height: 32px;
        background: #3551DF;
        border-radius: 8px;
        text-align: center;
        line-height: 32px;
        color: #fff;
        margin-right: 56px;
      }

      .img{
        width: 32px;
        height: 32px;
        position: relative;
        margin-left: 24px;

        img{
          width: 100%;
          height: 100%;
        }

        span{
          position: absolute;
          width: 23px;
          height: 23px;
          background: #FF3333;
          border-radius: 50%;
          text-align: center;
          line-height: 23px;
          font-size: 12px;
          color: #fff;
          top: -7px;
          right: -5px;
        }
      }

      .info{
        display: flex;
        align-items: center;
        margin-left: 40px;
        p{
          color: #333;
          cursor: pointer;
        }
        span{
          color: #999;
        }
        span:hover{
          color: #FF3333;
        }

        i{
          font-size: 20px;
        }
      }
    }
  }
  .passwordPorp{
    padding: 24px 33px;
    background: #fff;
    min-width: 242px;
    max-width: 460px;
    max-height: 420px;

    h2{
      font-size: 24px;
      color: #333;
      margin-bottom: 24px;
    }
  }
  // 操作日志
  .rizhiBox{
    position: absolute;
    width: 378px;
    background: #FFFFFF;
    top: 32px;
    z-index: 12;
    box-shadow: 0 0 40px 0 #ddd;
    left: 50%;
    transform: translate(-50%,0);
    padding: 24px;

    .top{
      display: flex;
      align-items: center;
      justify-content: space-between;

      h2{
        font-size: 16px;
      }
      i{
        color: #999;
        font-size: 26px;
        cursor: pointer;
      }
    }
    .bot{
      margin-top: 24px;
      ul{
        height: 305px;
        overflow-y: scroll;
      }
      li{
        margin-bottom: 24px;
      .time{
          color: #999999;
          margin-bottom: 10px;
        }
      }
    }

  }

  // 通知消息
  .nocticePoro{
    background: #fff;
    overflow: hidden;
    width: 685px;
    height: 72%;
    .title{
      padding: 0 24px;
      height: 10%;
      background: #F9F7F7;
      display: flex;
      align-items: center;
      justify-content: space-between;

      h3{
        font-size: 16px;
        color: #000;
      }
      i{
        color: #999999;
        font-size: 26px;
        cursor: pointer;
        display: inline-block;
      }

    }

    .contentBox{
      padding: 0 24px;
      height: 90%;

      .el-tabs{
        height: 91%;
      }
      .el-tab-pane{
        height: 100%;
      }
    }

    ul{
      overflow-y: scroll;
      height: 100%;
      li{
        border-bottom: 1px solid #F2F3F8;
        display: flex;
        padding: 16px 0;
        cursor: pointer;
        .state{
          width: 32px;
        }
        i{
           display: inline-block;
        }
        .weiDu{
          width: 8px;
          height: 8px;
          background: #FF3333;
          border-radius: 50%;
        }
        .yiDu{
          font-size: 12px;
          color: #999;
        }
        .cont{
          flex: 1;

          span{
            color: #999;
          }
          p{
            font-size: 16px;
            margin-top: 8px;
          }
        }
      }
    }
  }
  // 页码定位
  .pageblock{
    .el-pagination{
      text-align: center;
    }
  }

  .noXiaoxi{
    text-align: center;
        margin-top: 25%;
    img{
      width: 36px;
      height: 36px;
    }
    p{
      color: #3551DF;
      font-size: 16px;
      margin-top: 16px;
    }
  }

  .reviseBox{
    p{
      cursor: pointer;
      text-align: center;
      // line-height: 41px;
      font-size: 16px;
    }
    p:first-child{
      padding-bottom: 14px;
      margin-bottom: 14px;
      border-bottom: 1px solid #EBEEF5;
    }
  }
</style>
