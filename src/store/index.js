import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    userInfo: [],
    cookie: '',
    login: false
  },
  mutations: {
    setUserInfo(state, userInfo){
      state.userInfo = userInfo
    },
    setCookie(state, cookie){
      state.cookie = cookie
    },
    setLogin(state, login){
      state.login = login
    } 
  }
})

export default store