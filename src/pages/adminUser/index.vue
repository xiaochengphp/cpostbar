<template>
  <div class="adminUser">
    <div class="weui-cells weui-cells_after-title">
      <block v-for="(v, k) in users" :key="k">
        <div class="weui-cell weui-cell_input" @click="deluser(v, k)">
          <div class="weui-cell__hd">
            <img :src="v.user.avatar" alt="" class="avatar">
            <div class="weui-label">{{ v.user.username }}</div>
          </div>
          <div class="weui-cell__bd">
            {{ v.identity }}
          </div>
        </div>
      </block>
    </div>
    <div class="gTip">
      <div class="title">说明</div>
      <div class="text">点击成员进行删除</div>
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
      users: []
    };
  },
  onLoad() {
    let that = this;
    let bid = this.$mp.query.bid;

    wxShowLoading("加载中");
    that.$http
      .post(
        Api.userlist,
        { id: bid },
        {
          headers: {
            Cookie: store.state.cookie
          }
        }
      )
      .then(response => {
        let res = response.data;

        wxHideLoading();
        that.users = res.result;
        console.log(res);
      });
  },
  methods: {
    deluser(user, key) {
      if (key === 0) {
        return;
      }
      let that = this;

      wx.showModal({
        title: "提示",
        content: "确定要踢出" + user.user.username + "吗",
        success: function(res) {
          if (res.confirm) {
            wxShowLoading("处理中");
            that.$http
              .post(
                Api.userlistDel,
                { id: user.id },
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
                  let users = that.users;
                  users.splice(key, 1);
                  that.users = users;
                  wxShowToast(res.msg);
                } else {
                  wxShowToast(res.msg);
                }
              });
          } else if (res.cancel) {
          }
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.adminUser {
  width: 100%;
  .weui-cell__hd {
    display: flex;
    align-items: center;
  }
  .avatar {
    width: 70rpx;
    height: 70rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }
  .weui-cell__bd {
    text-align: right;
  }
}
</style>
