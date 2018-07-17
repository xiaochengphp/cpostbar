import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
    config: {
      navigationBarTitleText: '班级便利贴',
      // navigationBarBackgroundColor: '#72bbe6',
      enablePullDownRefresh: true
    }
  }