<template>
  <div class="reg">
    <Toptip :content="toptip.content" :isShow="toptip.show" @tipHide="tipHide"></Toptip>
    <div class="weui-cells weui-cells_after-title">
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">姓名</div>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" v-model.lazy="username" placeholder="请输入姓名" />
        </div>
      </div>
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">性别</div>
        </div>
        <div class="weui-cell__bd">
          <picker :range="sexs" :value="sex" @change="sexChange">
            <div class="weui-input">{{ sexs[sex]?sexs[sex]: '请选择性别' }}</div>
          </picker>
        </div>
      </div>
    </div>
    <div class="submit">
      <button @click="submit">实名认证</button>
    </div>
    <div class="gTip">
      <div class="title">提示</div>
      <div class="text">请填写您的真实信息，一但提交，将无法更改。
      </div>
    </div>
  </div>
</template>

<script>
import Toptip from "@/components/toptip";
import { isName } from "@/utils";
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
      sexs: ["男", "女"],
      sex: null,
      username: "",
      toptip: {
        content: "",
        show: false
      },
      group: 0,
      isCreate: false
    };
  },
  onShow() {
    // 如果不创建班级
    if (store.state.userInfo.username !== '' && !this.$mp.query.fenxiang) {
      wx.reLaunch({
        url: "../index/main"
      });
    }
  },
  onLoad(e) {
    this.group = e.group;

    if (this.group === "999") {
      this.group = 1;
      this.isCreate = true;
    }
  },
  methods: {
    // 性别
    sexChange(e) {
      this.sex = e.mp.detail.value;
    },
    // 注册身份
    submit() {
      if (!isName(this.username)) {
        this.toptip.content = "请输入正确的姓名";
        this.toptip.show = true;
        return;
      }
      if (this.sex === null) {
        this.toptip.content = "选择性别";
        this.toptip.show = true;
        return;
      }
      let formData = {
        username: this.username,
        gender: parseInt(this.sex) + 1,
        group: this.group
      };

      let that = this;
      wxShowLoading("注册中...");
      this.$http
        .post(Api.reg, formData, {
          headers: {
            Cookie: store.state.cookie
          }
        })
        .then(response => {
          let res = response.data;
          if (res.code === 1) {
            getApp().globalData.userInfo = res.result; // 用户信息
            store.commit("setUserInfo", res.result);

            wx.setStorage({
              key: "userInfo",
              data: store.state.userInfo
            });
            wxHideLoading();
            wxShowToast("注册成功", "success", () => {
              setTimeout(() => {
                if (!this.isCreate) {
                  wx.navigateBack({
                    delta: 2
                  });
                } else {
                  // 点击创建班级
                  wx.navigateTo({
                    url: "../create/main"
                  });
                }
              }, 1500);
            });
          } else {
            wxShowToast(res.msg);
          }
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });

      console.log(this.$data);
    },
    // 隐藏错误信息
    tipHide(val) {
      this.toptip.show = val;
    }
  },
  watch: {
    username(val) {
      if (!isName(val)) {
        this.toptip.content = "请输入正确的姓名";
        this.toptip.show = true;
      }
    }
  },
  components: {
    Toptip
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

.weui-input {
  color: #808080;
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

