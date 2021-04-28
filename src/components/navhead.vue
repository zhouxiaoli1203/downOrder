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
        <!-- <div class="img cursor_p">
          <img :src="headNoctice" alt="">
          <span>40</span>
        </div> -->
        <div class="info">
          <p @click="passwordPorp = true">{{info.nickname}} &nbsp/</p>
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
    <div class="mask" @click="LognClose" v-show="passwordPorp"></div>
  </div>
</template>

<script>
export default {
  name: 'navhead',
  data () {
    return {
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
      passwordPorp: false,
      unEdit:true,
      info:'',
      checkpop: false,
    }
  },
  created(){
    this.userInfo()
  },
  methods: {
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
      this.unEdit=true
    },
    handleClose() {
      this.checkpop = false
    },
  }
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
</style>
