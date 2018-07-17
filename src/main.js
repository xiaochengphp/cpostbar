import Vue from 'vue'
import App from './App'

// import '@/assets/css/animate.min.css';   // https://www.cnblogs.com/xiaohuochai/p/7372665.html

import './assets/css/motion.css';           // http://demo.htmleaf.com/1805/201805031502/index.html
import './assets/css/weui.css'              // https://github.com/weui/weui-wxss
import "./assets/css/iconfont/iconfont.css";

import Api from './utils/api';


// flyio 网络请求
var Fly = require("flyio/dist/npm/wx");       // https://wendux.github.io/dist/#/doc/flyio/readme
var fly = new Fly;
fly.config.baseURL = Api.BaseUrl;           //配置请求基地址

Vue.prototype.$http = fly;                    //将fly实例挂在vue原型上

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      '^pages/index/main',
      'pages/tieba/main',
      'pages/result/main',
      'pages/choiceGroup/main',
      'pages/create/main',
      'pages/personal/main',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
    },
    "tabBar": {
      "color": "#333333",
      "selectedColor": "#333333",
      "list": [{
        "pagePath": "pages/index/main",
        "iconPath": "./static/img/home.png",
        "selectedIconPath": "./static/img/home.png",
        "text": "首页"
      }, {
        "pagePath": "pages/personal/main",
        "iconPath": "./static/img/personal.png",
        "selectedIconPath": "./static/img/personal.png",
        "text": "我的"
      }]
    },
  }
}
