<template>
  <div class="login">
    <img src="../../assets/img/logo.png" alt="" class="loginImg">
    <div class="Logincontent">
      <div class="title">申请获取以下权限</div>
      <div class="text">获得你的公开信息(昵称、头像等)</div>
    </div>
    <button @getuserinfo="getUserInfo" open-type="getUserInfo" lang="zh_CN" class="getUserInfoBtn">登录授权</button>
  </div>
</template>

<script>
import Api from "@/utils/api";
import { getPHPSESSION } from "@/utils";
import {
  wxShowToast,
  wxHideToast,
  wxShowLoading,
  wxHideLoading
} from "@/utils/wx";
import store from "@/store";

export default {
  data() {
    return {
      oldUrl: "../index/main"
    };
  },
  onShow(e) {
  },
  onLoad(e) {
    // console.log("login page");
  },
  methods: {
    // 获取用户信息
    getUserInfo(e) {
      let that = this;
      let userData = e.mp.detail;

      switch (userData.errMsg) {
        case "getUserInfo:ok": // 授权成功
          wxShowLoading("登录授权中...");
          this.login(userData);
          break;
        case "getUserInfo:fail auth deny": // 授权失败
          wxShowToast("登录授权失败,请重新授权");
          break;
      }
    },
    // 登录
    login(data) {
      let that = this;

      wx.login({
        success(wxres) {
          let formData = {
            code: wxres.code,
            encryptedData: encodeURIComponent(data.encryptedData),
            iv: encodeURIComponent(data.iv)
          };
          that.$http.post(Api.login, formData).then(response => {
            let res = response.data;
            let header = response.headers;
            console.log(header);
            if (res.code === 1) {
              let cookie = getPHPSESSION(header["set-cookie"]);
              console.log(cookie);
              // 存储到全局
              store.commit("setCookie", cookie);
              store.commit("setUserInfo", res.result);
              store.commit("setLogin", true);
              // 设置缓存
              wx.setStorage({
                key: "cookie",
                data: store.state.cookie
              });
              wx.setStorage({
                key: "userInfo",
                data: store.state.userInfo
              });

              // 登录成功延迟进入页面
              wxHideLoading();
              wxShowToast("登录成功", "success", () => {
                setTimeout(() => {
                    wx.navigateBack();
                    return;
                }, 1500);
              });
            } else {
              wxShowToast(res.msg);
            }
          });
        },
        fail(res) {
          wxShowToast("登录授权失败,请重新授权");
          console.log(res);
        }
      });
    },
    getCurrentPageUrlWithArgs2(url, options) {
      //拼接url的参数
      var urlWithArgs = url + "?";
      for (var key in options) {
        var value = options[key];
        urlWithArgs += key + "=" + value + "&";
      }
      urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1);

      return urlWithArgs;
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  flex: 1;
  padding: 0 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  padding: 0 40rpx;
  .loginImg {
    width: 200rpx;
    height: 200rpx;
    border-radius: 50%;
    margin: 80rpx 0;
  }
  .Logincontent {
    width: 100%;
    text-align: left;
    padding: 60rpx 0;
    border-top: 2rpx solid #f7f7f7;
    .title {
      font-size: 36rpx;
      margin-bottom: 30rpx;
    }
    .text {
      color: #666;
      line-height: 40rpx;
      font-size: 32rpx;
    }
  }
  .getUserInfoBtn {
    width: 100%;
    height: 90rpx;
    border-radius: 90rpx;
    line-height: 90rpx;
    text-align: center;
    color: #fff;
    background: #336699;
    font-size: 32rpx;
    margin-top: 20rpx;
  }
}
</style>
