<template>
  <el-container id="userIndex" class="homeIndex">
    <!-- 头部 -->
    <el-header class="flex-hb" style="height:56px">
      <div class="sysName">
        <img :src="language == 'cn' ? require('@/assets/images/logoLeftTop.png') : require('@/assets/images/dvoMark_1.png')" />
        <i class="el-icon-arrow-down" @mouseover="hoverArrow(1)" @mouseout="hoverArrow(0)"></i>
        <busi-module ref="modules" :modulePage="2"></busi-module>
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
      <!-- 侧边栏 -->
      <el-aside class="indexAside" width="auto">
        <el-menu :default-active="$route.path" :router="true" :collapse="isCollapse" :unique-opened="true" background-color="#222" text-color="#fff">
          <template v-for="(item, index) in leftMenuTree">
            <el-submenu v-if="item.children.length" :key="index" :index="item.label">
              <template slot="title">
                <i :class="item.iconUrl"></i>
                <span>{{ $t(item.labelEn) }}</span>
              </template>
              <el-menu-item v-for="(ele, idx) in item.children" :key="index + '-' + idx" :index="ele.menuUrl">{{ $t(ele.labelEn) }}</el-menu-item>
            </el-submenu>
            <el-menu-item v-else :key="index" :index="item.menuUrl">
              <i :class="item.iconUrl"></i>
              <span slot="title">{{ $t(item.labelEn) }}</span>
            </el-menu-item>
          </template>
        </el-menu>
        <p class="ver" :style="isCollapse ? 'padding-left: 3px' : 'padding-left: 20px'">{{ $t('ver') }} Ver {{ $api.versionNumber }}</p>
        <div class="collapseBar" @click="menuCollapse">
          <i :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"></i>
        </div>
      </el-aside>
      <el-container class="flex1">
        <!-- 路由出口 -->
        <el-main id="main" class="flex1">
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </el-main>
        <!-- 回顶部按钮 -->
        <el-backtop target="#main" :visibility-height="50" style="bottom:20px"></el-backtop>
        <!-- 底部公司信息 -->
        <!-- <el-footer style="height:40px">
          <div class="company">
            {{ $t('home.company') }}
            <a href="http://beian.miit.gov.cn/" target="_blank">{{ $t('home.ICPNo') }}</a>
          </div>
        </el-footer> -->
      </el-container>
    </el-container>
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
      isCollapse: false, // 菜单的显示和隐藏
      leftMenuTree: [] // 左侧菜单-基础平台
    }
  },
  computed: { ...mapGetters(['language']) },
  created() {
    this.leftMenuTree = JSON.parse(sessionStorage.getItem('basicLeftTree'))
  },
  mounted() { },
  methods: {
    hoverArrow(isShow) {
      this.$refs.modules.showArrow = isShow
    },
    // 控制菜单的显示和隐藏
    menuCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/color.less';
@import '../../assets/css/homeIndex.less';
#userIndex {
}
</style>
