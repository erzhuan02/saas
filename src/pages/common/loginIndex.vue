<template>
  <div id="loginIndex" v-loading="loading">
    <!-- 顶部 -->
    <regis-header v-show="!isheaders" @isshow="parentFn" :isshow="isshow"></regis-header>
    <mob-header v-show="isheaders && clientType==='mob'" :title="headersText"></mob-header>
    <!-- 上侧导航 -->
    <ul class="navTop">
      <li v-for="(item, index) in NavList" :class="item.istrue ? 'curDrop' : ''" :key="index">
        <div v-if="item.children.length == 0" @click="toPage(item.url, index)">
          <img v-if="!item.istrue" :src="item.img" />
          <img v-if="item.istrue" :src="item.img1" />
          <span>{{ $t(item.name) }}</span>
        </div>
        <div v-else>
          <el-dropdown @command="handleCommand">
            <span>
              <img v-if="!item.istrue" :src="item.img" />
              <img v-if="item.istrue" :src="item.img1" />
              <span :class="item.istrue ? 'curDrop' : ''">{{ $t(item.name) }}</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(v, i) in item.children" :class="v.istrue ? 'curDrop' : ''" :command="v.url" :key="i">
                <span :class="v.istrue ? 'curDrop' : ''">{{ $t(v.name) }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </li>
    </ul>
    <el-drawer class="mobMenu" :visible.sync="isshow" :direction="direction" :before-close="closeNav">
      <div slot="title">
        <img :src="language == 'cn' ? require('../../assets/images/moblogo.png') : require('../../assets/images/moblogo_1.png')" alt />
      </div>
      <div id="mobNav">
        <el-menu default-active="2" @open="handleOpen" :unique-opened="true" active-text-color="#303133">
          <div v-for="(item, index) in mobNavList" :key="index + '1'">
            <template v-if="(item.children || []).length == 0">
              <el-menu-item :index="index + '1'" @click="totoPages(item.url, item.name)">
                <img :src="item.img" />
                <span slot="title">{{ $t(item.name) }}</span>
              </el-menu-item>
            </template>
            <el-submenu :index="index + '1'" v-if="(item.children || []).length > 0">
              <template slot="title">
                <img :src="item.img" />
                <span>{{ $t(item.name) }}</span>
              </template>
              <template v-if="(item.children || []).length > 0">
                <el-menu-item-group v-for="(items, indexs) in item.children" :key="indexs">
                  <el-menu-item @click="totoPages(items.url, items.name)">{{ $t(items.name) }}</el-menu-item>
                </el-menu-item-group>
              </template>
            </el-submenu>
          </div>
        </el-menu>
      </div>
    </el-drawer>
    <!-- 内容 -->
    <div class="bg">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
      <!-- 底部 -->
      <login-footer v-show="showFooter"></login-footer>
      <!-- 回顶部按钮 -->
      <el-backtop target=".bg" :visibility-height="50" style="bottom:40px"></el-backtop>
    </div>
  </div>
</template>

<script>
import RegisHeader from '@/components/regisHeader'
import LoginFooter from '@/components/loginFooter'
import MobHeader from '@/components/mobHeader'
import loginBg from '@/assets/images/login/loginBg.png'
import { mapGetters } from 'vuex'
import '../../../static/js/jquery'
export default {
  components: { RegisHeader, LoginFooter, MobHeader },
  data() {
    return {
      drawer: false,
      direction: 'ltr', // 手机导航从左网右
      NavList: [
        {
          name: 'login.index',
          istrue: false,
          img: require('../../assets/images/navTop/Home.png'),
          img1: require('../../assets/images/navTop/Home_selection.png'),
          url: '/login',
          children: []
        },
        {
          name: 'login.product',
          istrue: false,
          img: require('../../assets/images/navTop/product.png'),
          img1: require('../../assets/images/navTop/product_selection.png'),
          url: '',
          children: [
            {
              name: 'Goods.DG201.Goods_1',
              istrue: false,
              url: '/goods/dg201'
            },
            // {
            //   name: 'Goods.NVR.Goods_1',
            //   istrue: false,
            //   url: '/goods/nvr'
            // },
            {
              name: 'Goods.Overlying.Goods_1',
              istrue: false,
              url: '/goods/overlying'
            },
            // {
            //   name: 'Goods.360.Goods_1',
            //   istrue: false,
            //   url: '/goods/360'
            // },
            // {
            //   name: 'Goods.Infrared.Goods_1',
            //   istrue: false,
            //   url: '/goods/infrared'
            // },
            // {
            //   name: 'Goods.HighDefinition.Goods_1',
            //   istrue: false,
            //   url: '/goods/highDefinition'
            // },
            {
              name: 'Goods.Camera.Goods_1',
              istrue: false,
              url: '/goods/camera'
            }
          ]
        },
        {
          name: 'login.solution',
          istrue: false,
          img: require('../../assets/images/navTop/plan.png'),
          img1: require('../../assets/images/navTop/plan_selection.png'),
          url: '',
          children: [
            {
              name: 'setting.wisdomCashier',
              istrue: false,
              url: '/solution/1'
            },
            {
              name: 'setting.smartShop',
              istrue: false,
              url: '/solution/2'
            },
            {
              name: 'setting.supervision',
              istrue: false,
              url: '/solution/3'
            },
            {
              name: 'setting.selfCheck',
              istrue: false,
              url: '/solution/4'
            }
            // {
            //   name: 'setting.visual',
            //   istrue: false,
            //   url: '/solution/5'
            // },
            // {
            //   name: 'setting.srsFace',
            //   istrue: false,
            //   url: '/solution/6'
            // },
            // {
            //   name: 'setting.smartColdChain',
            //   istrue: false,
            //   url: '/solution/7'
            // }
          ]
        },
        {
          name: 'login.successfulCase',
          istrue: false,
          img: require('../../assets/images/navTop/Case.png'),
          img1: require('../../assets/images/navTop/Case_selection.png'),
          url: '/successfulCase',
          children: []
        },
        {
          name: 'login.download',
          istrue: false,
          img: require('../../assets/images/navTop/download.png'),
          img1: require('../../assets/images/navTop/download_selection.png'),
          url: '/download',
          children: []
        },
        {
          name: 'login.openPlatform',
          istrue: false,
          img: require('../../assets/images/navTop/platform.png'),
          img1: require('../../assets/images/navTop/platform_selection.png'),
          url: '/openPlatformUrl',
          children: []
        }
      ],
      mobNavList: [
        {
          name: 'login.index',
          istrue: false,
          img: require('../../assets/images/navTop/Home.png'),
          img1: require('../../assets/images/navTop/Home_selection.png'),
          url: '/login',
          children: []
        },
        {
          name: 'login.product',
          istrue: false,
          img: require('../../assets/images/navTop/product.png'),
          img1: require('../../assets/images/navTop/product_selection.png'),
          url: '',
          children: [
            {
              name: 'Goods.DG201.Goods_1',
              istrue: false,
              url: '/goods/dg201'
            },
            // {
            //   name: 'Goods.NVR.Goods_1',
            //   istrue: false,
            //   url: '/goods/nvr'
            // },
            {
              name: 'Goods.Overlying.Goods_1',
              istrue: false,
              url: '/goods/overlying'
            },
            // {
            //   name: 'Goods.360.Goods_1',
            //   istrue: false,
            //   url: '/goods/360'
            // },
            // {
            //   name: 'Goods.Infrared.Goods_1',
            //   istrue: false,
            //   url: '/goods/infrared'
            // },
            // {
            //   name: 'Goods.HighDefinition.Goods_1',
            //   istrue: false,
            //   url: '/goods/highDefinition'
            // },
            {
              name: 'Goods.Camera.Goods_1',
              istrue: false,
              url: '/goods/camera'
            }
          ]
        },
        {
          name: 'login.solution',
          istrue: false,
          img: require('../../assets/images/navTop/plan.png'),
          img1: require('../../assets/images/navTop/plan_selection.png'),
          url: '',
          children: [
            {
              name: 'setting.wisdomCashier',
              istrue: false,
              url: '/solution/1'
            },
            {
              name: 'setting.smartShop',
              istrue: false,
              url: '/solution/2'
            },
            {
              name: 'setting.supervision',
              istrue: false,
              url: '/solution/3'
            },
            {
              name: 'setting.selfCheck',
              istrue: false,
              url: '/solution/4'
            }
            // {
            //   name: 'setting.visual',
            //   istrue: false,
            //   url: '/solution/5'
            // },
            // {
            //   name: 'setting.srsFace',
            //   istrue: false,
            //   url: '/solution/6'
            // },
            // {
            //   name: 'setting.smartColdChain',
            //   istrue: false,
            //   url: '/solution/7'
            // }
          ]
        },
        {
          name: 'login.successfulCase',
          istrue: false,
          img: require('../../assets/images/navTop/Case.png'),
          img1: require('../../assets/images/navTop/Case_selection.png'),
          url: '/successfulCase',
          children: []
        },
        {
          name: 'login.download',
          istrue: false,
          img: require('../../assets/images/navTop/download.png'),
          img1: require('../../assets/images/navTop/download_selection.png'),
          url: '/download',
          children: []
        },
        {
          name: 'login.openPlatform',
          istrue: false,
          img: require('../../assets/images/navTop/platform.png'),
          img1: require('../../assets/images/navTop/platform_selection.png'),
          url: '/openPlatformUrl',
          children: []
        },
        {
          name: 'loginFooter.service',
          istrue: false,
          img: require('../../assets/images/mob/fuwu.png'),
          img1: require('../../assets/images/navTop/download_selection.png'),
          url: '',
          children: [
            {
              name: 'loginFooter.serviceProcess',
              istrue: false,
              url: '/serviceProcess'
            },
            {
              name: 'loginFooter.experience',
              istrue: false,
              url: '/applyExperience'
            }
          ]
        },
        {
          name: 'loginFooter.aboutUs',
          istrue: false,
          img: require('../../assets/images/mob/guanyv.png'),
          img1: require('../../assets/images/navTop/download_selection.png'),
          url: '',
          children: [
            {
              name: 'loginFooter.companyInfo',
              istrue: false,
              url: '/aboutUs'
            },
            {
              name: 'loginFooter.jobRec',
              istrue: false,
              url: '/recruit'
            },
            {
              name: 'loginFooter.afterSale',
              istrue: false,
              url: '/afterSale'
            },
            {
              name: 'loginFooter.channelPartner',
              istrue: false,
              url: '/channelPartner'
            }
          ]
        }
      ],
      showFooter: true,
      loading: true,
      routePath: '',
      isshow: false,
      isheaders: false,
      headersText: ''
    }
  },
  computed: {
    ...mapGetters(['loginBoxStatus', 'headerText', 'language', 'clientType'])
  },
  watch: {
    $route(to, from) {
      // $(".bg").scrollTop(0);
      this.routeCur()
      // 注册、重新注册、忘记密码页不显示底部
      if (
        to.path === '/regis' ||
        to.path === '/regisForm' ||
        to.path === '/regisLicense' ||
        to.path === '/regisSuccess' ||
        to.path === '/regisAgain' ||
        to.path === '/mobOnlineMsg' ||
        to.path === '/forgotPsd' ||
        to.path.startsWith('/genernalAgreement')
      ) {
        this.showFooter = false
      } else {
        this.showFooter = true
      }
      this.toheaderText(to.path)
    },
    routePath(val) {
      let _this = this
      if (
        val === '/regis' ||
        val === '/regisForm' ||
        val === '/regisLicense' ||
        val === '/regisSuccess' ||
        val === '/regisAgain' ||
        val === '/forgotPsd' ||
        val === '/mobOnlineMsg' ||
        val.startsWith('/genernalAgreement')
      ) {
        _this.showFooter = false
      } else {
        _this.showFooter = true
      }
      this.toheaderText(val)
    }
  },
  created() {
    this.routeCur()
    this.routePath = this.$route.path
  },
  mounted() {
    let _this = this
    var bgImg = new Image()
    bgImg.src = loginBg
    bgImg.onload = function () {
      if (bgImg.width == 0) {
        _this.loading = true
      } else {
        _this.loading = false
      }
    }
    this.showheaders()
  },
  methods: {
    showheaders() {
      var resizeFunc = () => {
        let routePath = this.$route.path
        if (this.clientType === 'mob') {
          if (routePath === '/login') {
            this.isheaders = false
          } else {
            this.isheaders = true
          }
        } else {
          this.isshow = false
          this.isheaders = false
        }
      }
      // 用addEventListener注册，不会出现覆盖问题
      window.addEventListener('resize', resizeFunc)
      resizeFunc()
    },
    toheaderText(val) {
      if (this.clientType === 'mob') {
        if (val === '/login') {
          this.isheaders = false
        } else {
          this.isheaders = true
        }
        this.mobNavList.forEach((item, index) => {
          if (item.url == val) {
            this.headersText = item.name
          } else {
            item.children.forEach((v, i) => {
              if (v.url == val) {
                this.headersText = v.name
              }
            })
          }
        })
        if (val.indexOf('goods') !== -1 || val === '/goods') {
          this.headersText = 'login.productpresentation'
        } else if (val.indexOf('successfulCase') !== -1 || val === '/successfulCase') {
          this.headersText = 'login.successfulCase'
        } else if (val.indexOf('news') !== -1 || val === '/news') {
          this.headersText = 'loginFooter.companyNews'
        } else if (val.indexOf('regis') !== -1 || val === '/regis') {
          this.headersText = 'login.regis'
        } else if (val.indexOf('regisForm') !== -1 || val === '/regisForm') {
          this.headersText = 'login.regis'
        } else if (val.indexOf('regisLicense') !== -1 || val === '/regisLicense') {
          this.headersText = 'login.regis'
        } else if (val.indexOf('regisSuccess') !== -1 || val === '/regisSuccess') {
          this.headersText = 'login.regis'
        } else if (val.indexOf('regisAgain') !== -1 || val === '/regisAgain') {
          this.headersText = 'login.regisAgain'
        } else if (val.indexOf('genernalAgreement') !== -1) {
          this.headersText = 'websiteAgreement'
        } else if (val === '/mobOnlineMsg') {
          this.headersText = 'title.onlineMsg'
        }
        this.$store.commit('HEADER_TEXT', this.headersText)
      } else {
        this.isheaders = false
      }
    },
    routeCur() {
      let url = this.$route.fullPath
      let url1 = this.$route.fullPath.split('/')
      let NavList = [...this.NavList]
      if (url1.length > 2) {
        NavList.forEach((item, index) => {
          item.istrue = false
          if (url1[1] == '/successfulCase' && item.url == '/successfulCase') {
            item.istrue = true
          }
          item.children.forEach((v, i) => {
            v.istrue = false
            if (v.url == url) {
              item.istrue = true
              v.istrue = true
            }
          })
        })
      } else {
        let url = this.$route.fullPath
        NavList.forEach((item, index) => {
          item.istrue = false
          if (item.url == url) {
            item.istrue = true
          }
          item.children.forEach((v, i) => {
            v.istrue = false
            if (v.url == url) {
              item.istrue = true
              v.istrue = true
            }
          })
        })
      }
      this.NavList = NavList
    },
    parentFn(msg) {
      // console.log(msg);
      this.isshow = msg
      let NavList = [...this.mobNavList]
      this.mobNavList.forEach((item, index) => {
        item.istrue = false
        item.children.forEach((v, i) => {
          v.istrue = false
        })
      })
      this.mobNavList = NavList
      // console.log(this.mobNavList)
    },
    closeNav() {
      this.isshow = false
    },
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    toPage(path, index) {
      if (path === '/openPlatformUrl') {
        this.$utils.openWindow(this.$api.openPlatform)
        return
      }
      if (path === '/login') {
        this.$store.commit('LOGIN_BOX_STATUS', false)
      }
      let NavList = [...this.NavList]
      NavList.forEach((item, index) => {
        item.istrue = false
        item.children.forEach((v, i) => {
          v.istrue = false
        })
      })
      this.NavList[index].istrue = true
      this.$router.push(path)
    },
    totoPages(val, name) {
      this.isshow = false
      // this.headersText = name;
      // this.$store.commit("HEADER_TEXT", this.headersText);
      let time = null
      clearTimeout(time)
      time = setTimeout(() => {
        if (val === '/openPlatformUrl') {
          this.$utils.openWindow(this.$api.openPlatform)
          return
        }
        this.$router.push(val)
      }, 300)
    },
    handleCommand(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="less">
@import '../../assets/css/homeCommon.less';
@import '../../assets/color';
#loginIndex {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: @background;
  ul.navTop {
    background: #fff;
    width: 100%;
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: solid 1px @border1;
    li {
      &:hover {
        cursor: pointer;
      }
      span {
        font-size: 16px;
      }
      img {
        margin-top: 13px;
      }
    }
    .curDrop {
      color: #feb764;
    }
  }
}

@media only screen and (max-width: 767px) {
  #loginIndex {
    ul.navTop {
      display: none;
    }
  }
  .mobMenu {
    .el-drawer.ltr {
      width: auto !important;
      min-width: 75%;
      overflow: auto;
    }
    .el-drawer__header {
      margin-bottom: 13px;
      img {
        width: auto;
        height: 25px;
      }
    }
    #mobNav {
      .el-menu {
        .el-menu-item {
          height: 45px;
          line-height: 45px;
        }
        .el-submenu {
          .el-submenu__title {
            height: 45px;
            line-height: 45px;
          }
          .el-menu-item {
            height: 40px;
            line-height: 40px;
          }
        }
        .el-menu-item-group__title {
          padding: 0;
        }
        // .el-menu-item:hover,
        .el-menu-item:focus,
        // .el-submenu__title:hover,
        .el-submenu__title:focus {
          background-color: #fff !important;
        }
        .el-submenu .el-menu-item {
          padding-left: 55px !important;
        }
      }
    }
    #mobNav {
      padding-left: 10px;
      img {
        width: 16px;
        height: auto;
        margin-right: 10px;
      }
    }
  }
}
</style>
