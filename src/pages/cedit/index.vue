<template>
  <div class="create">
    <Toptip :content="toptip.content" :isShow="toptip.show" @tipHide="tipHide"></Toptip>
    <div class="addImg">
      <div class="addImgHandel" @click="addImg">
        <block v-if="cover">
          <div class="img" :style="{backgroundImage: 'url('+ cover +')'}"></div>
        </block>
        <block v-if="!cover">
          <div class="addd">
            <i class="iconfont icon-xiangji"></i>
            <div class="text">添加班级图片</div>
          </div>
        </block>
      </div>
    </div>
    <div class="weui-cells weui-cells_after-title">
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">学校名称</div>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" v-model.lazy="school_name" />
        </div>
      </div>
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">年级班级</div>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" v-model.lazy="name" />
        </div>
      </div>
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">入学年份</div>
        </div>
        <div class="weui-cell__bd">
          <picker mode="date" fields="year" :value="which" start="1960" end="2099" @change="dateChange">
            <div class="weui-input">{{ which }}</div>
          </picker>
        </div>
      </div>
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">选择区域</div>
        </div>
        <div class="weui-cell__bd">
          <picker mode="region" :value="area" @change="regionChange">
            <div class="weui-input">{{ areaV }}</div>
          </picker>
        </div>
      </div>
    </div>
    <div class="weui-cells weui-cells_after-title" @click="addLs">
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">任课老师</div>
        </div>
        <div class="weui-cell__bd">
          <div class="weui-input">
            <img src="../../assets/img/add.png" alt="" class="addIcon">
          </div>
        </div>
      </div>
    </div>
    <div class="lslist">
      <div class="row" v-if="lsData.length">
        <div class="cel">
          <input type="text" value="科目" disabled>
        </div>
        <div class="cel">
          <input type="text" value="老师姓名" disabled>
        </div>
      </div>
      <block v-for="(v, k) in lsData" :key="k">
        <div class="row animation" :class="v.animate">
          <div class="cel">
            <input type="text" :value="v.subjects" v-model.lazy="v.subjects">
          </div>
          <div class="cel">
            <input type="text" :value="v.name" v-model.lazy="v.name">
          </div>
          <div class="sub">
            <img src="../../assets/img/sub.png" alt="" class="subIcon" @click="subLsRow(k)">
          </div>
        </div>
      </block>
    </div>
    <div class="weui-cells weui-cells_after-title" @click="addXs">
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">学生</div>
        </div>
        <div class="weui-cell__bd">
          <div class="weui-input">
            <img src="../../assets/img/add.png" alt="" class="addIcon">
          </div>
        </div>
      </div>
    </div>
    <div class="xslist">
      <block v-for="(v, k) in xsData" :key="k">
        <div class="cel">
          <input type="text" :value="v.name" v-model.lazy="v.name">
          <div class="sub">
            <img src="../../assets/img/sub.png" alt="" class="subIcon" @click="subXsRow(k)">
          </div>
        </div>
      </block>
    </div>
    <div class="weui-cells weui-cells_after-title" style="clear: both;">
      <div class="weui-cell weui-cell_switch">
        <div class="weui-cell__bd">自动发布作业</div>
        <div class="weui-cell__ft">
          <switch :checked="auto_article" color="#2287D4" @change="auto_articleChange" />
        </div>
      </div>
    </div>
    <div class="weui-cells weui-cells_after-title" @click="adminUser">
      <div class="weui-cell weui-cell_input">
        <div class="weui-cell__hd">
          <div class="weui-label">管理所有人员</div>
        </div>
        <div class="weui-cell__bd">
          <div class="weui-input">
            <img src="../../assets/img/rjiantou.png" alt="" class="more">
          </div>
        </div>
      </div>
    </div>
    <div class="gTip">
      <div class="title">说明</div>
      <div class="text">
        <div>创建完成后可以邀请学生和家长加入。</div>
        <div>点击班级图像可以修改班级的图像。</div>
      </div>
    </div>
    <div class="submit">
      <button @click="submit">保存修改</button>
    </div>
  </div>
</template>

<script>
import Api from "@/utils/api";
import store from "@/store";
import Toptip from "@/components/toptip";
import {
  wxShowToast,
  wxHideToast,
  wxShowLoading,
  wxHideLoading
} from "@/utils/wx";

export default {
  data() {
    return {
      which: "",
      area: "",
      areaV: "",
      lsData: [],
      xsData: [],
      cover: "",
      oldcover: "",
      name: "",
      school_name: "",
      toptip: {
        content: "",
        show: false
      },
      subjects: [],
      auto_article: 0
    };
  },
  onLoad() {
    let that = this;
    let bid = this.$mp.query.bid;

    new Promise((resolve, reject) => {
      wxShowLoading("加载中");
      that.$http
        .post(
          Api.getClassRoom,
          { id: bid },
          {
            headers: {
              Cookie: store.state.cookie
            }
          }
        )
        .then(response => {
          let res = response.data;
          that.cover = res.result.cover;
          that.oldcover = res.result.cover;
          that.which = res.result.which;
          that.name = res.result.name;
          that.school_name = res.result.school_name;
          that.area = res.result.area.split("-");
          that.areaV = res.result.area;
          that.auto_article = res.result.auto_article;
          // that.lsData = res.result.teacher_list;
          // that.xsData = res.result.student_list;
          // console.log(res.result.teacher_list);
          that.lsData = [];
          that.xsData = [];
          Object.keys(res.result.teacher_list).forEach((v, k, arr) => {
            that.lsData.push({
              subjects: v,
              name: res.result.teacher_list[v]
            });
          });
          res.result.student_list.forEach((v, k, arr) => {
            console.log(v);
            that.xsData.push({
              name: v
            });
          });
          if (res.code) {
            resolve({
              code: 1
            });
          }
          console.log(response);
        });
    }).then(res => {
      that.$http
        .post(
          Api.subject,
          {},
          {
            headers: {
              Cookie: store.state.cookie
            }
          }
        )
        .then(response => {
          wxHideLoading();
          if (response.data.code) {
            that.subjects = response.data.result;
          } else {
            wxShowToast(response.data.msg);
            console.log("获取科目列表失败");
          }
        });
    });
  },
  methods: {
    // 添加班级图片
    addImg() {
      let that = this;

      wx.chooseImage({
        count: 1,
        sizeType: "compressed",
        success(res) {
          // var tempFilePaths = res.tempFilePaths;
          wxShowLoading("加载图片中");
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
                wxShowToast("上传图片成功");
                that.cover = data.result.src;
                that.coverId = data.result.id;
              } else {
                wxShowToast("上传图片失败");
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
    // 管理所有人员
    adminUser() {
      wx.navigateTo({
        url: "../adminUser/main?bid=" + this.$mp.query.bid
      });
    },
    // 自动发布作业
    auto_articleChange(e, el) {
      this.auto_article = e.mp.detail.value;
    },
    // 添加科目
    subjectsChange(e, v) {
      console.log(e);
      v.subjects = this.subjects[e.mp.detail.value];
    },
    // 入学年份
    dateChange(e) {
      this.which = e.mp.detail.value;
    },
    // 选择区域
    regionChange(e) {
      this.area = e.mp.detail.value;
      this.areaV = e.mp.detail.value.join("-");
    },
    // 添加老师
    addLs() {
      this.lsData.push({
        subjects: "",
        name: "",
        animate: "slide-in-right"
      });
      setTimeout(() => {
        this.lsData[this.lsData.length - 1].animate = "";
      }, 1300);
    },
    // 删除老师
    subLsRow(e) {
      // console.log(e)
      this.lsData[e].animate = "slide-out-left";
      setTimeout(() => {
        this.lsData.splice(e, 1);
      }, 300);
    },
    // 添加学生
    addXs() {
      this.xsData.push({
        name: ""
      });
    },
    // 删除学生
    subXsRow(e) {
      this.xsData.splice(e, 1);
    },
    checkFormData() {
      // if (this.cover === "") {
      //   return "请上传班级图片";
      // }
      if (this.school_name === "") {
        return "学校名称不能为空";
      }
      if (this.name === "") {
        return "年级班级不能为空";
      }
      if (this.name === "") {
        return "请选择入学年份";
      }
      if (this.name === "") {
        return "请选择区域";
      }
      return false;
    },
    // 提交表单
    submit() {
      let that = this;
      let msg = this.checkFormData();

      if (msg) {
        this.toptip.content = msg;
        this.toptip.show = true;
        return;
      }

      // 老师名单
      let teacher_list = [];

      this.lsData.forEach((v, k, arr) => {
        if (v.name !== "" && v.subjects !== "") {
          teacher_list.push({
            name: v.name,
            subjects: v.subjects
          });
        }
      });

      // 学生名单
      let student_list = [];
      this.xsData.forEach((v, k, arr) => {
        if (v.name !== "") {
          student_list.push(v.name);
        }
      });

      let formData = {
        id: that.$mp.query.bid,
        cover: this.coverId,
        name: this.name,
        school_name: this.school_name,
        which: this.which,
        area: this.areaV,
        auto_article: this.auto_article,
        teacher_list: JSON.stringify(teacher_list),
        student_list: JSON.stringify(student_list)
      };
      wxShowLoading("保存修改中");
      that.$http
        .post(Api.eaitClass_room, formData, {
          headers: {
            Cookie: store.state.cookie
          }
        })
        .then(response => {
          let data = response.data;
          let bid = data.result.id;
          wxShowToast(data.msg, "", () => {});
          setTimeout(() => {
            Object.assign(that.$data, that.$options.data());
            wx.navigateBack();
            return;
          }, 1500);
        });
    },
    // 隐藏错误信息
    tipHide(val) {
      this.toptip.show = val;
    }
  },
  components: {
    Toptip
  }
};
</script>

<style lang="scss" scoped>
.create {
  width: 100%;
  .addImg {
    text-align: center;
    padding: 20rpx;
    display: flex;
    justify-content: center;
    color: #b2b2b2;
    .addImgHandel {
      width: 200rpx;
      height: 200rpx;
      overflow: hidden;
      .img {
        width: 100%;
        height: 100%;
        border-radius: 8rpx;
        background-position: center;
        background-size: cover;
        border: 1px dashed #aaa;
      }
      .addd {
        width: 200rpx;
        height: 200rpx;
        overflow: hidden;
        border: 4rpx dashed #b2b2b2;
        border-radius: 8rpx;
      }
      .text {
        font-size: 28rpx;
        position: relative;
        top: -30rpx;
      }
    }
    .icon-xiangji {
      font-size: 100rpx;
    }
  }
  .lslist {
    position: relative;
    .row {
      display: flex;
      .cel {
        width: 310rpx;
        height: 75rpx;
        border-radius: 8rpx;
        background: #fff;
        margin-left: 20rpx;
        margin-bottom: 16rpx;
        input {
          width: 100%;
          height: 75rpx;
          color: #808080;
          padding: 0 40rpx;
        }
        .ppicker {
          height: 75rpx;
        }
      }
      .sub {
        width: 75rpx;
        height: 75rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .subIcon {
          width: 30rpx;
          height: 30rpx;
        }
      }
    }
  }
  .xslist {
    padding: 0 23rpx;
    .cel {
      width: 220rpx;
      height: 75rpx;
      border-radius: 8rpx;
      background: #fff;
      display: flex;
      float: left;
      margin-right: 23rpx;
      margin-bottom: 23rpx;
      &:nth-child(3n) {
        margin-right: 0;
      }
      input {
        width: 100%;
        height: 100%;
        color: #808080;
        padding-left: 40rpx;
      }
      .sub {
        width: 75rpx;
        height: 75rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .subIcon {
          width: 30rpx;
          height: 30rpx;
        }
      }
    }
  }
  .submit {
    margin: 23rpx 75rpx;
    button {
      color: #fff;
      background: #2287d4;
    }
  }
  .more {
    width: 20rpx;
    height: 30rpx;
    vertical-align: middle;
  }
}
</style>
