<template>
  <div>
    <div class="navHead">
      <div class="downNum">下单次数剩余：1000次</div>
      <div class="headLeft">
        <span class="down cursor_p">条幅设计器下载</span>
        <div class="img cursor_p">
          <img :src="headOrder" alt="">
        </div>
        <div class="img cursor_p">
          <img :src="headNoctice" alt="">
          <span>40</span>
        </div>
        <div class="info">
          <p @click="passwordPorp = true">奋斗的阿花 &nbsp/</p>
          <span class="cursor_p">&nbsp退出</span>
        </div>
      </div>
    </div>
    <!-- 修改密码弹出层 -->
    <section class="publicPorp passwordPorp"  v-show="passwordPorp">
      <h2>修改密码</h2>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" :hide-required-asterisk="true">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="ruleForm.name" placeholder="请输入原密码"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="ruleForm.name" placeholder="请输入新密码"></el-input>
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
      passwordPorp:false
    }
  },
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
    },
    // 关闭登录注册弹框
    LognClose(){
      this.passwordPorp=false
    },
  }
}
</script>


<style lang="less" scoped>
  .navHead{
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    width: 460px;
    height: 420px;

    h2{
      font-size: 24px;
      color: #333;
      margin-bottom: 24px;
    }
  }
</style>
