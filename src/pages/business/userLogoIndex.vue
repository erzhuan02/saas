<template>
  <el-container id="logoIndex" class="homeIndex">
    <!-- 头部 -->
    <el-header class="flex-hb" style="height:56px">
      <div class="sysName">
        <img :src="language == 'cn' ? require('@/assets/images/logoLeftTop.png') : require('@/assets/images/dvoMark_1.png')" />
      </div>
      <div class="sysHead">
        <lang></lang>
        <i class="el-icon-message-solid"></i>
        <!-- <i class="el-icon-more" style="transform:rotate(90deg)"></i> -->
        <busi-info></busi-info>
        <i class="el-icon-user-solid"></i>
        <log-out></log-out>
      </div>
    </el-header>
    <!-- class="flex1" 为了解决ie10 flex:1 的兼容问题 -->
    <el-container class="flex1">
      <el-main id="main" class="flex1 hvc">
        <!-- 模块logo部分 -->
        <busi-module :modulePage="1"></busi-module>
      </el-main>
      <!-- 回顶部按钮 -->
      <el-backtop target="#main" :visibility-height="50" style="bottom:20px"></el-backtop>
      <!-- 底部公司信息 -->
      <!-- <el-footer style="height:40px" class="company">
        <div class="company">
          {{ $t('home.company') }}
          <a href="http://beian.miit.gov.cn/" target="_blank">{{ $t('home.ICPNo') }}</a>
        </div>
      </el-footer>-->
    </el-container>
    <!-- 行业配置 -->
    <el-dialog :close-on-click-modal="false" :show-close="false" :title="$t('home.nav104_1')" :visible.sync="dialogVisibleConfig">
      <el-form label-width="auto">
        <el-form-item :label="$t('industry.selectIndustry')" prop="industry">
          <el-select v-model="industry" :placeholder="$t('placeholder.select')" clearable>
            <el-option v-for="item in options" :key="item.id" :label="item.categoryName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="flex">
        <p>{{ $t('industry.industryDesc') }}：</p>
        <el-tooltip effect="light" placement="bottom">
          <div slot="content">
            <div v-if="options.length !== 0">
              <div v-for="item in options" :key="item.id">
                <p>{{ item.categoryName }}: </p>
                <span>
                  {{ $t('industry.include') }}{{ item.busName || '*' }}{{ $t('industry.etc') }}
                </span>
                <br>
                <br>
              </div>
            </div>
            <div v-else>{{ $t('common.noData') }}</div>
          </div>
          <p class="pointer check">{{ $t('basicInfo.check') }}</p>
        </el-tooltip>
      </div>
      <span slot="footer">
        <el-button @click="operConfig('cancel')">{{ $t('button.configLater') }}</el-button>
        <el-button type="primary" @click="operConfig('confirm')">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import Lang from '@/components/langSelect'
import BusiInfo from '@/components/busiInfo'
import LogOut from '@/components/logOut'
import BusiModule from '@/components/busiModule'
import { setTimeout } from 'timers'
import { mapGetters } from 'vuex'
export default {
  components: { Lang, BusiInfo, LogOut, BusiModule },
  data() {
    return {
      dialogVisibleConfig: false,
      options: [],
      industry: ''
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      setTimeout(() => {
        let basicLeftTree = JSON.parse(sessionStorage.getItem('basicLeftTree')) || []
        let leftMenuTreeFlat = basicLeftTree && this.$utils.flatObjArr(basicLeftTree)
        let isAuth = leftMenuTreeFlat.filter(item => item.labelEn === 'home.nav104_1')
        this.$http.posts('companyCategoryList').then(res => {
          this.options = res.data
          let isCheck = this.options.filter(item => item.isCheck)
          if (isCheck.length === 0) { // 没有配置过
            if (isAuth.length === 0) { // 无行业配置权限
              this.$utils.$message({
                type: 'info',
                message: this.$t('industry.contactAdmin')
              })
              return
            }
            this.dialogVisibleConfig = true
          }
        })
      }, 500)
    },
    operConfig(type) {
      if (type === 'cancel') {
        this.$utils.$message({
          type: 'info',
          message: this.$t('message.setLater')
        })
        this.dialogVisibleConfig = false
      } else {
        if (this.industry === '') {
          this.$utils.$message({
            type: 'error',
            message: this.$t('industry.selectIndustry')
          })
          return
        }
        this.$http.posts('updateCategoryConfig', '', { id: this.industry }, true)
          .then(res => {
            this.dialogVisibleConfig = false
          })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/color.less';
@import '../../assets/css/homeIndex.less';
#logoIndex {
  .el-main {
    height: 98%;
  }
  .check {
    color: @text3;
  }
}
</style>
