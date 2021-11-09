<template>
  <div id="adNotice">
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('tabs.publish')" name="first">
        <publish v-if="activeName === 'first'"></publish>
      </el-tab-pane>
      <el-tab-pane :label="$t('tabs.published')" name="second">
        <published v-if="activeName === 'second'"></published>
      </el-tab-pane>
      <el-tab-pane :label="$t('tabs.toBePublished')" name="third">
        <to-be-published v-if="activeName === 'third'"></to-be-published>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// 引入富文本的css
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Publish from '@/pages/admin/notice/publish'
import Published from '@/pages/admin/notice/published'
import ToBePublished from '@/pages/admin/notice/toBePublished'
// import { mapGetters } from 'vuex'
export default {
  components: {
    Publish,
    Published,
    ToBePublished
  },
  data() {
    return {
      activeName: 'first' // tab栏高亮
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="less">
#adNotice {
  .previewBox {
    * {
      max-width: 100%; // 所有的宽度不超过100%,主要是图片的
    }
  }
}
</style>
