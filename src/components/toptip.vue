<template>
    <div class="toptip" :class="isShow ? 'show':''" :duration="duration">
        {{ content }}
    </div>
</template>

<script>
export default {
  props: {
    isShow: {
      default: false
    },
    content: {
      default: "顶部提示"
    },
    duration: {
      default: 1500
    }
  },
  watch: {
    isShow(newVal) {
      if (newVal) {
        this.show();
      }
    }
  },
  methods: {
    show() {
      let that = this;
      this._timer && clearTimeout(this._timer);
      this.isShow = true;

      if (this.duration > 0 && this.duration !== Infinity) {
        this._timer = setTimeout(() => {
          that.hide();
        }, this.duration);
      }
    },
    hide() {
      this._timer && clearTimeout(this._timer);
      this.isShow = false;
      this.$emit("tipHide", this.isShow);
    }
  }
};
</script>

<style lang="scss" scoped>
.toptip {
  display: block;
  position: fixed;
  transform: translateZ(0) translateY(-100%);
  width: 100%;
  min-height: 32px;
  top: 0;
  line-height: 2.3;
  font-size: 14px;
  text-align: center;
  color: #fff;
  background-color: #e64340;
  z-index: 110;
  opacity: 0;
  transition: all 0.4s ease;
  &.show {
    transform: translateZ(0) translateY(0);
    opacity: 1;
  }
}
</style>
