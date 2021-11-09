<template>
  <div id="editor"></div>
</template>

<script>
import WangEditor from 'wangeditor'
export default {
  data() {
    return {
      isChange: false, // 解决光标乱跳,因为watch监听的时候文本内容被实时更新
      editor: ''
    }
  },
  mounted() {
    this.initEditor()
  },
  props: {
    // 默认显示的内容
    content: {
      type: String
    },
    // 配置编辑区域的 z-index
    zIndex: {
      type: Number,
      default: 1
    },
    // 是否显示上传图片
    uploadImgShowBase64: {
      type: Boolean,
      default: true
    },
    // 是否显示网络图片
    showLinkImg: {
      type: Boolean,
      default: false
    },
    // 粘贴时是否过滤图片
    pasteIgnoreImg: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    content(val) {
      if (!this.isChange) {
        this.editor.txt.html(val)
      }
      this.isChange = false
    }
  },
  methods: {
    // 初始化富文本
    initEditor() {
      this.editor = new WangEditor('#editor')
      this.editor.customConfig.zIndex = this.zIndex
      this.editor.customConfig.uploadImgShowBase64 = this.uploadImgShowBase64
      this.editor.customConfig.showLinkImg = this.showLinkImg
      this.editor.customConfig.pasteIgnoreImg = this.pasteIgnoreImg
      // 自定义菜单配置,默认配置如下
      this.editor.customConfig.menus = [
        'head',
        'bold',
        'fontSize',
        'italic',
        'underline',
        'strikeThrough',
        'foreColor',
        'backColor',
        'link',
        'list',
        'justify',
        'image',
        'undo'
      ]
      this.editor.customConfig.lang =
      {
        '设置标题': '',
        '字号': '',
        '字体': '',
        '文字颜色': '',
        '背景色': '',
        '链接': 'Link',
        '文字': ' Text',
        '设置列表': '',
        '有序列表': '',
        '无序列表': '',
        '对齐方式': '',
        '靠左': '',
        '居中': '',
        '靠右': '',
        '插入': 'Save'
      }
      let _this = this
      this.editor.customConfig.onchange = function (html) {
        _this.isChange = true
        _this.$emit('input', html)
      }
      this.editor.create()
    },
    // 清除富文本内容
    handleReset() {
      this.editor.txt.clear()
    }
  }
}
</script>

<style lang="less" scoped></style>
