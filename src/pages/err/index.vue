<template>
  <div class="err">
    分享链接已过期-_-
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
  data() {},
  onLoad(e) {}
};
</script>

<style lang="scss" scoped>
.err {
  width: 100%;
  color: #aaa;
  font-size: 40rpx;
  text-align: center;
  padding: 100rpx;
}
</style>

