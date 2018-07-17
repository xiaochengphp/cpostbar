<template>
  <div class="index">
    <div class="titleSearch">
      <div class="title">我创建的班级</div>
      <div class="tool">
        <a href="../search/main">
          <img src="../../assets/img/search.png" alt="" class="searchIcon">
        </a>
        <a href="../create/main">
          <img src="../../assets/img/add2.png" alt="" class="addIcon">
        </a>
      </div>
    </div>

    <div class="createList">
      <block v-for="(v, k) in createList" :key="k">
        <a :href="'../detailList/main?bid=' + v.id " class="item">
          <div class="img" :style="{ backgroundImage: 'url(' + v.cover + ')' }"></div>
          <div class="classroom">{{ v.name }}</div>
          <div class="address">{{ v.address }}</div>
        </a>
      </block>
    </div>
    <div class="banjiList">
      <div class="selTitle">
        <div :class="currentSelIndex  ? '' : 'active'" @click="currentSelIndex=0">我任课的班级</div>
        <div :class="currentSelIndex  ? 'active' : ''" @click="currentSelIndex=1">我所在班级</div>
      </div>
      <swiper @animationfinish="animationfinish" :style="{height: swiperH}" :current="currentSelIndex">
        <swiper-item>
          <block v-if="banjiList[0]">
            <block v-for="(v, k) in banjiList[0]" :key="k">
              <Card :v="v"></Card>
            </block>
          </block>
          <block>
            <div class="notTip">你没有任课的班级</div>
          </block>
        </swiper-item>
        <swiper-item>
          <block v-if="banjiList[1]">
            <block v-for="(v, k) in banjiList[1]" :key="k">
              <Card :v="v"></Card>
            </block>
          </block>
          <block>
            <div class="notTip">你没有所在的班级</div>
          </block>
        </swiper-item>
      </swiper>
    </div>

    <!-- <block v-if="group === 3 ||  group === 4">
      <block v-for="(v, k) in banjiList2" :key="k">
        <Card :v="v"></Card>
      </block>
    </block> -->
  </div>
</template>

<script>
import Card from "@/components/card";
import {
  wxShowToast,
  wxHideToast,
  wxShowLoading,
  wxHideLoading
} from "@/utils/wx";
import Api from "@/utils/api";
import store from "@/store";
import { autoLogin } from "@/utils/autoLogin";

export default {
  data() {
    return {
      createList: [],
      banjiList: [{}, {}],
      banjiList2: [],
      swiperH: "220rpx",
      currentSelIndex: 0,
      group: -1
    };
  },
  onShow() {
    let that = this;

    autoLogin(this, store).then(res => {
      if (res.code) {
        let group = store.state.userInfo.group;
        switch (group) {
          case 0:
            wx.navigateTo({
              url: "../choiceGroup/main"
            });
            return;
            break;
          default:
            this.group = group;
            break;
        }
        this.getBjList();
      } else {
        console.log(res.msg);
      }
    });
  },
  onLoad() {
    wxShowLoading("加载中");
  },
  
  watch: {
    currentSelIndex(newVal) {
      this.currentSelIndex = newVal;
      this.swiperH = this.banjiList[newVal].length
        ? this.banjiList[newVal].length * 110 * 2 + "rpx"
        : "220rpx";
    }
  },
  methods: {
    // 滑动动画结束
    animationfinish(e) {
      // console.log(e)
      this.currentSelIndex = e.mp.detail.current;
      this.swiperH = this.banjiList[e.mp.detail.current].length
        ? this.banjiList[e.mp.detail.current].length * 110 * 2 + "rpx"
        : "220rpx";
    },
    getBjList() {
      let that = this;
      wxShowLoading("加载中");
      that.$http
        .post(
          Api.my,
          {},
          {
            headers: {
              Cookie: store.state.cookie
            }
          }
        )
        .then(response => {
          let res = response.data;
          // myCreate 我创建的班级 myTeach 我任课的班级 myWhere 我所在的班级
          // console.log(response);

          // 我创建的班级
          let myCreate = res.myCreate;
          myCreate.forEach((v, k, arr) => {
            let area = v.area.split("-");
            v.address = area[0] + area[1] + v.school_name;
          });
          that.createList = myCreate;
          // 我任课的班级
          let myTeach = res.myTeach;
          myTeach.forEach((v, k, arr) => {
            let area = v.area.split("-");
            v.address = area[0] + area[1] + v.school_name;
            v.bzr = v.user.username;
          });
          that.banjiList[0] = myTeach;

          // 我所在的班级
          let myWhere = res.myWhere;
          myWhere.forEach((v, k, arr) => {
            let area = v.area.split("-");
            v.address = area[0] + area[1] + v.school_name;
            v.bzr = v.user.username;
          });
          that.banjiList[1] = myWhere;

          this.swiperH = this.banjiList[0].length
            ? this.banjiList[0].length * 110 * 2 + "rpx"
            : "220rpx";
          wxHideLoading();
          wx.stopPullDownRefresh();
        });
    }
  },
  components: {
    Card
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.getBjList();
  }
};
</script>

<style lang="scss" scoped>
.index {
  width: 100%;
  .titleSearch {
    display: flex;
    height: 94rpx;
    justify-content: space-between;
    align-items: center;
    border-top: 2rpx solid #efeef4;
    margin-bottom: 2rpx;
    background: #fff;
    .title {
      padding: 0 30rpx;
    }
    .tool {
      display: flex;
      a {
        padding: 0 40rpx;
        position: relative;
        overflow: inherit;
        display: flex;
        justify-content: center;
        align-items: center;
        &:before {
          content: "";
          display: block;
          position: absolute;
          width: 2rpx;
          height: 47rpx;
          // left: -40rpx;
          left: 0;
          top: 0;
          background: #e8e8e8;
        }
      }
      .searchIcon {
        width: 45rpx;
        height: 45rpx;
      }
      .addIcon {
        width: 37rpx;
        height: 37rpx;
        &:before {
          top: -4rpx;
        }
      }
    }
  }
  .createList {
    width: 100%;
    background: #fff;
    padding-left: 27rpx;
    box-sizing: border-box;
    padding-top: 26rpx;
    .item {
      width: 217rpx;
      margin-right: 23rpx;
      display: inline-block;
      .img {
        width: 217rpx;
        height: 210rpx;
        border-radius: 8rpx;
        border: 1px solid #efeef4;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }
      .classroom {
        font-size: 28rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .address {
        font-size: 20rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .banjiList {
    margin-top: 20rpx;
    background: #fff;
    .selTitle {
      height: 94rpx;
      display: flex;
      div {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 2rpx solid #f7f7f7;
        &.active {
          color: #2287d4;
          border-bottom-color: #2287d4;
        }
      }
    }
    swiper {
      .item {
        padding: 30rpx;
        display: flex;
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
  }
  .notTip {
    font-size: 32rpx;
    padding: 20rpx;
    text-align: center;
  }
}
</style>
