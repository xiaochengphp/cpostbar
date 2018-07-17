<template>
  <div class="card">
    <a :href="'../detailList/main?bid=' + v.id " class="item">
      <div class="img" v-if="v.cover" :style="{backgroundImage: 'url('+ v.cover +')'}"></div>
      <div class="info">
        <div class="classroom">{{ v.name }}</div>
        <div class="address">{{ v.address }}</div>
        <div class="name">
          <span>班主任: </span>
          <span>{{ v.bzr }}</span>
        </div>
        <div class="tool">
          <div>
            <img src="../assets/img/date.png" alt="" class="icon">
            <span>{{ v.which }}</span>
            <span>年</span>
          </div>
          <div>
            <img src="../assets/img/user.png" alt="" class="icon">
            <span>{{ v.number }}</span>
            <span></span>
          </div>
        </div>
        <div class="link">进入班级</div>
      </div>
    </a>
  </div>
</template>

<script>
  export default {
    props: {
      v: Object
    },
    onLoad(){

    }
  }
</script>

<style lang="scss" scoped>
.card {
  .item {
    padding: 30rpx;
    display: flex;
    background: #fff;
    position: relative;
    &:after {
      content: "";
      display: block;
      width: 100%;
      height: 2rpx;
      background: #f7f7f7;
      position: absolute;
      bottom: 0;
      left: 0;
    }
    .img {
      width: 166rpx;
      height: 160rpx;
      border-radius: 8rpx;
      background-position: center;
      background-size: cover;
    }
    .info {
      padding-left: 30rpx;
      color: #666;
      .classroom {
        color: #333;
        font-size: 28rpx;
      }
      .address {
        font-size: 26rpx;
      }
      .name {
        font-size: 24rpx;
      }
    }
    .tool {
      display: flex;
      font-size: 24rpx;
      div {
        margin-right: 10rpx;
        .icon {
          width: 19rpx;
          height: 19rpx;
          margin-right: 10rpx;
        }
      }
    }
    .link {
      position: absolute;
      top: 80rpx;
      right: 40rpx;
      font-size: 28rpx;
      color: #666;
      background: #e6e6e6;
      padding: 0 20rpx;
      height: 52rpx;
      line-height: 52rpx;
      border-radius: 52rpx;
    }
  }
}
</style>
