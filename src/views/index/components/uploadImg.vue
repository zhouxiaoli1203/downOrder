<template>
  <div>
    <div class="mask" ref='select_frame' ondragstart="return false" v-show="buzhouPorp">
      <template v-for="i in dataList"><img :src="i.content"  alt=""></template>
        <section class="publicPorp">
          <div class="uploadSection">
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
                    <li v-for="(item,index) in localList" :key="index">
                      <p>{{index+1}}</p>
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
          </div>
          <div class="jinduBOX"  ref="speedBox" v-if="speedBoxList!=0">
            <div v-for="item in speedBoxList" class="speed" v-if="item.speed!=100">
              <el-progress :text-inside="true" :stroke-width="16" :percentage="item.speed"></el-progress>
              <p>{{item.name}}</p>
            </div>
          </div>
        </section>
    </div>
  </div>
</template>

<script>
import JSZip from 'jszip'
export default {
  data () {
    return {
      imgResult:"",
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
        wenjianImg:'', //文件的图片
        imgInfo:[],
        imgMore:'', //''单张，'more':多张
        imgMultiple:'',
        dataList:[],
        product:'',
        speedBox:false,
        speedBoxList:[],
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

      for (var k in data) {

        let yanzheng = /^[\s\S]*cdr$/;   //判断后三位是否为cdr

        if(!yanzheng.test(data[k].name)){
          this.productionUpload(data[k],'')
        }else{
          this.cdrLook(data[k]);  
        }
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

    loadImgonClick(param,type,product){
      this.speedBoxList = []
      this.buzhouPorp = true
      this.imgMore = type
      this.sort = param
      this.product = product
      if(type!=undefined){
        this.imgMultiple = 'multiple'
      }else{
        this.imgMultiple = ''
      }
    },
    // 上传文件
    beforeAvatarUpload(zipFile) {
      let yanzheng = /^[\s\S]*cdr$/;   //判断后三位是否为cdr

      if(!yanzheng.test(zipFile.name)){
        this.productionUpload(zipFile,'')
        return
      }
      this.cdrLook(zipFile);  
    },


    // cdr文件提取预览图
    cdrLook(zipFile){
      const jszip = new JSZip()
      jszip.loadAsync(zipFile).then((zip) => { // 读取zip
        for (let key in zip.files) { 
            if (!zip.files[key].dir) {  // 判断是否是目录
                if (/\.(png|jpg|jpeg|gif|bmp)$/.test(zip.files[key].name)) { // 判断是否是图片格式

                  let wenjianjia = zip.files[key].name.split('/')
                  if(wenjianjia[0]=='previews'){
                    let mc = zip.files[key].name
                    let mcName = mc.includes("page")
                    if(mcName==false){
                      let base = zip.file(zip.files[key].name).async('base64') // 将图片转化为base64格式
                      base.then(res => {
                        let img =  `data:image/png;base64,${res}`
                        this.productionUpload(zipFile,'cdr',img)
                      })
                    }

                  }
                             
                }
            }
        }
      })
    },

    // 上传文件请求
    productionUpload(file,type,img){
      let that = this
      let {product,speedBoxList} = this
      let name = file.name
      let param = new FormData(); // 创建form对象
      param.append("file",file);
      param.append("name",name); 

      let info = {
        name:file.name,
        speed:0,
      }
      speedBoxList.push(info)

      var config = {
          onUploadProgress: function (e) {
            //属性lengthComputable主要表明总共需要完成的工作量和已经完成的工作是否可以被测量
            //如果lengthComputable为false，就获取不到e.total和e.loaded 
            if (e.lengthComputable) {
              var rate = e.loaded / e.total;  //已上传的比例
              if (rate < 1) {
                //这里的进度只能表明文件已经上传到后台，但是后台有没有处理完还不知道
                //因此不能直接显示为100%，不然用户会误以为已经上传完毕，关掉浏览器的话就可能导致上传失败
                //等响应回来时，再将进度设为100%
                speedBoxList = speedBoxList.map(function(item, index, arr) {
                  if(item.name == file.name){
                    item.speed = Number((rate *100).toFixed(0));
                  }
                  return item;
                })	
              }
            }
          }
      };
      this.$post('post',this.baseUrl +'/production/upload',param,config,
      ).then((res) => {
        // this.closeFullScreen(this.openFullScreen()); //关闭加载框
        if (res.code == 200) {

          speedBoxList = speedBoxList.map(function(item, index, arr) {
            if(item.name == file.name){
              item.speed = 100;
            }
            return item;
          })


          this.active =2
          this.buzhou = 1
          if(type=='cdr'){
            this.imgInfoFunction(name,res.data,img)
          }else{
            if(!product){
              this.imgInfoFunction(name,res.data)
              return
            }
            this.getFile(file,name,res.data);
          }     
        }
      })
    },

    // 文件赋值
    imgInfoFunction(name,code,img){
      let {localList,imgMore,imgInfo} = this
      if(imgMore=='more'){
        localList.push(name)
        imgInfo.push(
          {
            name:name,
            code:code,
            img
          }
        )
      }else{
        this.localList = []
        this.localList.push(name)
        this.wenjianNanme = name 
        this.wenjianCode  =  code 
        this.wenjianImg  =  img
      }       
    },


    getBase64(file) {
      return new Promise(function(resolve, reject) {
        let imgResult = ''
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            imgResult = reader.result;
        };
        reader.onerror = function(error) {
            reject(error);
        };
        reader.onloadend = function() {
            resolve(imgResult);
        };
      });
    },

    // 上传wenjia 
    getFile(file, name,code) {
      this.getBase64(file).then(res => {
        // console.log(111);
        // if(imgMore=='more'){
        //   localList.push(name)
        //   imgInfo.push(
        //     {
        //       name:name,
        //       code:code,
        //       img:res
        //     }
        //   )
        //   console.log(this.imgInfo); 
        // }else{
        //   this.localList = []
        //   this.localList.push(name)
        //   this.wenjianNanme = name 
        //   this.wenjianCode  = code
        //   this.wenjianImg  =  res
        // }

        this.imgInfoFunction(name,code,res)
      });
    },

    // 下一步
    next() {this.active++},
    // 完后上传
    finishBtn(){
      let { sort, wenjianNanme, wenjianCode,imgInfo,imgMore,wenjianImg } = this
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
            wenjianImg,
            imgMore,
        }

        this.$emit('func',imgval)

      }
      this.buzhou = 1 //1.本地上传，2.设计器上传
      this.buzhouPorp = false
      this.publicPorp = false
      this.active = 1

      this.speedBoxList = [] //清空

      this.localList = [] //上传之前先清空
      this.imgInfo = []
      this.wenjianNanme = ''
      this.wenjianCode = ''
      this.wenjianImg = ''
      

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
      this.speedBoxList = [] //清空
      this.wenjianNanme = ''
      this.wenjianCode = ''
      this.wenjianImg = ''
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
          background: #E7E8F4;
          border-radius: 4px;
          p{
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 1px solid #333;
            text-align: center;
            line-height: 13px;
            font-size: 12px;
            margin-left: 10px;
          }
          span{
            height: 32px;
            background: #E7E8F4;
            line-height: 32px;
            flex: 1;
            padding: 0 16px 0 10px;
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

  .jinduBOX{
    margin-top: 30px;
    .speed{
      margin-bottom: 20px;

      p{
        color: #fff;
        margin-top: 10px;
      }
    }
  }
</style>
