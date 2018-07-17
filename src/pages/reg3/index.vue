<template>
  <div class="reg">
    <div class="weui-cells weui-cells_after-title">
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">任课科目</div>
        </div>
        <div class="weui-cell__bd">
          <input type="text" class="weui-input" v-model="subject">
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
  data() {
    return {
      arr: 0,
      arrs: [],
      username: " "
    };
  },
  onShow(e) {},
  methods: {
    // 注册身份
    submit() {
      let that = this;
      let formData = {
        id: this.$mp.query.bid,
        subject: this.subject
      };
      wxShowLoading("注册中");
      that.$http
        .post(Api.addTeacher, formData, {
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
    },
    sexChange(e) {
      this.arr = e.mp.detail.value;
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

