<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import Lang from './components/langSelect'
export default {
  name: 'App',
  created() {
    // 禁掉ctrl+滚轮
    document.addEventListener('DOMMouseScroll', function (event) {
      if (event.ctrlKey === true || event.metaKey) {
        event.preventDefault()
      }
    }, { passive: false })
    document.addEventListener('mousewheel', function (event) {
      if (event.ctrlKey === true || event.metaKey) {
        event.preventDefault()
      }
    }, { passive: false })
    // 禁掉Ctrl + （+/-）
    document.addEventListener('keydown', function (event) {
      if ((event.ctrlKey === true || event.metaKey === true) &&
        (event.which === 61 || event.which === 107 ||
          event.which === 173 || event.which === 109 ||
          event.which === 187 || event.which === 189)) {
        event.preventDefault()
      }
    }, { passive: false })
  },
  mounted() {
    var resizeFunc = () => {
      var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      if (width < 768) {
        this.$store.commit('CLIENT_TYPE', 'mob')
      } else {
        this.$store.commit('CLIENT_TYPE', 'pc')
      }
    }
    resizeFunc()
    window.addEventListener('resize', resizeFunc)
  },
  components: { Lang }
}
</script>

<style lang="less">
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  /* text-align: center; */
  /* color: #2c3e50; */
  height: 100%;
  /* margin-top: 60px; */
}
</style>
