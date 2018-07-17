<template>
  <div class="detail">
    <div class="detailc">
      <div class="detailTitle">
        <div class="title">{{ info.title }}</div>
        <div class="date">{{ info.create_time }}</div>
      </div>
      <div class="item_c">
        <text selectable class="content">{{ info.content }}</text>
        <div class="imgs">
          <block v-for="(img, ik) in info.imgs" :key="ik">
            <div class="img" :style="{backgroundImage: 'url('+ img +')'}" @click="previewImage(info.imgs, ik)"></div>
          </block>
        </div>
      </div>
    </div>

    <block v-for="(v, k) in item" :key="k">
      <div class="item">
        <div class="title">{{ v.cate + ' : ' }}</div>
        <div class="item_c">
          <text class="content" selectable>{{ v.content }}</text>
          <div class="imgs" v-if="v.imgs.length">
            <block v-for="(img, ik) in v.imgs" :key="ik">
              <div class="img" :style="{backgroundImage: 'url('+ img +')'}" @click="previewImage(v.imgs, ik)"></div>
            </block>
          </div>
        </div>
      </div>
    </block>

    <div class="feedback">
      <div class="fee" @click="receive(info.id)">
        <i class="iconfont icon-chakanxq"></i>
        <div class="text">已收到( {{ info.receive }} )</div>
      </div>
      <div class="fee" @click="success(info.id)">
        <i class="iconfont icon-dianzan hig"></i>
        <div class="text">已完成( {{ info.success }} )</div>
      </div>
    </div>
    <div class="msglist">
      <div class="msgTitle">
        <span>全部回复</span>
      </div>
      <div class="msgs">
        <block v-for="(v, k) in msgs" :key="k">
          <div class="msg">
            <img :src="v.avatarUrl" alt="" class="avatar">
            <div class="msg_c">
              <div class="username">{{ v.nickName }}</div>
              <div class="date">{{ v.date }}</div>
              <text class="con" selectable>{{ v.content }}</text>
            </div>
            <div class="btn" @click="aite(v.nickName)">
              <i class="iconfont icon-huifu"></i>
              <span>回复</span>
            </div>
          </div>
        </block>
      </div>
    </div>
    <div class="huifuInput">
      <input type="text" class="input" v-model="sendText" cursor-spacing="20">
      <div class="send" @click="send(info.id)">发送</div>
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
      info: {
        id: "",
        title: "",
        content: "",
        create_time: "",
        imgs: [],
        receive: 0,
        success: 0
      },
      item: [],
      msgs: [],
      sendText: "",
      focus: false
    };
  },
  mounted() {
    let that = this;
    that.getDetail();
  },
  methods: {
    // 已收到
    receive($id) {
      let that = this;
      that.$http
        .post(
          Api.articleReceive,
          { id: $id },
          {
            headers: {
              Cookie: store.state.cookie
            }
          }
        )
        .then(response => {
          let res = response.data;

          if (res.code) {
            that.info.receive++;
            wxShowToast(res.msg);
          } else {
            wxShowToast(res.msg);
          }
        });
    },
    // 已收到
    success($id) {
      let that = this;
      that.$http
        .post(
          Api.articleSuccess,
          { id: $id },
          {
            headers: {
              Cookie: store.state.cookie
            }
          }
        )
        .then(response => {
          let res = response.data;

          if (res.code) {
            that.info.success++;
            wxShowToast(res.msg);
          } else {
            wxShowToast(res.msg);
          }
        });
    },
    // 发送回复
    send($id) {
      let that = this;
      let formData = {
        id: $id,
        content: this.sendText
      };
      wxShowLoading("发送回复中");
      this.$http
        .post(Api.articleReply, formData, {
          headers: {
            Cookie: store.state.cookie
          }
        })
        .then(response => {
          let res = response.data;

          if (res.code) {
            that.sendText = "";

            that.getDetail();
            wxShowToast(res.msg);
          } else {
            wxShowToast(res.msg);
          }
          console.log(res);
        });
    },
    // 艾特别人@
    aite(nickName) {
      this.sendText = `@${nickName} `;
      this.focus = true;
    },
    // 预览图片
    previewImage(imgs, index) {
      console.log(imgs);
      console.log(index);
      wx.previewImage({
        current: imgs[index], // 当前显示图片的http链接
        urls: imgs // 需要预览的图片http链接列表
      });
    },
    blur() {
      this.focus = true;
    },
    getDetail() {
      let that = this;
      wxShowLoading("加载中");
      that.$http
        .post(
          Api.articlesInfo,
          { id: that.$mp.query.id },
          {
            headers: {
              Cookie: store.state.cookie
            }
          }
        )
        .then(response => {
          let res = response.data;
          if (res.code) {
            let imgs = [];

            res.info.img &&
              res.info.img.forEach(v => {
                imgs.push(v.src);
              });
            that.info = {
              id: res.info.id,
              title: res.info.title,
              content: res.info.content,
              create_time: res.info.create_time,
              imgs: imgs,
              receive: res.info.receive,
              success: res.info.success
            };
            let item = [];
            res.result.forEach(v => {
              let imgs = [];

              v.img &&
                v.img.forEach(v => {
                  imgs.push(v.src);
                });
              item.push({
                id: v.id,
                cate: v.subject,
                date: v.create_time,
                imgs: imgs,
                content: v.content
              });
            });
            that.item = item;
            that.$http
              .post(
                Api.articleReplyList,
                { id: that.$mp.query.id },
                {
                  headers: {
                    Cookie: store.state.cookie
                  }
                }
              )
              .then(response => {
                let res = response.data;

                if (res.code) {
                  let msgs = [];
                  res.result.forEach(v => {
                    if (v.user) {
                      msgs.push({
                        id: v.user["id"],
                        nickName: v.identity,
                        avatarUrl: v.user["avatar"],
                        date: v.create_time,
                        content: v.content
                      });
                    }
                  });
                  that.msgs = msgs;
                  wxHideLoading();
                  wx.stopPullDownRefresh();
                } else {
                  wxShowToast(res.msg);
                }
              });
          }
          console.log(that.item);
        });
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.detail {
  width: 100%;
  .detailc {
    background: #fff;
    .detailTitle {
      display: flex;
      height: 126rpx;
      flex-direction: column;
      justify-content: center;
      padding: 0 40rpx;
      border-top: 2rpx solid #f7f7f7;
      border-bottom: 2rpx solid #f7f7f7;
      .title {
        font-size: 32rpx;
        display: flex;
        align-items: center;
      }
      .date {
        color: #808080;
        font-size: 24rpx;
      }
    }
    .content {
      color: #666;
      font-size: 30rpx;
      line-height: 40rpx;
      padding: 20rpx 40rpx;
    }
  }
  .item {
    background: #fff;
    .title {
      color: #666;
      font-size: 30rpx;
      height: 92rpx;
      display: flex;
      align-items: center;
      padding: 40rpx;
      border-top: 2rpx solid #f7f7f7;
      position: relative;
      &:after {
        content: "";
        display: block;
        width: 710rpx;
        height: 2rpx;
        right: 0;
        bottom: 0;
        background: #f7f7f7;
        position: absolute;
      }
      // border-bottom: 2rpx solid #f7f7f7;
    }
  }
  .item_c {
    padding: 30rpx 40rpx;
    .content {
      color: #666;
      font-size: 30rpx;
      line-height: 40rpx;
    }
    .imgs {
      margin-top: 20rpx;
      .img {
        width: 205rpx;
        height: 205rpx;
        display: inline-block;
        margin-right: 22rpx;
        border-radius: 8rpx;
        background-position: center;
        background-size: cover;
        &:nth-child(3n + 0) {
          margin-right: 0;
        }
      }
    }
  }
  .feedback {
    height: 87rpx;
    display: flex;
    position: relative;
    background: #fff;
    margin: 20rpx 0;
    &:after {
      content: "";
      width: 2rpx;
      height: 100%;
      display: block;
      background: #f7f7f7;
      position: absolute;
      left: 50%;
      top: 0;
    }
    .fee {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      .iconfont {
        margin-right: 10rpx;
        &.hig {
          color: #ffcc00;
        }
      }
    }
  }
  .msglist {
    padding-bottom: 160rpx;
    .msgTitle {
      height: 81rpx;
      line-height: 81rpx;
      border-bottom: 4rpx solid #f7f7f7;
      padding: 0 40rpx;
      font-size: 32rpx;
      background: #fff;
      span {
        height: 100%;
        display: inline-block;
        position: relative;
        &:after {
          content: "";
          width: 55rpx;
          height: 4rpx;
          background: #333;
          display: flex;
          position: absolute;
          bottom: 0;
          left: 30rpx;
        }
      }
    }
    .msg {
      padding: 25rpx;
      border-bottom: 2rpx solid #f7f7f7;
      display: flex;
      position: relative;
      background: #fff;
      .avatar {
        width: 58rpx;
        height: 58rpx;
        border: 2rpx solid #ccc;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        top: 10rpx;
      }
      .msg_c {
        flex: 1;
        padding-left: 25rpx;
        .username {
          color: #383939;
          font-size: 28rpx;
        }
        .date {
          font-size: 20rpx;
        }
        .con {
          color: #0b0b0b;
          font-size: 30rpx;
          line-height: 40rpx;
        }
      }
      .btn {
        position: absolute;
        right: 0rpx;
        top: 0rpx;
        padding: 25rpx;
        font-size: 24rpx;
        display: flex;
        color: #332c2b;
        .iconfont {
          font-size: 24rpx;
          margin-right: 10rpx;
        }
      }
    }
  }
  .huifuInput {
    width: 100%;
    height: 108rpx;
    display: flex;
    background: #fff;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    padding-left: 20rpx;
    box-shadow: 0 0 10rpx #aaa;
    .input {
      flex: 1;
      height: 53rpx;
      background: #ececed;
      border-radius: 8rpx;
      padding: 0 20rpx;
      font-size: 28rpx;
    }
    .send {
      padding: 0 40rpx;
      color: #2287d4;
      font-size: 28rpx;
    }
  }
}
</style>
