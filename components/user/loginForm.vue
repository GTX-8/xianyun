<template>
  <el-form :model="loginForm" ref="loginForm" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名/手机" v-model="loginForm.username" type="text"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="loginForm.password" @keyup.native.enter="login"></el-input>
    </el-form-item>

    <p class="form-text">
      <nuxt-link to="#">忘记密码</nuxt-link>
    </p>

    <el-button class="submit" type="primary" @click="login">登录</el-button>
  </el-form>
</template>

<script>
export default {
    data(){
        return {
            loginForm:{
                username:"",
                password:""
            },
            rules:{
                username:[{required:true,message:'请输入用户名',trigger:'blur'}],
                password:[{required:true,message:"请输入密码",trigger:'blur'}]
            }
        }
    },
    methods:{
        login(){
            //验证表单
            this.$refs.loginForm.validate(valid=>{
                if(valid){
                    this.$axios({
                        url:'/accounts/login',
                        method:'POST',
                        data:this.loginForm
                    }).then(res=>{
                        //mutations下的方法都必须使用commit来调用
                        //第一个参数是调用的方法名,第二个参数就是数据
                        this.$store.commit('user/setUserInfo',res.data)
                        this.$message.success('登录成功,正在跳转...')
                        setTimeout(()=>{
                            this.$router.push("/")
                        },1500)
                    })
                }
            })
        }
    }
};
</script>

<style scoped lang="less">
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>