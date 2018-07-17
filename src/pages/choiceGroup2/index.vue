<template>
  <div class="choiceGroup">
    <div class="quan animation back-in-right">
      <div class="create"></div>
      <div class="sectors2">
        <div class="fenge"></div>
        <div class="fenge"></div>
        <div class="fenge"></div>
        <a @click="reg(2)" class="sector1 ripple">
          <div class="tw1">
            <img src="../../assets/img/laoshi.png" alt="" class="icon">
            <div class="text">我是任课老师</div>
          </div>
        </a>
        <a @click="reg(3)" class="sector2 ripple">
          <div class="tw1">
            <img src="../../assets/img/jiazhang.png" alt="" class="icon">
            <div class="text">我是家长</div>
          </div>
        </a>
        <a @click="reg(4)" class="sector3 ripple">
          <div class="tw1">
            <img src="../../assets/img/xuesheng.png" alt="" class="icon">
            <div class="text">我是学生</div>
          </div>
        </a>
      </div>
    </div>

    <!-- <div class="footerTip">
      <div class="title">提示</div>
      <div class="text">职位选择仅有一次, 生效后一年内无法修改</div>
      <div class="text">或者致电官方电话, 进行实名认证后修改</div>
    </div> -->
  </div>
</template>

<script>
import { wxGetGlobalData } from "@/utils/wx";
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
    return {};
  },
  methods: {
    reg(id) {
      let that = this;
      let formData = {
        id: this.$mp.query.bid
      };
      let group = store.state.userInfo.group;

      if (id === 2) {
        wx.navigateTo({
          url: "../reg3/main?bid=" + this.$mp.query.bid
        });
        return;
      }

      // 学生
      if (id === 4) {
        wxShowLoading("注册中...");
        that.$http
          .post(Api.addStudent, formData, {
            headers: {
              Cookie: store.state.cookie
            }
          })
          .then(response => {
            let res = response.data;

            if (res.code) {
              wxShowToast(res.msg);
              setTimeout(() => {
                wx.navigateBack();
                return;
              }, 1500);
            } else {
              wxShowToast(res.msg);
              console.log(res);
            }
          });
      }
      // 家长
      if (id === 3) {
        wx.navigateTo({
          url: "../reg2/main?bid=" + this.$mp.query.bid
        });
        return;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@function fsub($x, $y) {
  @return $x - $y;
}

.choiceGroup {
  padding: 0 16rpx;
  width: 100%;
  display: flex;
  align-items: center;
  .quan {
    width: 100%;
    height: 718rpx;
    border-radius: 50%;
    // margin-top: 140rpx;
    position: relative;
    background: #fff;
    overflow: hidden;
    .create {
      width: 270rpx;
      height: 270rpx;
      border-radius: 50%;
      background: #f7f7f7;
      position: absolute;
      left: 224rpx;
      top: 224rpx;
      z-index: 9;
      overflow: hidden;
    }
    .sectors {
      width: 100%;
      height: 100%;
      position: relative;
    }
    .sectors2 {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      .fenge {
        width: 20rpx;
        height: 230rpx;
        background: #f7f7f7;
        position: absolute;
        &:nth-child(1) {
          transform: rotate(70deg);
          left: 585rpx;
          top: 170rpx;
        }
        &:nth-child(2) {
          transform: rotate(-55deg);
          left: 151rpx;
          top: 100rpx;
        }
        &:nth-child(3) {
          transform: rotate(15deg);
          left: 304rpx;
          top: 488rpx;
        }
      }
      .sector1 {
        width: 300rpx;
        height: 200rpx;
        position: absolute;
        display: flex;
        justify-content: center;
        left: 232rpx;
        top: 27rpx;
      }
      .sector2 {
        width: 300rpx;
        height: 200rpx;
        position: absolute;
        display: flex;
        justify-content: center;
        left: 385rpx;
        top: 435rpx;
      }
      .sector3 {
        width: 300rpx;
        height: 200rpx;
        position: absolute;
        display: flex;
        justify-content: center;
        left: -6rpx;
        top: 335rpx;
      }
      .tw1 {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .icon {
          width: 82rpx;
          height: 82rpx;
        }
        .text {
          font-size: 32rpx;
        }
      }
    }
  }

  .footerTip {
    display: flex;
    width: fsub(750rpx, 32rpx);
    flex-direction: column;
    background: #fff;
    border-radius: 8rpx;
    align-items: center;
    padding-bottom: 35rpx;
    padding-top: 30rpx;
    position: fixed;
    bottom: 50rpx;
    .title {
      color: #332c2b;
      font-size: 32rpx;
    }
    .text {
      color: #666;
      font-size: 28rpx;
      line-height: 50rpx;
    }
  }
}
</style>
