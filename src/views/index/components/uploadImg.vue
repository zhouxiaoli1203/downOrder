<template>
  <div>
    <div class="mask" ref='select_frame' ondragstart="return false" v-show="buzhouPorp">
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
                  <template v-if="imgMultiple">
                    <el-upload
                        class="upload-demo"
                        action=""
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload"
                        multiple
                        >
                        <img :src="file" alt="">
                        <p>上传文件</p>
                    </el-upload>
                  </template>
                  <template v-else>
                    <el-upload
                        class="upload-demo"
                        action=""
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload"
                        >
                        <img :src="file" alt="">
                        <p>上传文件</p>
                    </el-upload>
                  </template>
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
            </div>
        </section>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
        radio:'1',
        active: 1,
        file:require('@/assets/img/file.png'),
        shejiqi:require('@/assets/img/shejiqi.png'),
        complete:require('@/assets/img/complete.png'),
        buzhou:1, //1.本地上传，2.设计器上传
        buzhouPorp:false,
        publicPorp:false, //遮罩层
        localList:[],
        sort:0,
        wenjianNanme:'', //文件的名字
        wenjianCode:'',
        imgInfo:[],
        imgMore:'', //''单张，'more':多张
        imgMultiple:''
    }
  },
  created(){
  },
  mounted(){
    // 拖拽上传文件
    this.$refs.select_frame.ondragleave = (e) => {
      e.preventDefault()  // 阻止离开时的浏览器默认行为
    }
    this.$refs.select_frame.ondrop = (e) => {
      e.preventDefault()    // 阻止拖放后的浏览器默认行为
      // const data = e.dataTransfer.files[0]  // 获取文件对象
      const data = e.dataTransfer.files // 获取文件对象
      if (data.length < 1) {
        return  // 检测是否有文件拖拽到页面
      }

      console.log(data);
      for (var k in data) {
        this.productionUpload(data[k])
        if (k == data.length-1) {//循环到5那项后，停止循环
          break;
        }
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
  methods:{
    loadImgonClick(param,type){
      console.log(param,type);
        this.buzhouPorp = true
        this.imgMore = type
        this.sort = param
        if(type!=undefined){
          this.imgMultiple = 'multiple'
        }else{
          this.imgMultiple = ''
        }
    },
    // 上传文件
    beforeAvatarUpload(file) {
      console.log(file);
      this.productionUpload(file)
    },
    // 上传文件请求
    productionUpload(file){
      let { localList, imgInfo,imgMore } = this
      let name = file.name
      let param = new FormData(); // 创建form对象
      param.append("file",file);
      param.append("name",name); 
      // return
      this.$post('post',this.baseUrl +'/production/upload',param,'upload'
      ).then((res) => {
        if (res.code == 200) {
          this.active =2
          this.buzhou = 1
          if(imgMore=='more'){
            localList.push(name)
            imgInfo.push(
              {
                name:name,
                code:res.data,
              }
            )

          }else{
            this.localList = []
            this.localList.push(name)
            this.wenjianNanme = name 
            this.wenjianCode  =  res.data 
          }        
        }
      })
    },
    // 下一步
    next() {this.active++},
    // 完后上传
    finishBtn(){
      let { sort, wenjianNanme, wenjianCode,imgInfo,imgMore } = this
      console.log(sort);
      if(imgMore=='more'){
        let imgval = {
          index:sort,
          imgMore,
          imgInfo
        }
        this.$emit('func',imgval)
      }else{

        let imgval = {
            index:sort,
            wenjianNanme,
            wenjianCode,
            imgMore,
        }

        this.$emit('func',imgval)

      }
      this.buzhou = 1 //1.本地上传，2.设计器上传
      this.buzhouPorp = false
      this.publicPorp = false
      this.active = 1

      this.localList = [] //上传之前先清空
      this.imgInfo = []
      this.wenjianNanme = ''
      this.wenjianCode = ''
      

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
    },
    // 第一步
    firstNext(){
      this.$message('请选择一种方式上传文件');
    },
    // 上一步
    lastStep(){
      this.localList = [] //上传之前先清空
      this.wenjianNanme = ''
      this.wenjianCode = ''
      this.imgInfo = []
      this.active--
    },
  },
}
</script>


<style scoped lang="less">
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

        ul{
          overflow-x: scroll;
          height: 217px;
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
