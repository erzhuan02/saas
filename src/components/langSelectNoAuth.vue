<template>
  <el-dropdown trigger="hover" @command="handleSetLanguage">
    <!-- <div class="pointer">
      <div class="lang" v-if="language === 'cn'">{{ $t('chinese') }}</div>
      <div class="lang" v-if="language === 'en'">English</div>
    </div> -->
    <div class="pointer">
      <div class="lang" v-if="language === 'cn'">简体中文</div>
      <div class="lang" v-if="language === 'en'">English</div>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language === 'cn'" command="cn">简体中文</el-dropdown-item>
      <el-dropdown-item :disabled="language === 'en'" command="en">English</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  computed: {
    language() {
      // console.log(this.$store.getters.language)
      return this.$store.getters.language
    }
  },
  methods: {
    handleSetLanguage(lang) {
      this.$store.commit('LANGUAGE', lang)
      this.$utils.$message({
        message: this.$t('home.switchSuccess'),
        type: 'success',
        duration: 600
      })
      // 解决win8的ie下会点击成功，强制加disabled
      // let data = document.querySelectorAll('.el-dropdown-menu__item.is-disabled')
      // let notData = document.querySelectorAll('.el-dropdown-menu__item')
      // for (var i = 0; i < notData.length; i++) {
      //   var e = notData[i]
      //   if (e.className === 'el-dropdown-menu__item is-disabled') {
      //     e.setAttribute('disabled', true)
      //   } else {
      //     e.setAttribute('disabled', false)
      //   }
      // }
    }
  }
}
</script>

<style lang="less" scoped>
div.lang {
  font-size: 16px;
  color: #fff;
  margin-right: 5px;
}
.el-dropdown-menu {
  top: 30px !important;
}
</style>
