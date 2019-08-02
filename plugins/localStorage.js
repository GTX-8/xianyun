// ~/plugins/localStorage.js

import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
  window.onNuxtReady(() => {
    createPersistedState({
        //本地存储键名
        key: 'store'
    })(store)
  })
}