<template>
  <div class="detailList">
    <div class="back" @click="back">
      <i class="iconfont icon-back"></i>返回首页
    </div>
    <div class="head">
      <div class="img" v-if="detail.cover" :style="{backgroundImage: 'url('+ detail.cover +')'}"></div>
      <div class="info">
        <div class="classroom">{{ detail.name }}</div>
        <div class="address">{{ detail.school_name }}</div>
        <div class="name">
          <span>班主任: </span>
          <span>{{ detail.user.username }}</span>
        </div>
      </div>
      <div class="tool">
        <button class="link" open-type="share" v-if="bgroup === 1 || bgroup === 3">邀请</button>
        <a :href="'../cedit/main?bid=' + detail.id" class="link" v-if="bgroup === 1">设置</a>
      </div>
    </div>
    <block v-if="bgroup === 1">
      <div class="fabu">
        <a :href="'../zuoye/main?bid=' + detail.id">
          <i class="iconfont icon-fabu"></i>
          <span>发布作业</span>
        </a>
        <a :href="'../topzy/main?bid=' + detail.id">
          <i class="iconfont icon-fabu"></i>
          <span>发布置顶</span>
        </a>
      </div>
    </block>

    <div class="itemlist">
      <block v-for="(v, k) in itemt" :key="k">
        <div class="item">
          <div class="item_t">
            <div class="item_tl">
              <div class="title top">{{ v.title }}</div>
              <div class="date">{{ v.date }}</div>
            </div>
            <a :href="'../ctopzy/main?id=' + v.id" class="item_tr" v-if="bgroup === 1">
              <div class="link">编辑</div>
            </a>
          </div>
          <div class="item_c">
            <a :href="'../detail/main?id=' + v.id" class="content">{{ v.content }}</a>
            <div class="imgs" v-if="v.imgs.length">
              <block v-for="(img, ik) in v.imgs" :key="ik">
                <div class="img" :style="{backgroundImage: 'url('+ img +')'}" @click="previewImage(v.imgs, ik)"></div>
              </block>
            </div>
          </div>
          <div class="item_b">
            <div class="tab liulan">
              <i class="iconfont icon-liulan"></i>
              <div>{{ v.browse }}</div>
            </div>
            <!-- <div class="tab" @click="zan(v)">
              <i class="iconfont icon-dianzan hig"></i>
              <div>点赞</div>
            </div> -->
            <a :href="'../detail/main?id=' + v.id" class="tab">
              <i class="iconfont icon-huifu"></i>
              <div>回复</div>
            </a>
          </div>
        </div>
      </block>
      <block v-for="(v, k) in item" :key="k">
        <div class="item">
          <div class="item_t">
            <div class="item_tl">
              <div class="title">{{ v.title }}</div>
              <div class="date">{{ v.date }}</div>
            </div>
            <a :href="'../czuoye/main?id=' + v.id" class="item_tr" v-if="bgroup === 1 || bgroup === 2">
              <div class="link">编辑</div>
            </a>
          </div>
          <div class="item_c" :class="v.imgs.length ? '':'max'">
            <a :href="'../detail/main?id=' + v.id" class="content">{{ v.content }}</a>
            <!-- <div class="imgs" v-if="v.imgs.length">
              <block v-for="(img, ik) in v.imgs" :key="ik">
                <div class="img" :style="{backgroundImage: 'url('+ img +')'}" @click="previewImage(v.imgs, ik)"></div>
              </block>
            </div> -->
          </div>
          <div class="item_b">
            <div class="tab liulan">
              <i class="iconfont icon-liulan"></i>
              <div>{{ v.browse }}</div>
            </div>
            <!-- <div class="tab" @click="zan(v)">
              <i class="iconfont icon-dianzan hig"></i>
              <div>点赞</div>
            </div> -->
            <a :href="'../detail/main?id=' + v.id" class="tab">
              <i class="iconfont icon-huifu"></i>
              <div>回复</div>
            </a>
          </div>
        </div>
      </block>
      <div v-if="!item.length" class="notcontent">
        当前没有作业^_^空空如也~
      </div>
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
import { autoLogin } from "@/utils/autoLogin";

export default {
  data() {
    return {
      detail: {
        id: "",
        name: "",
        cover: "",
        create_time: "",
        school_name: "",
        user: {},
        area: ""
      },
      bind_name: "",
      item: [],
      itemt: [],
      isFx: false,
      group: 0,
      selfid: 0,
      bgroup: 0
    };
  },
  onLoad() {
    wxShowLoading("加载中");
  },
  onShow() {
    let that = this;

    // 分享链接过期
    if (Number(that.$mp.query.time) < new Date().getTime()) {
      console.log("分享链接过期");
      wx.reLaunch({ url: "../err/main" });
      return;
    }
    if(that.$mp.query.flag === 'fenxiang'){
      // TODO
    }
    this.isFx = this.$mp.query.flag ? true : false;
    this.group = store.state.userInfo.group;
    this.selfid = store.state.userInfo.id;

    autoLogin(this, store).then(res => {
      if (res.code) {
        let username = store.state.userInfo.username;
        if (username === '') {
          wx.navigateTo({
            url: "../reg/main?fenxiang=true&group=0"
          });
          return;
        }

        let formData = {
          id: that.$mp.query.bid
        };
        wxShowLoading("加载中");
        that.$http
          .post(Api.getClassRoom, formData, {
            headers: {
              Cookie: store.state.cookie
            }
          })
          .then(response => {
            let res = response.data;
            that.detail = res.result;

            if (res.code) {
              if (!res.relation) {
                // 你没有加入这个班级
                console.log("你没有加入这个班级");
                wxHideLoading();
                wx.showModal({
                  title: "提示",
                  content: "你没有加入这个班级, 是否加入",
                  success: function(res) {
                    if (res.confirm) {
                      // console.log("用户点击确定");
                      if (
                        that.$mp.query.bind_name !== undefined &&
                        that.$mp.query.bind_name !== ""
                      ) {
                        // 通过家长邀请
                        wx.navigateTo({
                          url:
                            "../reg4/main?bid=" +
                            that.detail.id +
                            "&bind_name=" +
                            that.$mp.query.bind_name
                        });
                        return;
                      }
                      wx.navigateTo({
                        url: "../choiceGroup2/main?bid=" + that.detail.id
                      });
                      return;
                    } else if (res.cancel) {
                      console.log("用户点击取消");
                      wx.reLaunch({ url: "../index/main" });
                      return;
                    }
                  }
                });
              } else {
                console.log("已经在这个班级咯");
                that.relationnnn = 1;
                // 请求作业
                that.getZyList();
              }
              if (res.relation) {
                that.bgroup = res.relation.group;
                that.bind_name = res.relation.bind_name;
              }
            } else {
              console.log(res.msg);
            }
          });
        wx.setNavigationBarTitle({
          title: "班级详情列表"
        });
      }
    });
  },

  methods: {
    zan(obj) {
      let that = this;

      if (!obj.zan) {
        that.$http
          .post(
            Api.articleStar,
            { id: obj.id },
            {
              headers: {
                Cookie: store.state.cookie
              }
            }
          )
          .then(response => {
            let res = response.data;
            if (res.code) {
              obj.zan = true;
              wxShowToast(res.msg);
            } else {
              wxShowToast(res.msg);
            }
          });
      } else {
        wxShowToast("您已点赞过");
      }
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
    },
    // 预览图片
    previewImage(imgs, index) {
      wx.previewImage({
        current: imgs[index], // 当前显示图片的http链接
        urls: imgs // 需要预览的图片http链接列表
      });
    },
    // 剪裁字符串 超过43个字符不要
    _contentCutting(arr) {
      arr.forEach((v, k, data) => {
        if (v.content.length > 43) {
          v.content = v.content.substr(0, 43);
        }
      });
    },
    back() {
      wx.reLaunch({ url: "../index/main" });
    },
    // 请求作业
    getZyList() {
      let that = this;

      that.item = [];
      that.itemt = [];
      wxShowLoading("加载中");
      that.$http
        .post(
          Api.getArticles,
          { id: that.$mp.query.bid },
          {
            headers: {
              Cookie: store.state.cookie
            }
          }
        )
        .then(response => {
          let res = response.data;
          let itemt = [];
          let item = [];
          let imgs = [];
          console.log(res.top);
          res.top.forEach(v => {
            imgs = [];

            v.img &&
              v.img.forEach(v => {
                imgs.push(v.src);
              });

            itemt.push({
              id: v.id,
              title: v.title,
              top: v.top,
              date: v.create_time,
              imgs: imgs,
              content: v.content,
              browse: v.pageview
            });
          });

          res.result.forEach(v => {
            imgs = [];

            v.img &&
              v.img.forEach(v => {
                imgs.push(v.src);
              });

            item.push({
              id: v.id,
              title: v.title,
              top: v.top,
              date: v.create_time,
              imgs: imgs,
              content: v.content,
              browse: v.pageview
            });
          });
          that.itemt = itemt;
          that.item = item;

          wxHideLoading();
          wx.stopPullDownRefresh();
        });
    }
  },
  // 分享
  onShareAppMessage(res) {
    let time = new Date().getTime() + 86400000 * 3;
    let path =
      "/pages/detailList/main?bid=" +
      this.detail.id +
      "&bind_name=" +
      this.bind_name +
      "&time=" +
      time;
    console.log(path);

    return {
      title: "邀请加入" + this.detail.name + "请点击",
      path: path,
      imageUrl: this.detail.cover
    };
  },
  // 下拉刷新
  onPullDownRefresh() {
    console.log("onPullDownRefresh");
    this.getZyList();
  }
};
</script>

<style lang="scss" scoped>
.detailList {
  width: 100%;
  .back {
    height: 70rpx;
    background: #fff;
    display: flex;
    font-size: 30rpx;
    align-items: center;
    border-top: 2rpx solid #f7f7f7;
    i {
      padding-left: 40rpx;
      padding-right: 20rpx;
      font-size: 32rpx;
    }
  }
  .head {
    height: 210rpx;
    background: #fff;
    border-top: 2rpx solid #f7f7f7;
    border-bottom: 2rpx solid #f7f7f7;
    padding: 40rpx;
    display: flex;
    .img {
      width: 120rpx;
      height: 120rpx;
      border-radius: 4rpx;
      background-position: center;
      background-size: cover;
    }
    .info {
      padding-left: 25rpx;
      color: #666;
      flex: 1;
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
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .link {
        width: 157rpx;
        height: 52rpx;
        color: #2287d4;
        line-height: 50rpx;
        text-align: center;
        font-size: 28rpx;
        border-radius: 50rpx;
        background: #fff;
        padding: 0;
        margin: 0;
        border: 2rpx solid #2287d4;
        &:nth-child(2) {
          margin-top: 20rpx;
        }
      }
    }
  }
  .fabu {
    display: flex;
    height: 105rpx;
    color: #2287d4;
    font-size: 28rpx;
    background: #fff;
    border-bottom: 2rpx solid #f7f7f7;
    a {
      flex: 1;
      justify-content: center;
      align-items: center;
      display: flex;
      position: relative;
      .iconfont {
        margin-right: 10rpx;
      }
      &:after {
        content: "";
        display: block;
        position: absolute;
        width: 2rpx;
        height: 100%;
        background: #f7f7f7;
        right: -1rpx;
      }
    }
  }
  .itemlist {
    // background: #fff;
    margin-top: 20rpx;
    .item {
      background: #fff;
      margin-bottom: 20rpx;
      .item_t {
        height: 126rpx;
        display: flex;
        padding: 0 40rpx;
        justify-content: space-between;
        align-items: center;
        .item_tl {
          display: flex;
          flex-direction: column;
          .title {
            font-size: 32rpx;
            display: flex;
            align-items: center;
            &.top:before {
              content: "置顶";
              font-size: 20rpx;
              height: 28rpx;
              line-height: 28rpx;
              text-align: center;
              padding: 0 20rpx;
              border-radius: 28rpx;
              color: #fff;
              margin-right: 10rpx;
              background: #2287d4;
            }
          }
          .date {
            color: #808080;
            font-size: 24rpx;
          }
        }
        .item_tr {
          height: 100%;
          display: flex;
          align-items: center;
          .link {
            height: 34rpx;
            font-size: 24rpx;
            padding: 0 20rpx;
            color: #2287d4;
            border: 2rpx solid #2287d4;
            line-height: 34rpx;
            border-radius: 36rpx;
          }
        }
      }
      .item_c {
        padding: 0 40rpx;
        padding-bottom: 10rpx;
        border-top: 2rpx solid #f7f7f7;
        border-bottom: 2rpx solid #f7f7f7;
        &.max{
          padding-bottom: 0;
          .content{
            padding: 30rpx 0;
          }
        }
        .content {
          color: #666;
          font-size: 30rpx;
          line-height: 40rpx;
          display: block;
          padding-top: 30rpx;
          padding-bottom: 20rpx;
          min-height:100rpx;
        }
        .imgs {
          position: relative;
          z-index: 1;
          .img {
            width: 127rpx;
            height: 127rpx;
            display: inline-block;
            margin-right: 10rpx;
            border-radius: 8rpx;
            background-position: center;
            background-size: cover;
            &:nth-child(5n + 0) {
              margin-right: 0;
            }
          }
        }
      }
      .item_b {
        height: 70rpx;
        display: flex;
        .tab {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 28rpx;
          position: relative;
          &:after{
            content: '';
            width: 2rpx;
            height: 100%;
            position: absolute;
            right: 0;
            top: 0;
            background: #f7f7f7;
            display: block;
          }
          &:last-child:after{
            display: none;
          }
          .iconfont {
            margin-right: 10rpx;
            &.hig {
              color: #ffcc00;
            }
          }
          &.liulan {
            color: #808080;
          }
        }
      }
    }
  }
}
</style>
