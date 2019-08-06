//使用axios的拦截页面的所有错误请求,并弹出对应的提示
import {Message} from "element-ui"
//每个nuxt插件都会暴露出一个函数
//插件的每一个参数是默认的nuxt对象
export default ({$axios,redirect})=>{
    $axios.onError(err=>{
        // 判断错误信息,提示错误的返回
        const {statusCode,message} = err.response.data;
        if(statusCode===401||statusCode===406){
            //跳转到登录页
            redirect('/user/login')
        }
        if(statusCode===400){
            Message.warning(message)
        }
    })
}