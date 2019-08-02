<template>
  <el-form :model="registerForm" ref="registerForm" :rules="rules" class="form">
    <el-form-item class="form-item" prop>
      <el-input placeholder="用户名手机" v-model="registerForm.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="验证码" v-model="registerForm.captcha">
        <template slot="append">
          <el-button @click="handleSendCaptcha">发送验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="你的名字" v-model="registerForm.nickname"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="registerForm.password"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="checkPassword">
      <el-input
        placeholder="确认密码"
        type="password"
        v-model="registerForm.checkPassword"
        @keyup.native.enter="handleRegSubmit"
      ></el-input>
    </el-form-item>

    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.checkPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      // 表单数据
      registerForm: {
        username: "",
        captcha: "",
        nickname: "",
        password: "",
        checkPassword: ""
      },
      // 表单规则
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        checkPassword: [
          {
            validator: validatePass,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 发送验证码
    handleSendCaptcha() {
      if (!this.registerForm.username) {
        this.$message.warning("手机号码不能为空");
        return;
      }
      this.$axios({
        url: "/captchas",
        method: "POST",
        data: {
          tel: this.registerForm.username
        }
      }).then(res => {
        const { code } = res.data;
        this.$alert(`您的验证码为:${code}`, "提示", { type: "success" });
      });
    },

    // 注册
    handleRegSubmit() {
      this.$refs.registerForm.validate(valid => {
        const { checkPassword, ...props } = this.registerForm;
        if (valid) {
          this.$axios({
            url: "/accounts/register",
            method: "POST",
            data: props
          }).then(res => {
            //把注册成功后的用户名渲染到header组件上面
            this.$store.commit("user/setUserInfo", res.data);
            this.$message.success("恭喜您,注册成功")
            setTimeout(() => {
              this.$router.push("/");
            }, 1500);
          });
        }
      });
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