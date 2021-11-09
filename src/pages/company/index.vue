<template>
  <el-container id="index" class="homeIndex">
    <!-- 头部 -->
    <el-header class="flex-hb" style="height:56px">
      <div class="sysName">
        <img :src="language == 'cn' ? require('@/assets/images/logoLeftTop.png') : require('@/assets/images/dvoMark_1.png')" />
      </div>
      <div class="sysHead">
        <lang></lang>
        <i v-if="userType == 3" class="el-icon-message-solid"></i>
        <i v-if="userType == 3" class="el-icon-more" style="transform:rotate(90deg)"></i>
        <i v-if="userType == 3" class="el-icon-user-solid"></i>
        <top-menu-bar v-if="userType == 1" @reload="reload"></top-menu-bar>
        <log-out></log-out>
      </div>
    </el-header>
    <!-- class="flex1" 为了解决ie10 flex:1 的兼容问题 -->
    <el-container class="flex1">
      <!-- 侧边栏 -->
      <el-aside class="indexAside" width="auto">
        <el-menu :default-active="$route.path" :router="true" :collapse="isCollapse" :unique-opened="true" background-color="#222" text-color="#fff">
          <!-- 总览(固定写死) -->
          <el-menu-item v-if="userType == 1" index="/welcome">
            <i class="el-icon-monitor"></i>
            <span slot="title">{{ $t('home.nav00') }}</span>
          </el-menu-item>
          <el-menu-item v-if="userType == 3" index="/adOverView">
            <i class="el-icon-monitor"></i>
            <span slot="title">{{ $t('home.nav01') }}</span>
          </el-menu-item>
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
          <!-- 合同管理 -->
          <!-- <el-menu-item index="/emailServer" v-if="env === 'development'">
            <template slot="title">
              <i class="el-icon-school"></i>
              <span>邮箱服务器配置</span>
            </template>
          </el-menu-item> -->
          <!-- <el-menu-item index="/dingding" v-if="env === 'development'">
            <template slot="title">
              <i class="el-icon-school"></i>
              <span>钉钉管理</span>
            </template>
          </el-menu-item> -->
          <!-- <el-submenu index="work">
            <template slot="title">
              <i class="el-icon-school"></i>
              <span>工单管理</span>
            </template>
            <el-menu-item index="/comWorkOrder">我的工单</el-menu-item>
          </el-submenu> -->
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
            <router-view v-if="$route.meta.keepAlive && showRouter"></router-view>
          </keep-alive>
          <router-view v-if="(!$route.meta.keepAlive) && showRouter"></router-view>
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
import { mapGetters } from 'vuex'
import Lang from '@/components/langSelect'
import TopMenuBar from '@/components/topMenuBar'
import LogOut from '@/components/logOut'
export default {
  components: { Lang, TopMenuBar, LogOut },
  data() {
    return {
      dialogClose: false,
      isCollapse: false,
      dialogVisible: false,
      userName: '',
      leftMenuTree: [], // 左侧菜单
      userType: 0, // 1.企业用户 2.业务用户 3.dvo用户
      activeDate: new Date(),
      showRouter: true,
      env: process.env.NODE_ENV
    }
  },
  created() {
    // 全局监听键盘事件
    // document.onkeydown = function (e) {
    //   let key = window.event.keyCode
    //   // 不触发回车键
    //   if (key == 13) {
    //     return false
    //   }
    // }
    // this.$store.dispatch('busiGetOrgTree', { url: 'getOrgTree', orgType: 2 })
    // this.$store.dispatch('comGetMsgList', {
    //   onlySearch: 'unread',
    //   pageSize: 5
    // }).then(res => {
    //   console.log(res)
    // })
  },
  mounted() {
    let userInfo = JSON.parse(sessionStorage.getItem('user'))
    this.userName = userInfo.userName
    this.userType = userInfo.userType
    this.leftMenuTree = JSON.parse(sessionStorage.getItem('basicLeftTree'))
  },
  computed: {
    ...mapGetters(['language'])
  },
  methods: {
    // 控制菜单的显示和隐藏
    menuCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 路由切换,当前切当前
    reload(path, data) {
      // console.log('index_reload')
      this.showRouter = false
      this.$nextTick(function () {
        this.showRouter = true
      })
    },
    // 退出
    loginOut() {
      // this.$api.LogOut()
      this.$http.posts('logOut')
        .then(res => {
          // if (res.data.resCode == 0) {
          this.$router.push('/login')
          // }
        })
      // .catch(err => {
      //   console.log(err.response)
      // })
    }

  }
}
</script>

<style lang="less" scoped>
@import '../../assets/color.less';
@import '../../assets/css/homeIndex.less';
#index {
}
</style>
