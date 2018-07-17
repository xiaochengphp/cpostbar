<template>
  <div class="zuoye">
    <block v-for="(item, key) in formData" :key="key">
      <div class="zyeitem">
        <div class="title">
          <block v-if="key === 0">
            <input type="text" class="input" :value="item.title" v-model.lazy="item.title" placeholder="标题">
            <div class="rtext">帖子</div>
          </block>
          <block v-else>
            <div class="input">科目</div>
            <div class="rtext">{{ item.title }}</div>
          </block>
        </div>
        <div class="content">
          <textarea placeholder="输入相关的内容" v-model="item.content" maxlength="-1" />
        </div>
        <div class="addimg">
          <block v-for="(v, k) in item.imgs" :key="k">
            <div class="addImgHandel" @click="addImg(v, key)">
              <block v-if="v.imgSrc">
                <div class="img" :style="{backgroundImage: 'url('+ v.imgSrc +')'}" @click="delImg(item.imgs, k, key)"></div>
              </block>
              <block v-if="!v.imgSrc">
                <div class="addd">
                  <i class="iconfont icon-xiangji"></i>
                  <div class="text">添加图片</div>
                </div>
              </block>
            </div>
          </block>
        </div>
      </div>
    </block>
    <div class="submit">
      <button @click="submit">立即发布</button>
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
      top: 1,
      startDate: "",
      endDate: ""
    };
  },
  methods: {
    // 删除图片
    delImg(imgs, key, index) {
      let that = this;

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
          wxShowLoading("添加图片中");
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
                console.log(obj);
              } else {
                console.log(data.msg);
              }
              console.log(data);
            }
          });

          if (that.formData[index].imgs.length < 5) {
            that.formData[index].imgs.push({
              imgSrc: ""
            });
          }
        },
        fail(res) {
          console.log("打开相册失败");
        }
      });
    },
    submit() {
      let that = this;
      let formData = [];
      let img = [];
      this.formData.forEach((v, k, arr) => {
        console.log(v);
        img = [];
        v.imgs.forEach(v => {
          img.push(v.id);
        });
        formData.push({
          title: v.title,
          content: v.content ? v.content : " ",
          img: img.join(",")
        });
      });
      let data = {
        id: that.$mp.query.bid,
        result: JSON.stringify(formData)
      };
      that.$http
        .post(Api.addArticle, data, {
          headers: {
            Cookie: store.state.cookie
          }
        })
        .then(response => {
          let res = response.data;
          if (res.code) {
            wxShowToast(res.msg);
            setTimeout(() => {
              Object.assign(that.$data, that.$options.data());
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

    that.$http
      .get(
        Api.getSubject,
        { id: that.$mp.query.bid },
        {
          headers: {
            Cookie: store.state.cookie
          }
        }
      )
      .then(response => {
        let res = response.data;
        let formData = [];

        if (res.code) {
          formData.push({
            title: '',
            imgs: [{ imgSrc: "" }]
          });
          res.result.forEach(v => {
            formData.push({
              title: v,
              imgs: [{ imgSrc: "" }]
            });
          });
          that.formData = formData;
        } else {
          console.log(res.msg);
        }
      });
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
