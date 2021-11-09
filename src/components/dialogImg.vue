<template>
  <div id="dialogImg">
    <i class="el-icon-error" @click="closeDialog"></i>
    <img :src="imgUrl" />
  </div>
</template>

<script>
export default {
  props: ['imgUrl'],
  methods: {
    closeDialog() {
      this.$emit('closeDialog', false)
    }
  }
}
</script>

<style lang="less" scoped>
#dialogImg {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: scroll;
  padding: 20px;
  z-index: 9000;
  i {
    color: #fff;
    font-size: 32px;
    position: absolute;
    right: 20px;
    top: 20px;
  }
  img {
    display: block;
    width: auto;
    height: auto;
    margin: 3% auto;
  }
}
</style>
