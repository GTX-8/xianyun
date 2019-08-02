//用户管理
export const state = () => {
  //采用接口返回数据结构
  return {
    userInfo: {
      token: "",
      user: {}
    }
  }
}
//同步修改数据mutation
export const mutations = {
  //保存用户信息到state
  //state就是上面的state,这个参数是默认的
  setUserInfo(state, data) {
    state.userInfo = data
  },
  //清除登录状态
  clearUserInfo(state){
    state.userInfo = {
        token:'',
        user:{}
    }
  }
}
export const actions = {}
