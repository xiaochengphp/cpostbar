<template>
  <div class="personal">
    <a href="#" class="head">
      <img :src="userInfo.user.avatar" alt="" class="avatar">
      <div class="info">
        <div class="nickname">
          <i class="iconfont" :class="userInfo.user.gender === 1?'icon-nan':'icon-nv'"></i>
          {{ userInfo.user.username }}
        </div>
        <div class="dec">
          <!-- <div class="banji">{{ userInfo.identity }}</div> -->
          <!-- <div class="groupName">{{ groupName }}</div> -->
        </div>
      </div>
      <!-- <div class="more">
        <img src="../../assets/img/rjiantou.png" alt="" class="moreIcon">
      </div> -->
    </a>
    <div class="rrow">
      <div href="#" class="item">
        <div class="value">{{ userInfo.room_num }}</div>
        <div class="key">班级</div>
      </div>
      <div href="#" class="item">
        <div class="value">{{ userInfo.reply_num }}</div>
        <div class="key">回复</div>
      </div>
    </div>

    <block v-for="(v, k) in userInfo.relation" :key="k">
      <div class="weui-cells weui-cells_after-title">
        <div class="weui-cell weui-cell_input">
          <div class="labelIcon">
            <i class="iconfont icon-zhiwei"></i>
          </div>
          <div class="weui-cell__hd">
            <div class="weui-label">职位</div>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" disabled :value="v.group === 1 ? '班主任':v.group === 2 ? '任课老师': v.group === 3 ? '家长':'学生'" />
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="labelIcon">
            <i class="labelIcon iconfont icon-xuexiao"></i>
          </div>
          <div class="weui-cell__hd">
            <div class="weui-label">学校名称</div>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" disabled :value="v.room.school_name" />
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="labelIcon">
            <i class="labelIcon iconfont icon-ruxue"></i>
          </div>
          <div class="weui-cell__hd">
            <div class="weui-label">入学年份</div>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" disabled :value="v.room.which" />
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="labelIcon">
            <i class="labelIcon iconfont icon-banji"></i>
          </div>
          <div class="weui-cell__hd">
            <div class="weui-label">年级班级</div>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" disabled :value="v.room.name" />
          </div>
        </div>
        <div class="weui-cell weui-cell_input" v-if="userInfo.user.group === 1 || userInfo.user.group === 2">
          <div class="labelIcon">
            <i class="labelIcon iconfont icon-kemu"></i>
          </div>
          <div class="weui-cell__hd">
            <div class="weui-label">科目</div>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" disabled :value="v.name" />
          </div>
        </div>
      </div>
    </block>

    <block v-for="(v, k) in userInfo.relation" :key="k">
      <div class="weui-cells weui-cells_after-title" v-if="userInfo.user.group !== 3 && v.bind_name !== ''">
        <div class="weui-cell weui-cell_input">
          <div class="labelIcon">
            <i class="labelIcon iconfont icon-xingming"></i>
          </div>
          <div class="weui-cell__hd">
            <div class="weui-label">孩子姓名</div>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" disabled :value="v.bind_name" />
          </div>
        </div>
        <div class="weui-cell weui-cell_input">
          <div class="labelIcon">
            <i class="labelIcon iconfont icon-guanxi"></i>
          </div>
          <div class="weui-cell__hd">
            <div class="weui-label">关系</div>
          </div>
          <div class="weui-cell__bd">
            <input class="weui-input" disabled :value="v.name" />
          </div>
        </div>
      </div>
    </block>

    <div class="weui-cells weui-cells_after-title">
      <div class="weui-cell weui-cell_input">
        <div class="labelIcon">
          <i class="labelIcon iconfont icon-xingming"></i>
        </div>
        <div class="weui-cell__hd">
          <div class="weui-label">姓名</div>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" disabled :value="userInfo.user.username" />
        </div>
      </div>
      <div class="weui-cell weui-cell_input">
        <div class="labelIcon">
          <i class="labelIcon iconfont icon-xingbie"></i>
        </div>
        <div class="weui-cell__hd">
          <div class="weui-label">性别</div>
        </div>
        <div class="weui-cell__bd">
          <input class="weui-input" disabled :value="userInfo.user.gender === 1 ? '男':'女' " />
        </div>
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

export default {
  data() {
    return {
      userInfo: {
        user: {
          avatar: ''
        }
      }
    };
  },
  onShow() {
    let that = this;

    that.getUser();
  },
  methods: {
    getUser() {
      let that = this;
      wxShowLoading("加载中");
      that.$http
        .post(
          Api.userIndex,
          {},
          {
            headers: {
              Cookie: store.state.cookie
            }
          }
        )
        .then(response => {
          let res = response.data;
          let userInfo = res;

          if (res.relation.length === 0) {
            wxShowToast("你没有加入班级");
            setTimeout(() => {
              wx.switchTab({ url: "../index/main" });
            }, 1500);
            return;
          }

          // userInfo.relation = userInfo.relation[userInfo.relation.length - 1];
          that.userInfo = userInfo;
          wxHideLoading();
          wx.stopPullDownRefresh();
        });
    }
  },
  computed: {
    // shenfen() {
    //   let group = store.state.userInfo.group;
    //   switch (group) {
    //     case 1:
    //       return "班主任";
    //       break;
    //     case 2:
    //       return "任课老师";
    //       break;
    //     case 3:
    //       return "家长";
    //       break;
    //     case 4:
    //       return "学生";
    //       break;
    //   }
    // }
  },
  onPullDownRefresh() {
    this.getUser();
  }
};
</script>

<style lang="scss" scoped>
.personal {
  width: 100%;
  .head {
    background: #fff;
    padding: 40rpx 30rpx;
    border-top: 2rpx solid #f7f7f7;
    border-bottom: 2rpx solid #f7f7f7;
    display: flex;
    .avatar {
      width: 138rpx;
      height: 138rpx;
      border-radius: 50%;
    }
    .info {
      flex: 1;
      padding-left: 30rpx;
      justify-content: center;
      display: flex;
      flex-direction: column;
      .nickname {
        margin-bottom: 10rpx;
        .icon-nan {
          color: #75b9eb;
          display: inline-block;
        }
        .icon-nv {
          color: pink;
          display: inline-block;
        }
      }
      .dec {
        display: flex;
        color: #808080;
        font-size: 28rpx;
      }
    }
    .more {
      width: 13rpx;
      display: flex;
      align-items: center;
      .moreIcon {
        width: 13rpx;
        height: 22rpx;
      }
    }
  }
  .rrow {
    height: 140rpx;
    display: flex;
    margin-bottom: 20rpx;
    background: #fff;
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-right: 2rpx solid #f7f7f7;
      &:last-child {
        border: none;
      }
      .value {
        font-size: 30rpx;
        color: 332c2b;
      }
      .key {
        font-size: 24rpx;
        color: #808080;
      }
    }
  }
}
.labelIcon {
  width: 42rpx;
  // height: 42rpx;
  // font-size: 42rpx;
  color: #1a1a1a;
  margin-right: 14rpx;
  font-size: 36rpx;
  text-align: center;
}
</style>
