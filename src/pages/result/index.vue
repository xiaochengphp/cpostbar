<template>
  <div class="result">
    <div class="tip">
      <icon type="success" size="90" />
      <div class="text">创建成功</div>
    </div>
    <div class="btns">
      <a @click="go">进入班级</a>
      <button open-type="share">邀请加入</button>
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
  wxHideLoading
} from "@/utils/wx";

export default {
  data() {
    return {
      bid: 0,
      imageUrl: "",
      name: ""
    };
  },
  onLoad() {
    this.bid = this.$mp.query.bid;
    let that = this;

    wxShowLoading("生成分享链接中");
    that.$http
      .post(
        Api.getClassRoom,
        { id: that.bid },
        {
          headers: {
            Cookie: store.state.cookie
          }
        }
      )
      .then(response => {
        let res = response.data;
        if (res.code) {
          wxHideLoading();
          that.name = res.result.name;
          that.imageUrl = res.result.cover;
        }
      });
  },
  methods: {
    go() {
      wx.reLaunch({
        url: "../detailList/main?bid=" + this.bid + "&flag=fenxiang"
      });
    }
  },
  onShareAppMessage(res) {
    if (res.from === "button") {
      console.log(res.target);
    }
    let time = new Date().getTime() + 86400000 * 3;
    return {
      title: "邀请加入" + this.name + "请点击",
      imageUrl: this.imageUrl,
      path:
        "/pages/detailList/main" +
        "?bid=" +
        this.bid +
        "&flag=fenxiang" +
        "&time=" +
        time
    };
  }
};
</script>

<style lang="scss" scoped>
.result {
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  .tip {
    text-align: center;
    margin-top: 140rpx;
    .text {
      margin-top: 40rpx;
      margin-bottom: 60rpx;
      font-size: 32rpx;
      color: #333;
    }
  }
  .btns {
    display: flex;
    width: 100%;
    padding: 0 120rpx;
    justify-content: space-between;
    a,
    button {
      width: 220rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 16rpx;
      font-size: 30rpx;
      margin: 0;
      padding: 0;
    }
    a {
      color: #fff;
      background: #2287d4;
    }
    button {
      color: #2287d4;
      background: #fff;
      border: 1px solid #2287d4;
    }
  }
}
</style>
