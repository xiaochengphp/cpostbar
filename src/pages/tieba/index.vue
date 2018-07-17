<template>
  <div class="tieba">
    <block v-if="group === 1 ||  group === 2">
      <div class="tab">
        <div class="tab-item" :class="currentSelIndex === 0  ? 'active' : ''" @click="currentSelIndex=0">我创建的班级</div>
        <div class="tab-item" :class="currentSelIndex === 1  ? 'active' : ''" @click="currentSelIndex=1">我任课的班级</div>
        <div class="tab-item" :class="currentSelIndex === 2  ? 'active' : ''" @click="currentSelIndex=2">我所在的班级</div>
      </div>
      <div class="lists" :class="currentSelIndex === 0  ? 'show' : ''">
        <block v-for="(v, k) in createList" :key="k">
          <Card :v="v"></Card>
        </block>
      </div>
      <div class="lists" :class="currentSelIndex === 1  ? 'show' : ''">
        <block v-for="(v, k) in banjiList[0]" :key="k">
          <Card :v="v"></Card>
        </block>
      </div>
      <div class="lists" :class="currentSelIndex === 2  ? 'show' : ''">
        <block v-for="(v, k) in banjiList[1]" :key="k">
          <Card :v="v"></Card>
        </block>
      </div>
    </block>
    <block v-if="group === 3 ||  group === 4">
      <block v-for="(v, k) in banjiList2" :key="k">
        <Card :v="v"></Card>
      </block>
    </block>
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

export default {
  data() {
    return {
      createList: [],
      banjiList: [{}, {}],
      banjiList2: [],
      currentSelIndex: 0,
      group: 0
    };
  },
  onShow() {
    let that = this;
    let group = store.state.userInfo.group;
    this.group = group;
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
        if (this.group === 1 || this.group === 0) {
          // 我创建的班级
          that.createList = res.myCreate;
          that.createList.forEach((v, k, arr) => {
            let area = v.area.split("-");
            v.address = area[0] + area[1] + v.school_name;
            v.bzr = v.user.username;
          });
          // 我任课的班级
          that.banjiList[0] = res.myTeach;
          that.banjiList[0].forEach((v, k, arr) => {
            let area = v.area.split("-");
            v.address = area[0] + area[1] + v.school_name;
            v.bzr = v.user.username;
          });
          console.log(that.banjiList);
          // 我所在的班级
          that.banjiList[1] = res.myWhere;
          that.banjiList[1].forEach((v, k, arr) => {
            let area = v.area.split("-");
            v.address = area[0] + area[1] + v.school_name;
            v.bzr = v.user.username;
          });
          console.log(that.banjiList[1]);
        }
        if (this.group === 3 || this.group === 4) {
          that.banjiList2 = res.myWhere;
          that.banjiList2.forEach((v, k, arr) => {
            let area = v.area.split("-");
            v.address = area[0] + area[1] + v.school_name;
            v.bzr = v.user.username;
          });
        }
      });
  },
  watch: {
    currentSelIndex(newVal) {
      this.currentSelIndex = newVal;
    }
  },
  components: {
    Card
  }
};
</script>

<style lang="scss" scoped>
.tieba {
  width: 100%;
  .tab {
    display: flex;
    height: 94rpx;
    background: #fff;
    .tab-item {
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
  .lists {
    background: #fff;
    display: none;
  }
  .show {
    display: block;
  }
}
</style>
