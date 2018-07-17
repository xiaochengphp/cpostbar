<template>
  <div class="zuoye">
    <block v-for="(item, key) in formData" :key="key">
      <div class="zyeitem">
        <div class="title">
          <block v-if="key === 0">
            <input type="text" class="input" :value="item.title" v-model.lazy="item.title" placeholder="标题" :disabled="rootId != userId">
            <div class="rtext">帖子</div>
          </block>
          <block v-else>
            <div class="input">科目</div>
            <div class="rtext">{{ item.title }}</div>
          </block>
        </div>
        <div class="content">
          <textarea placeholder="输入相关的内容" v-model="item.content" maxlength="-1" :disabled="key === 0 && rootId != userId" />
        </div>
        <div class="addimg">
          <block v-for="(v, k) in item.imgs" :key="k">
            <div class="addImgHandel">
              <block v-if="v.imgSrc">
                <div class="img" :style="{backgroundImage: 'url('+ v.imgSrc +')'}" @click="delImg(item.imgs, k, key)"></div>
              </block>
              <block v-if="!v.imgSrc">
                <div class="addd" @click="addImg(v, key)">
                  <i class="iconfont icon-xiangji"></i>
                  <div class="text">添加图片</div>
                </div>
              </block>
            </div>
          </block>
        </div>
      </div>
    </block>
    <div class="additional">
      <div class="weui-cells weui-cells_after-title">
        <div class="weui-cell weui-cell_switch">
          <div class="weui-cell__bd">是否置顶</div>
          <div class="weui-cell__ft">
            <switch :checked="top" color="#2287D4" @change="topChange" :disabled="rootId != userId" />
          </div>
        </div>
        <div class="weui-cell weui-cell_input" v-if="top">
          <div class="weui-cell__hd">开始时间</div>
          <div class="weui-cell__bd">
            <picker mode="date" start="2018-01-01" end="2099-01-01" :value="startDate" @change="dateChange($event, 'startDate')" :disabled="rootId != userId">
              <div class="weui-input">{{ startDate }}</div>
            </picker>
          </div>
        </div>
        <div class="weui-cell weui-cell_input" v-if="top">
          <div class="weui-cell__hd">结束时间</div>
          <div class="weui-cell__bd">
            <picker mode="date" start="2018-01-01" :value="endDate" end="2099-01-01" @change="dateChange($event, 'endDate')" :disabled="rootId != userId">
              <div class="weui-input">{{ endDate }}</div>
            </picker>
          </div>
        </div>
      </div>
    </div>
    <div class="submit">
      <button @click="submit">更新作业</button>
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
      formData: [
        {
          title: "",
          content: "",
          imgs: [
            {
              imgSrc: ""
            }
          ]
        }
      ],
      top: 0,
      startDate: "",
      endDate: "",
      rootId: 0,
      userId: 0
    };
  },
  methods: {
    // 删除图片
    delImg(imgs, key, index) {
      let that = this;

      if (index === 0 && that.rootId !== that.userId) {
        return;
      }

      wx.showModal({
        title: "删除图片",
        content: "确定要删除改图片吗",
        success: function(res) {
          if (res.confirm) {
            // console.log("用户点击确定");
            wxShowLoading("删除图片");
            that.$http
              .post(
                Api.delImg,
                { id: imgs[key].id },
                {
                  headers: {
                    Cookie: store.state.cookie
                  }
                }
              )
              .then(response => {
                let res = response.data;
                wxHideLoading();
                if (res.code) {
                  imgs.splice(key, 1);
                  imgs = imgs.filter(v => {
                    return v.imgSrc !== "";
                  });
                  if (!imgs[4] && imgs.length <= 4) {
                    imgs.push({
                      imgSrc: ""
                    });
                  }
                  that.formData[index].imgs = imgs;
                } else {
                  wxShowToast("删除失败");
                }
              });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    // 添加图片
    addImg(obj, index) {
      let that = this;

      wx.chooseImage({
        count: 1,
        sizeType: ["original"],
        success(res) {
          console.log(res.tempFilePaths[0]);
          wxShowLoading("加载中");
          wx.uploadFile({
            url: Api.BaseUrl + Api.uploadImg,
            header: {
              Cookie: store.state.cookie
            },
            filePath: res.tempFilePaths[0],
            name: "file",
            success: function(res) {
              var data = JSON.parse(res.data);
              if (data.code) {
                wxHideLoading();
                obj.imgSrc = data.result.src;
                obj.id = data.result.id;
                if (that.formData[index].imgs.length < 5) {
                  that.formData[index].imgs.push({
                    imgSrc: ""
                  });
                }
                console.log(obj);
              } else {
                console.log(data.msg);
              }
              console.log(data);
            }
          });
        },
        fail(res) {
          console.log("打开相册失败");
        }
      });
    },
    // 顶置
    topChange(e, el) {
      this.top = e.mp.detail.value;
    },
    // 选择时间
    dateChange(e, attrbute) {
      console.log(e);
      this.$data[attrbute] = e.mp.detail.value;
      console.log(e);
    },
    submit() {
      let that = this;
      let formData = [];
      let img = [];
      this.formData.forEach((v, k, arr) => {
        if (k === 0 && that.rootId !== that.userId) {
          return;
        }
        img = [];
        v.imgs.forEach(v => {
          img.push(v.id);
        });
        formData.push({
          title: v.title,
          content: v.content ? v.content : " ",
          img: img.join(","),
          top: that.top ? 1 : 0,
          top_start: that.startDate,
          top_end: that.endDate
        });
      });
      let data = {
        id: that.$mp.query.id,
        result: JSON.stringify(formData)
      };
      that.$http
        .post(Api.articleEdit, data, {
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
            }, 1500);
          } else {
            wxShowToast(res.msg);
          }
          console.log(res);
        });
    }
  },
  onLoad() {
    let that = this;

    that.userId = store.state.userInfo.id;
    wxShowLoading("加载数据中");

    that.$http
      .get(
        Api.articleEdit,
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
          that.formData = [];
          let imgs = [];

          res.info.img &&
            res.info.img.forEach(v => {
              imgs.push({
                id: v.id,
                imgSrc: v.src
              });
            });
          if (imgs.length < 5) {
            imgs.push({
              imgSrc: ""
            });
          }
          that.formData.push({
            title: res.info.title,
            imgs: imgs,
            content: res.info.content
          });

          that.rootId = res.info.user_id;
          that.top = res.info.top ? true : false;
          that.startDate = res.info.top_start;
          that.endDate = res.info.top_end;

          res.result.forEach(v => {
            imgs = [];

            v.img &&
              v.img.forEach(v => {
                imgs.push({
                  imgSrc: v.src
                });
              });
            imgs.push({
              imgSrc: ""
            });
            that.formData.push({
              title: v.subject,
              imgs: imgs,
              content: v.content
            });
          });
          console.log(that.formData);
        } else {
          console.log(res.msg);
        }
        wxHideLoading();
      });
  },
  watch: {
    top(newVal) {
      if (!newVal) {
        this.startDate = "";
        this.endDate = "";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.zuoye {
  width: 100%;
  .zyeitem {
    background: #fff;
    margin-bottom: 20rpx;
    .title {
      display: flex;
      height: 92rpx;
      padding: 0 20rpx;
      border-top: 2rpx solid #f7f7f7;
      border-bottom: 2rpx solid #f7f7f7;
      justify-content: space-between;
      align-items: center;
      font-size: 28rpx;
      color: #808080;
      .input {
        flex: 1;
      }
    }
    .content {
      textarea {
        width: 100%;
        height: 200rpx;
        padding: 20rpx;
        font-size: 28rpx;
        box-sizing: border-box;
      }
    }
    .addimg {
      // font-size: 0;
      padding: 0 20rpx;
      .addImgHandel {
        width: 134rpx;
        height: 134rpx;
        text-align: center;
        display: inline-block;
        margin-right: 10rpx;
        overflow: hidden;
        vertical-align: middle;
        margin-bottom: 10rpx;
        .img {
          width: 100%;
          height: 100%;
          border-radius: 8rpx;
          background-position: center;
          background-size: cover;
        }
        .addd {
          width: 134rpx;
          height: 134rpx;
          overflow: hidden;
          border: 2rpx dashed #b2b2b2;
          border-radius: 8rpx;
        }
        .text {
          color: #b2b2b2;
          font-size: 24rpx;
          position: relative;
        }
        &:nth-child(5n + 0) {
          margin-right: 0rpx;
        }
      }

      .icon-xiangji {
        font-size: 50rpx;
      }
    }
  }
  .additional {
    .weui-cell__bd,
    .weui-cell__hd {
      color: #808080;
      font-size: 28rpx;
    }
    .weui-cell {
      height: 92rpx;
      line-height: 92rpx;
    }
  }
  .submit {
    margin: 90rpx 75rpx;
    button {
      color: #fff;
      height: 98rpx;
      line-height: 98rpx;
      font-size: 32rpx;
      background: #2287d4;
    }
  }
}
</style>
