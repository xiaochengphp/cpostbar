<script>
import store from "@/store";

export default {
  data() {
    return {
      name: "Hello"
    };
  },
};
</script>

<style lang="scss">
page {
  background: #f7f7f7;
  display: flex;
  justify-content: center;
  font-size: 32rpx;
  width: 100%;
  height: 100%;
  line-height: 1;
  color: #333;
}
view,
navigator,
text,
image,
input {
  box-sizing: border-box;
}
.notcontent{
  width: 100%;
  padding: 40rpx;
  text-align: center;
  color: #aaa;
  font-size: 32rpx;
  background: #fff;
}

.ripple {
  position: relative;
  overflow: hidden;
  display: block;
  text-align: center;
  height: 92rpx;
  line-height: 92rpx;
}

.ripple:after {
  content: "";
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, #666 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform 0.9s, opacity 0.5s;
}

.ripple:active:after {
  transform: scale(0, 0);
  opacity: 0.3;
  transition: 0s;
}

.gTip {
  clear: both;
  border-radius: 16rpx;
  padding: 0 50rpx;
  padding-bottom: 35rpx;
  padding-top: 30rpx;
  margin: 23rpx;
  border: 1px solid #e6e6e6;
  .title {
    color: #332c2b;
    font-size: 32rpx;
  }
  .text {
    color: #808080;
    font-size: 28rpx;
    line-height: 50rpx;
  }
}

.weui-input {
  color: #aaa;
  text-align: right;
  .addIcon {
    width: 44rpx;
    height: 44rpx;
    vertical-align: middle;
  }
}
.weui-cells {
  margin-bottom: 20rpx !important;
}
.weui-cells:before,
.weui-cell:before {
  border-top: 1px solid #f7f7f7 !important;
}
.weui-cells:after {
  border-bottom: 1px solid #f7f7f7 !important;
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
