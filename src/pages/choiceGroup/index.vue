<template>
  <div class="choiceGroup">
    <div class="quan animation back-in-right">
      <div class="create">
        <a href="../reg/main?group=999">
          <img src="../../assets/img/create.png" alt="" class="icon">
          <div class="text">创建班级</div>
        </a>
      </div>

      <div class="sectors">
        <block v-for="(v, k) in group1" :key="k">
          <a :href="v.url"  class="sector ripple">
            <div class="tw1">
              <img :src="v.icon" alt="" class="icon">
              <div class="text">{{ v.text }}</div>
            </div>
          </a>
        </block>
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

export default {
  data() {
    return {
      group: [],
      group1: [
        {
          text: "我是班主任",
          url: "../reg/main?group=999",
          icon: require("../../assets/img/laoshi.png")
        },
        {
          text: "我是任课老师",
          url: "../reg/main?group=2",
          icon: require("../../assets/img/laoshi.png")
        },
        {
          text: "我是家长",
          url: "../reg/main?group=3",
          icon: require("../../assets/img/jiazhang.png")
        },
        {
          text: "我是学生",
          url: "../reg/main?group=4",
          icon: require("../../assets/img/xuesheng.png")
        }
      ],
      group2: [
        {
          text: "我是任课老师",
          url: "./index/main?group=任课老师",
          icon: "../../assets/img/laoshi.png"
        },
        {
          text: "我是家长",
          url: "./index/main?group=家长",
          icon: "../../assets/img/jiazhang.png"
        },
        {
          text: "我是学生",
          url: "./index/main?group=学生",
          icon: require("../../assets/img/xuesheng.png")
        }
      ]
    };
  },
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
      a {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .icon {
        width: 66rpx;
        height: 66rpx;
        margin-bottom: 20rpx;
      }
      .text {
        font-size: 32rpx;
      }
    }
    .sectors {
      width: 100%;
      height: 100%;
      position: relative;
      .sector {
        width: 50%;
        height: 50%;
        color: #333333;
        background: #fff;
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 0;
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
        &:nth-child(1) {
          border-bottom: 10rpx solid #f3f3f3;
          border-right: 10rpx solid #f3f3f3;
        }
        &:nth-child(2) {
          left: 50%;
          border-left: 10rpx solid #f3f3f3;
          border-bottom: 10rpx solid #f3f3f3;
        }
        &:nth-child(3) {
          top: 50%;
          left: 50%;
          border-top: 10rpx solid #f3f3f3;
          border-left: 10rpx solid #f3f3f3;
        }
        &:nth-child(4) {
          top: 50%;
          border-right: 10rpx solid #f3f3f3;
          border-top: 10rpx solid #f3f3f3;
        }
      }
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
