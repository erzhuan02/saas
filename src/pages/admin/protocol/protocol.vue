<template>
  <div id="protocol">
    <el-tabs v-model="tabActive" :before-leave="beforeLeaveTab">
      <el-tab-pane :label="$t('versionRelease.publish')" name="publish">
        <publish v-if="tabActive === 'publish'" ref="$publish"></publish>
      </el-tab-pane>
      <el-tab-pane :label="$t('versionRelease.published')" name="published">
        <published v-if="tabActive === 'published'"></published>
      </el-tab-pane>
      <!-- 提示语 -->
      <el-dialog class="modeDia" :title="$t('dialog.tips')" :visible.sync="tipshow" :close-on-click-modal="false">
        <span>{{ $t('dialog.protocolLeave') }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="tipClose">{{ $t('button.cancel') }}</el-button>
          <el-button type="primary" @click="tipBack">{{ $t('button.confirm') }}</el-button>
        </span>
      </el-dialog>
    </el-tabs>
  </div>
</template>

<script>
import Publish from './publish'
import Published from './published'
import '../../../../static/js/jquery'
export default {
  data() {
    return {
      type: '', // tab or router
      tabActive: 'publish',
      tipshow: false,
      toPath: '',
      backStatus: false,
      activeTxt: ''
    }
  },
  beforeRouteLeave(to, from, next) {
    this.toPath = to.path
    this.type = 'router'
    if (this.tabActive === 'publish') {
      let content = this.$refs.$publish.flowQuery.proContent
      if (content == null || content == '' || content == '<p><br></p>') {
        next()
      } else {
        if (this.backStatus) {
          next()
        } else {
          next(false)
        }
        this.tipshow = true
      }
    } else {
      next()
    }
  },
  methods: {
    // 以下两个方法中注释部分解决菜单在阻止跳转后高亮错误
    // 取消
    tipClose() {
      this.tipshow = !this.tipshow
      // 让菜单高亮不变(维持在发布管理)
      let menuItem = $('.el-menu-item')
      for (let i of menuItem) {
        if (i.classList.contains('is-active')) {
          i.classList.remove('is-active')
        }
        if (i.innerText == '发布管理' || i.innerText == 'Release MGT') {
          i.classList.add('is-active')
        }
      }
    },
    // 确定跳转
    tipBack() {
      this.backStatus = true
      if (this.type === 'router') {
        // 通过菜单树找到要跳转的菜单名
        let name
        let data = JSON.parse(sessionStorage.getItem('basicLeftTree'))
        data.forEach((ele, idx) => {
          if (this.toPath === ele.menuUrl) {
            name = ele.label
          } else {
            ele.children.forEach(e => {
              if (this.toPath === e.menuUrl) {
                name = e.label
              }
            })
          }
        })
        // 将其高亮
        let menuItem = $('.el-menu-item')
        for (let i of menuItem) {
          if (i.innerText == '发布管理' || i.innerText == 'Release MGT') {
            i.classList.remove('is-active')
          }
          if (i.innerText == name) {
            i.classList.add('is-active')
          }
        }
        this.$router.push(this.toPath)
      } else {
        this.tabActive = 'published'
      }
      this.tipshow = false
    },
    beforeLeaveTab() {
      this.type = 'tab'
      if (this.tabActive === 'publish') {
        let content = this.$refs.$publish.flowQuery.proContent
        if (content == null || content == '' || content == '<p><br></p>') {
          return true
        } else {
          if (this.backStatus) {
            return true
          } else {
            this.tipshow = true
            return false
          }
        }
      }
    }
  },
  components: {
    Publish,
    Published
  }
}
</script>

<style lang="less" scoped>
#protocol {
}
</style>
