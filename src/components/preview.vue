<template>
  <div id="preview">
    <iframe :src="url" width="100%" height="100%" frameborder="0"></iframe>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      url: ''
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  watch: {
    '$route': {
      handler: function (to, from) {
        this.url = to.params.url
      },
      immediate: true
    }
  },
  created() { },
  mounted() { },
  methods: {}
}
</script>

<style lang="less" scoped>
#preview {
  height: 100%;
  iframe,
  embed {
    width: 100%;
    height: 100%;
  }
}
</style>
