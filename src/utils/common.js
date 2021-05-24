import store from '@/store/store'
const Fns={
    confirm_pop(cnt,title){
        return new Promise((resolve, reject) => {
            this.$confirm(cnt, title?title:"提示", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                callback:function(action, instance){
                    // instance.close
                    // function(action, instance)，action 的值为'confirm', 'cancel'或'close', instance 为 MessageBox 实例，可以通过它访问实例上的属性和方法
                    action == "confirm"?resolve(true):instance.close;
                }
              })
        })
    },
    getExpressCompany(){
        this.$post("get",this.baseUrl+"/order/listExpressCompany").then((res)=>{
            if(res.code == 200){
                store.state.expCompany = res.data;

                console.log(res.data)
            }
        });
    },

    openFullScreen() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        return loading;
    },
    closeFullScreen(loading){
    loading.close();
    },
}
export default Fns