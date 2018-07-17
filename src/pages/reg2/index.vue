<template>
  <div class="reg">
    <div class="weui-cells weui-cells_after-title">
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">孩子姓名</div>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" v-model="username" placeholder="请输入孩子姓名" />
        </div>
      </div>
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">称谓</div>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" v-model="appellation" placeholder="称谓" />
        </div>
      </div>
    </div>
    <div class="submit">
      <button @click="submit">确定加入</button>
    </div>
  </div>
</template>

<script>
import Api from "@/utils/api";
import store from "@/store";
import {
  wxShowToast,
  wxHideToast,
  wxShowLoading,
  wxHideLoading,
  wxGetGlobalData,
  wxGetHeaderCookie
} from "@/utils/wx";

export default {
  data() {},
  onLoad(e) {},
  methods: {
    // 注册身份
    submit() {
      let that = this;
      let formData = {
        id: this.$mp.query.bid,
        name: this.username,
        appellation: this.appellation,
        invite: false
      };
      wxShowLoading('注册中');
      that.$http
        .post(Api.addGuardian, formData, {
          headers: {
            Cookie: store.state.cookie
          }
        })
        .then(response => {
          let res = response.data;
          wxShowToast(res.msg);
          if (res.code) {
            setTimeout(() => {
              wx.navigateBack({
                delta: 2
              });
              return;
            }, 1500);
          } else {
            wxShowToast(res.msg);
          }
          console.log(res);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.reg {
  width: 100%;
  .submit {
    margin: 90rpx 75rpx;
    button {
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
}
.weui-label,
.weui-cell__bd,
.weui-cell__hd {
  color: #808080;
  font-size: 32rpx;
}
.weui-cell {
  height: 92rpx;
  line-height: 92rpx;
}
</style>

