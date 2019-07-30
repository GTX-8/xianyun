<template>
  <div class="header">
    <div class="main">
      <el-row type="flex" justify="space-between">
        <!-- logo -->
        <div class="logo">
          <nuxt-link to="/">
            <img src="http://157.122.54.189:9093/images/logo.jpg" alt />
          </nuxt-link>
        </div>
        <!-- 菜单栏 -->
        <el-row type="flex" class="navs">
          <nuxt-link to="/">首页</nuxt-link>
          <nuxt-link to="/post">旅游攻略</nuxt-link>
          <nuxt-link to="/hotel">酒店</nuxt-link>
          <nuxt-link to="/air">国内机票</nuxt-link>
        </el-row>
        <!-- 登录 用户信息 -->
        <!-- 登录 -->
        <div class="login">
          <div v-if="power">
            <el-dropdown>
              <span class="el-dropdown-link">
                <div class="hole"></div>
                <img src="http://157.122.54.189:9095/assets/images/avatar.jpg" alt />
                <em>大帅比</em>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-else>
            <nuxt-link to="/user/login" class="account-link">登录/注册</nuxt-link>
          </div>
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      power: true
    };
  }
};
</script>

<style lang="less">
.header {
  height: 60px;
  line-height: 60px;
  border-bottom: 1px solid #ccc;
  box-shadow: 0 3px 0 #f5f5f5;
  background: #fff;
  box-sizing: border-box;
  .main {
    width: 1000px;
    height: 60px;
    margin: 0 auto;
  }
  .logo {
    margin-top: 9px;
    img {
      width: 156px;
      height: 42px;
      display: block;
    }
  }
  .navs {
    flex: 1;
    margin-left: 20px;
    a {
      display: block;
      padding: 0 20px;
      height: 60px;
      box-sizing: border-box;
      &:hover {
        border-bottom: 5px solid #409eff;
        color: #409eff;
      }
    }
    //nuxt会通过url匹配每个nuxt-link标签的链接,如果匹配默认会加上nuxt-link-exxact-active样式
    .nuxt-link-exact-active {
      background: #409eff;
      color: #fff;
      &hover {
        color: #fff;
      }
    }
  }
  .login {
    .account-link {
      font-size: 14px;
      color: #666;
      &:hover {
        color: #409eff;
        text-decoration: underline;
      }
    }
    .el-dropdown-link {
      display: block;
      width: 148px;
      text-align: center;
      em {
        font-size: 14px;
        color: #666;
      }
      img {
        width: 36px;
        height: 36px;
        vertical-align: middle;
        border-radius: 50%;
        margin-right: 5px; 
        border: 2px solid #fff; 
      }
      &:hover img {
        border: 2px solid #409eff;
      }
    }
  }
}
</style>
