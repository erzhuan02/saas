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
  created() {
    this.changeLang(this.language, false)
  },
  methods: {
    handleSetLanguage(lang) {
      this.$store.commit('LANGUAGE', lang)
      this.changeLang(lang, true)
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
    },
    changeLang(lang, isSuccessMsg) {
      let langType = lang === 'cn' ? 1 : 2
      this.$http.posts('changeLang', '', { langType }, isSuccessMsg)
        .then(res => { })
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
