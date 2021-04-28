import constant from './constant'
const filters = {
    yhc_status(n){
        console.log(n)
        let status =  constant.receiveStatus.filter((item,i)=>{
            return n == item.value;
        });
        if(status.length>0){
            return status[0].name;
        }else{
            return "";
        }
    },
    source(n){
        let status =  constant.source.filter((item,i)=>{
            return n == item.value;
        });
        if(status.length>0){
            return status[0].name;
        }else{
            return "";
        }
    },
    yhc_dlyType(n){
        let str = "";
        constant.deliveryType.map((item,i)=>{
            if(n == item.value){
                str = item.name;
            }
        });
        return str;
    },    

}

export default (Vue) => {
    Object.keys(filters).forEach(key => {
        Vue.filter(key, filters[key])
    })

}