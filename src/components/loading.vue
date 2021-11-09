<template>
  <div id="loading">
    <p>{{ $t('message.loading') }}</p>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
@import '../assets/color';
#loading {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #fff;
  overflow-y: scroll;
  p {
    font-size: 80px;
    color: @main;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
