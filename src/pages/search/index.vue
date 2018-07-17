<template>
  <div class="search">
    <view class="page__bd">
      <view class="weui-search-bar">
        <view class="weui-search-bar__form">
          <view class="weui-search-bar__box">
            <icon class="weui-icon-search_in-box" type="search" size="14"></icon>
            <input type="text" class="weui-search-bar__input" confirm-type="search" @confirm="submit($event)" placeholder="搜索" :value="inputVal" v-model="inputVal" :focus="inputShowed" />
            <view class="weui-icon-clear" v-if="inputVal.length > 0" @click="clearInput">
              <icon type="clear" size="14"></icon>
            </view>
          </view>
          <label class="weui-search-bar__label" :hidden="inputShowed" @click="showInput">
            <icon class="weui-icon-search" type="search" size="14"></icon>
            <view class="weui-search-bar__text">搜索</view>
          </label>
        </view>
        <view class="weui-search-bar__cancel-btn" :hidden="!inputShowed" @click="hideInput">取消</view>
      </view>
    </view>
    <block v-for="(v, k) in searchList" :key="k">
      <Card :v="v"></Card>
    </block>
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
import Card from "@/components/card";

export default {
  data() {
    return {
      inputVal: "",
      inputShowed: true,
      searchList: []
    };
  },
  onLoad() {
    this.searchList = [];
    this.inputVal = "";
  },
  methods: {
    clearInput() {
      this.inputVal = "";
    },
    showInput() {
      this.inputShowed = true;
    },
    hideInput() {
      (this.inputVal = ""), (this.inputShowed = false);
    },
    submit(e) {
      if (e.target.value === "") {
        return;
      }

      let that = this;
      wxShowLoading("搜索中");
      that.$http
        .post(
          Api.searchDclassroom,
          {
            keyword: that.inputVal
          },
          {
            headers: {
              Cookie: store.state.cookie
            }
          }
        )
        .then(response => {
          let res = response.data;
          let searchList = [];

          if (res.code) {
            searchList = res.result;
            searchList.forEach(v => {
              let area = v.area.split("-");
              v.address = area[0] + area[1] + v.school_name;
              console.log(v.user);
              v.bzr = v.user.username;
            });
            that.searchList = searchList;
            that.hideInput();
            wxHideLoading();
            wx.stopPullDownRefresh();
          }
        });
      console.log(e.target.value);
    }
  },
  components: {
    Card
  }
};
</script>

<style lang="scss" scoped>
.search {
  width: 100%;
}
</style>
