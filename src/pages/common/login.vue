<template>
  <div id="login">
    <!-- pc内容 -->
    <div class="homeBanner hidden-xs-only">
      <div style="position: relative;">
        <el-carousel class="swiperLogin" :interval="3000" arrow="never" indicator-position="none">
          <el-carousel-item>
            <img :src="language == 'cn' ? require('../../assets/images/login/loginBg.png') : require('../../assets/images/login/loginBg_1.png')" alt="banner" />
          </el-carousel-item>
          <el-carousel-item>
            <img :src="language == 'cn' ? require('../../assets/images/login/loginBg2.png') : require('../../assets/images/login/loginBg2_1.png')" alt="banner" />
          </el-carousel-item>
          <el-carousel-item>
            <img :src="language == 'cn' ? require('../../assets/images/login/loginBg.png') : require('../../assets/images/login/loginBg_1.png')" alt="banner" />
          </el-carousel-item>
          <el-carousel-item>
            <img :src="language == 'cn' ? require('../../assets/images/login/loginBg2.png') : require('../../assets/images/login/loginBg2_1.png')" alt="banner" />
          </el-carousel-item>
        </el-carousel>
        <div class="login" v-if="loginBoxStatus">
          <el-tabs v-model="activeName" class="user-login" @tab-click="handleClick">
            <el-tab-pane :label="$t('login.userLogin')" name="userLogin">
              <ul>
                <li class="first">
                  <i class="el-icon-user-solid"></i>
                  <el-input ref="userLoginName" v-model.trim="userName" @keydown.enter.native="userToLogin" :placeholder="$t('placeholder.EPN')"></el-input>
                </li>
                <li>
                  <i class="el-icon-unlock"></i>
                  <el-input type="password" v-model.trim="userPassword" @keydown.enter.native="userToLogin" :placeholder="$t('common.password')"></el-input>
                </li>
                <li class="remember">
                  <el-checkbox v-model="rembPsdUser">{{ $t('login.rembpsd') }}</el-checkbox>
                  <p class="pointer" @click="forgetPsd(2)">{{ $t('login.forgetpsd') }}</p>
                </li>
                <li>
                  <el-button class="btnClr" type="warning" @click="userToLogin" style="width:100%">{{ $t('login.login') }}</el-button>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane :label="$t('login.enterpriceLogin1')" name="enterpriceLogin">
              <ul>
                <li>
                  <i class="el-icon-notebook-2"></i>
                  <el-input ref="enterpriceLoginName" v-model.trim="etpNum" @keydown.enter.native="etpToLogin" :placeholder="$t('placeholder.input') + $t('login.enterpriceLogin')"></el-input>
                </li>
                <li>
                  <i class="el-icon-user-solid"></i>
                  <el-input v-model.trim="etpName" @keydown.enter.native="etpToLogin" :placeholder="$t('placeholder.input') + $t('basicInfo.userName')"></el-input>
                </li>
                <li>
                  <i class="el-icon-unlock"></i>
                  <el-input type="password" v-model.trim="etpPassword" @keydown.enter.native="etpToLogin" :placeholder="$t('common.password')"></el-input>
                </li>
                <li class="remember">
                  <el-checkbox v-model="rembPsd">{{ $t('login.rembpsd') }}</el-checkbox>
                  <p class="pointer" @click="forgetPsd('')">{{ $t('login.forgetpsd') }}</p>
                </li>
                <li>
                  <el-button class="btnClr" type="warning" @click="etpToLogin" style="width:100%">{{ $t('login.login') }}</el-button>
                </li>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- 方案展示 -->
      <div class="program flex-dhcvc">
        <p>{{ $t('login.solutionDisplay') }}</p>
      </div>
      <div class="plan">
        <el-carousel height="550px" indicator-position="none" @change="changeCarousel" ref="carousel" type="card" :autoplay="planIsPlay" @click.native="linkTo" arrow="always">
          <el-carousel-item>
            <img src="../../assets/images/login/planDisplay/eye.png" alt />
            <div class="intro sjfs">
              <p>{{ $t('login.solutionDisplay1') }}</p>
              <p class="subTitle" style="width:78%;">
                {{ $t('login.solutionDisplay2') }}
                <i>{{ $t('login.solutionDisplay3') }}</i>
                {{ $t('login.solutionDisplay4') }}
              </p>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <img :src="language == 'cn' ? require('../../assets/images/login/planDisplay/patrol.png') : require('../../assets/images/login/planDisplay/patrol_1.png')" alt />
            <div class="intro ycxd">
              <p>{{ $t('login.solutionDisplay5') }}</p>
              <p class="subTitle" style="width:43%;">{{ $t('login.solutionDisplay6') }}</p>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <img src="../../assets/images/login/planDisplay/supervisor.png" alt />
            <div class="intro ddjh">
              <p>{{ $t('login.solutionDisplay7') }}</p>
              <p class="subTitle" style="width:68%;">{{ $t('login.solutionDisplay8') }}</p>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <img :src="language == 'cn' ? require('../../assets/images/login/planDisplay/shop.png') : require('../../assets/images/login/planDisplay/shop_1.png')" alt />
            <div class="intro mdzi">
              <p>{{ $t('login.solutionDisplay9') }}</p>
              <p class="subTitle">{{ $t('login.solutionDisplay10') }}</p>
            </div>
          </el-carousel-item>
          <!-- <el-carousel-item>
            <img src="../../assets/images/login/planDisplay/visual.gif" alt />
            <div class="intro kshzs">
              <p>{{ $t('login.solutionDisplay11') }}</p>
              <p class="subTitle">{{ $t('login.solutionDisplay12') }}</p>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <img :src="language == 'cn' ? require('../../assets/images/login/planDisplay/face.gif') : require('../../assets/images/login/planDisplay/face_1.gif')" alt />
            <div class="intro rlsb">
              <p>{{ $t('login.solutionDisplay13') }}</p>
              <p class="subTitle">
                <i>{{ $t('login.solutionDisplay14') }}</i>
                <br />
                {{ $t('login.solutionDisplay15') }}
              </p>
            </div>
          </el-carousel-item>
          <el-carousel-item>
            <img src="../../assets/images/login/planDisplay/coldChain.png" alt />
            <div class="intro zhll">
              <p>{{ $t('login.solutionDisplay16') }}</p>
              <p class="subTitle" style="width:35%;">{{ $t('login.solutionDisplay17') }}</p>
            </div>
          </el-carousel-item> -->
        </el-carousel>
      </div>
      <ul class="indicator flex-whc">
        <li v-for="(item,index) in indicator" :key="index" :class="item.active ? 'active' : ''" @mouseenter="changeIn(index)" @mouseleave="changeOut">
          <img :src="item.imgurl" />
          <p>{{ $t(item.name) }}</p>
        </li>
      </ul>
      <!-- 行业应用 -->
      <div class="caseShare industry flex-dhcvc">
        <p>{{ $t('login.Industries') }}</p>
        <ul class="flex">
          <li>
            <img src="../../assets/images/login/Supermarket.png" />
            <span>{{ $t('login.Retail') }}</span>
          </li>
          <li>
            <img src="../../assets/images/login/Restaurant.png" />
            <span>{{ $t('login.Catering') }}</span>
          </li>
          <li>
            <img src="../../assets/images/login/logistics.png" />
            <span>{{ $t('login.Logistics') }}</span>
          </li>
          <!-- <li>
            <img src="../../assets/images/login/Manufacture.png" />
            <span>制造</span>
          </li>-->
        </ul>
      </div>
      <!-- 成功案例 -->
      <div class="caseShare flex-dhcvc">
        <p>{{ $t('login.successfulCase') }}</p>
        <ul class="flex-whc">
          <li>
            <img src="../../assets/images/login/RT-mart.png" />
          </li>
          <li>
            <img src="../../assets/images/login/sanjiang.png" />
          </li>
          <li>
            <img src="../../assets/images/login/dingxin.png" />
          </li>
          <li>
            <img src="../../assets/images/login/G-supen.png" />
          </li>
          <li>
            <img src="../../assets/images/login/ymart.png" />
          </li>
          <li>
            <img src="../../assets/images/login/dicos.png" />
          </li>
        </ul>
      </div>
    </div>
    <!-- mob内容 -->
    <div class="hidden-sm-and-up" id="mobHome">
      <!-- 轮播图 -->
      <!-- <swiper ref="mySwiper" :options="swiperOptions">
        <swiper-slide><img :src="require(`../../assets/images/login/banner1_${language}_mob.png`)" alt="banner1" /></swiper-slide>
        <swiper-slide><img :src="require(`../../assets/images/login/banner2_${language}_mob.png`)" alt="banner2" /></swiper-slide>
      </swiper> -->
      <!-- <div v-swiper:mySwiper="swiperOptions">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <img :src="require(`../../assets/images/login/banner1_${language}_mob.png`)" alt="banner1" />
          </div>
          <div class="swiper-slide">
            <img :src="require(`../../assets/images/login/banner2_${language}_mob.png`)" alt="banner2" />
          </div>
        </div>
      </div> -->
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide"><img :src="require(`../../assets/images/login/banner1_${language}_mob.png`)" alt="banner1" /></div>
          <div class="swiper-slide"><img :src="require(`../../assets/images/login/banner2_${language}_mob.png`)" alt="banner2" /></div>
        </div>
      </div>
      <!-- 方案展示 -->
      <div class="sectionBox solutionNav">
        <p class="title">{{ $t('login.solutionDisplay') }}</p>
        <ul class="flex-w">
          <li>
            <router-link to="/solution/1">
              <img src="../../assets/images/mob/solution_mob1.png" alt="" />
              <p>{{ $t('setting.wisdomCashier').replace(/System/i,'') }}</p>
            </router-link>
          </li>
          <li>
            <router-link to="/solution/2">
              <img src="../../assets/images/mob/solution_mob2.png" alt="" />
              <p>{{ $t('setting.smartShop').replace(/System/i,'') }}</p>
            </router-link>
          </li>
          <li>
            <router-link to="/solution/3">
              <img src="../../assets/images/mob/solution_mob3.png" alt="" />
              <p>{{ $t('setting.supervision').replace(/System/i,'') }}</p>
            </router-link>
          </li>
          <li>
            <router-link to="/solution/4">
              <img src="../../assets/images/mob/solution_mob4.png" alt="" />
              <p>{{ $t('setting.selfCheck').replace(/System/i,'') }}</p>
            </router-link>
          </li>
          <!-- <li>
            <router-link to="/solution/5">
              <img src="../../assets/images/mob/solution_mob5.png" alt="" />
              <p>{{ $t('setting.visual').replace(/System/i,'') }}</p>
            </router-link>
          </li>
          <li>
            <router-link to="/solution/6">
              <img src="../../assets/images/mob/solution_mob6.png" alt="" />
              <p>{{ $t('setting.srsFace').replace(/System/i,'') }}</p>
            </router-link>
          </li>
          <li>
            <router-link to="/solution/7">
              <img src="../../assets/images/mob/solution_mob7.png" alt="" />
              <p>{{ $t('setting.smartColdChain').replace(/System/i,'') }}</p>
            </router-link>
          </li> -->
        </ul>
      </div>
      <!-- 行业应用 -->
      <div class="sectionBox industry">
        <p class="title">{{ $t('login.Industries') }}</p>
        <ul class="flex-w">
          <li>
            <img src="../../assets/images/login/Supermarket.png" />
            <p>{{ $t('login.Retail') }}</p>
          </li>
          <li>
            <img src="../../assets/images/login/Restaurant.png" />
            <p>{{ $t('login.Catering') }}</p>
          </li>
          <li>
            <img src="../../assets/images/login/logistics.png" />
            <p>{{ $t('login.Logistics') }}</p>
          </li>
        </ul>
      </div>
      <!-- 成功案例 -->
      <div class="sectionBox case">
        <div class="flex-hb">
          <p class="title">{{ $t('login.successfulCase') }}</p>
          <router-link :to="{path:'/successfulCase'}" class="flex-hbvc">
            <p class="title more">{{ $t('login.more') }}</p>
          </router-link>
        </div>
        <ul>
          <li>
            <router-link :to="{path:'/successfulCase/sanjiang'}" class="flex-hbvc">
              <div class="info">
                <h3>{{ $t('case.sanjiang') }}</h3>
                <p class="two-txt-cut">{{ $t('login.sanjiangMobText') }}</p>
              </div>
              <el-image :src="require('@/assets/images/demos/sanjiang.png')" fit="cover"></el-image>
              <!-- <img src="../../assets/images/demos/sanjiang.png" alt /> -->
            </router-link>
          </li>
          <li>
            <router-link :to="{path:'/successfulCase/lvdi'}" class="flex-hbvc">
              <div class="info">
                <h3>{{ $t('case.lvdi') }}</h3>
                <p class="two-txt-cut">{{ $t('login.G_SuperMobText') }}</p>
              </div>
              <el-image :src="require('@/assets/images/demos/ludi1.png')" fit="cover"></el-image>
              <!-- <img src="../../assets/images/demos/ludi1.png" alt /> -->
            </router-link>
          </li>
          <li>
            <router-link :to="{path:'/successfulCase/rtMart'}" class="flex-hbvc">
              <div class="info">
                <h3>{{ $t('case.rtMartSub') }}</h3>
                <p class="two-txt-cut">{{ $t('login.rtMobText') }}</p>
              </div>
              <el-image :src="require('@/assets/images/demos/rtMart.png')" fit="cover"></el-image>
              <!-- <img src="../../assets/images/demos/rtMart.png" alt /> -->
            </router-link>
          </li>
        </ul>
      </div>
      <!-- 新闻资讯 -->
      <div class="sectionBox news">
        <p class="title">{{ $t('loginFooter.news') }}</p>
        <ul class="clearfix">
          <li>
            <router-link :to="{path:'/news/news1'}" class="flex-hrvc">
              <div>
                <p>{{ $t('login.newsMobText1') }}</p>
                <p>{{ $t('login.newsMobText2') }}</p>
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <!-- 在线留言 -->
    <img class="onlineMes pointer hidden-xs-only" @click="openMesDialog" :src="language == 'cn' ? require('../../assets/images/login/onlineMes.png') : require('../../assets/images/login/onlineMes_1.png')" />
    <img class="onlineMes pointer hidden-sm-and-up" @click="openMobPage" :src="language == 'cn' ? require('../../assets/images/login/onlineMes.png') : require('../../assets/images/login/onlineMes_1.png')" />
    <!-- 留言对话框 -->
    <el-dialog class="msgDialogForm" :title="$t('title.onlineMsg')" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <OnlineMsg v-if="dialogFormVisible" @show-dialog="handleMsgDialog"></OnlineMsg>
    </el-dialog>
  </div>
</template>

<script>
import OnlineMsg from '@/components/onlineMsg'
import { mapGetters } from 'vuex'
import $utils from '@/utils'
import AES from '@/utils/aes'
// import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'ie不兼容,报错，页面出不来
import Swiper from 'swiper/js/swiper.min.js'
import 'swiper/css/swiper.min.css'
import '../../../static/js/jquery'
export default {
  name: 'login',
  components: { OnlineMsg },
  data() {
    return {
      isShow: {
        isWrong: false
      },
      activeName: 'userLogin',
      userName: '',
      userPassword: '',
      etpNum: '',
      etpName: '',
      etpPassword: '',
      companyId: '',
      rembPsdUser: false, // 记住密码-用户
      rembPsd: false, // 记住密码
      indicator: [
        {
          imgurl: require('../../assets/images/login/planDisplay/S_block_01.png'),
          name: 'setting.wisdomCashier',
          active: true,
          link: '/solution/1'
        },
        {
          imgurl: require('../../assets/images/login/planDisplay/S_block_02.png'),
          name: 'setting.smartShop',
          active: false,
          link: '/solution/2'
        },
        {
          imgurl: require('../../assets/images/login/planDisplay/S_block_03.png'),
          name: 'setting.supervision',
          active: false,
          link: '/solution/3'
        },
        {
          imgurl: require('../../assets/images/login/planDisplay/S_block_04.png'),
          name: 'setting.selfCheck',
          active: false,
          link: '/solution/4'
        }
        // {
        //   imgurl: require('../../assets/images/login/planDisplay/S_block_05.png'),
        //   name: 'setting.visual',
        //   active: false,
        //   link: '/solution/5'
        // },
        // {
        //   imgurl: require('../../assets/images/login/planDisplay/S_block_06.png'),
        //   name: 'setting.srsFace',
        //   active: false,
        //   link: '/solution/6'
        // },
        // {
        //   imgurl: require('../../assets/images/login/planDisplay/S_block_07.png'),
        //   name: 'setting.smartColdChain',
        //   active: false,
        //   link: '/solution/7'
        // }
      ],
      planIsPlay: true,
      dialogFormVisible: false,
      timer: null // 定时器
    }
  },
  computed: { ...mapGetters(['loginBoxStatus', 'language']) },
  watch: {
    loginBoxStatus: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.$refs[`${this.activeName}Name`].focus()
          })
        }
      },
      immediate: true
    },
    language(val) {
      this.switchCss(val)
    }
  },
  created() {
    window.clearInterval(sessionStorage.getItem('tokenTimer'))
    sessionStorage.clear()
    this.$store.commit('LANGUAGE', this.language)
    this.$store.commit('AUTHORIZATION', '')
    this.$store.commit('USER', '')
    this.getCookie()
  },
  mounted() {
    this.switchCss(this.language)
    // 手机的轮播图
    // eslint-disable-next-line
    new Swiper('.swiper-container', {
      autoplay: {
        delay: 2000,
        // stopOnLastSlide: false,
        disableOnInteraction: false
      },
      loop: true
    })
  },
  methods: {
    // 英文状态下调整部分css
    switchCss(lang) {
      if (lang === 'en') {
        $('.indicator li')
          .eq(0)
          .children('p')
          .css('top', '20px')
        $('.indicator li')
          .eq(5)
          .children('p')
          .css('top', '20px')
      } else {
        $('.indicator li')
          .eq(0)
          .children('p')
          .css('top', '35px')
        $('.indicator li')
          .eq(5)
          .children('p')
          .css('top', '35px')
      }
    },
    // 点击方案展示跳转到对应的解决方案
    linkTo() {
      let activeIndex = this.$refs.carousel.activeIndex
      this.$router.push(this.indicator[activeIndex].link)
    },
    changeIn(indexs) {
      let indicator = [...this.indicator]
      indicator.forEach((item, index) => {
        item.active = false
        if (index == indexs) {
          item.active = true
        }
      })
      this.indicator = indicator
      this.$refs.carousel.setActiveItem(indexs)
      this.planIsPlay = false
    },
    changeOut() {
      this.planIsPlay = true
    },
    handleClick(tab, event) {
      this.$nextTick(() => {
        this.$refs[`${tab.name}Name`].focus()
      })
      this.getCookie()
    },
    // 用户登录
    userToLogin: $utils.debounce(function () {
      if (this.userName == '') {
        this.$utils.$message({
          message: this.$t('regis.userName') + this.$t('common.noEmpty'),
          type: 'error'
        })
        return
      }
      if (this.userPassword == '') {
        this.$utils.$message({
          message: this.$t('common.password') + this.$t('common.noEmpty'),
          type: 'error'
        })
        return
      }
      var encrypted = AES.encrypt(
        this.userName + this.userPassword,
        this.$api.AES_KEY
      )
      let params = {
        type: 2,
        userName: this.userName,
        password: encrypted
      }
      this.$http.posts1('isFirstLogin', { type: 2, userName: this.userName }, '', false).then(res => {
        var data = res.data || {}
        // 首次登录且不是超级管理员弹出个人信息对话框
        sessionStorage.setItem('showInfoDialog', +(!data.lastLoginTime && data.roleId !== '1')) // 1-true 0-false
        this.getLogin(params)
      })
        .catch(er => {
          sessionStorage.setItem('showInfoDialog', 1) // 默认1 true
        })
    }),
    // 企业登录
    etpToLogin: $utils.debounce(function () {
      if (this.etpNum == '') {
        this.$utils.$message({
          message: this.$t('basicInfo.businessNum') + this.$t('common.noEmpty'),
          type: 'error'
        })
        return
      }
      if (this.etpName == '') {
        this.$utils.$message({
          message: this.$t('regis.userName') + this.$t('common.noEmpty'),
          type: 'error'
        })
        return
      }
      if (this.etpPassword == '') {
        this.$utils.$message({
          message: this.$t('common.password') + this.$t('common.noEmpty'),
          type: 'error'
        })
        return
      }
      var encrypted = AES.encrypt(this.etpName + this.etpPassword, this.$api.AES_KEY)
      let params = {
        type: 1,
        userName: this.etpName,
        password: encrypted,
        companyId: this.etpNum
      }
      this.getLogin(params)
    }),
    getLogin(params) {
      // type 1 企业登录 2 用户登录
      // 审核状态 auditStatus 0：待审核 1：通过 2：不通过 3:个人认证待审核 4：认证审核通过 5：认证审核不通过 6：企业认证待审核
      // userType 1.企业用户 2.业务用户 3.dvo用户
      this.$http.posts1('login', params, '', false).then(res => {
        let userData = res.data.user || {}
        sessionStorage.setItem('user', JSON.stringify(userData))
        this.$store.commit('USER', userData)
        if (userData.auditStatus == 2) {
          this.$router.push('/regisAgain')
        } else if (userData.auditStatus == 0) {
          this.$utils.$message({
            message: this.$t('login.audited') + ',' + this.$t('common.tryAgain'),
            type: 'error'
          })
        } else if (userData.auditStatus == null) {
          this.getModule()
        } else {
          this.getComInitData(userData.userType)
        }
        this.setUserInfo()
        // 每隔5分钟请求验证一次token
        this.timer = setInterval(() => {
          if (sessionStorage.getItem('user')) {
            this.$http.posts('vailToken').then(res => { })
          }
        }, 300000)
        sessionStorage.setItem('tokenTimer', this.timer)
      })
    },
    // 获取模块
    getModule() {
      this.$http.gets('getModuleHome')
        .then(res => {
          let data = res.data || []
          sessionStorage.setItem('module', JSON.stringify(data))
          this.$store.commit('MODULE', data)
          this.$router.push('/userLogoIndex')
          this.getLeftMenuTree()
        })
    },
    // 获取企业初始化数据
    getComInitData(userType) {
      this.$http.gets('getComInitData')
        .then(res => {
          let data = res.data || []
          sessionStorage.setItem('comInit', JSON.stringify(data))
          sessionStorage.setItem('basicLeftTree', JSON.stringify(data.auths))
          if (userType === 1) {
            this.$router.push('/welcome')
          }
          if (userType === 3) {
            this.$router.push('/adOverView')
          }
        })
    },
    // 获取左侧菜单树
    getLeftMenuTree(data) {
      this.$http.gets('getLeftMenuTree')
        .then(res => {
          let data = res.data || []
          data.forEach(item => {
            if (item.id === '1') {
              sessionStorage.setItem('basicLeftTree', JSON.stringify(item.children))
            }
            if (item.id === '303') {
              sessionStorage.setItem('visualSafeLeftTree', JSON.stringify(item.children))
            }
          })
        })
    },
    // 储存表单信息
    setUserInfo() {
      // 如果记住密码，存cookie;反之清除cookie
      if (this.rembPsdUser && this.activeName === 'userLogin') {
        var userPassword = AES.encrypt(this.userPassword, this.$api.AES_KEY)
        this.$utils.setCookie('name', this.userName)
        this.$utils.setCookie('psd', userPassword)
        return
      } else {
        this.clearCookie()
      }
      if (this.rembPsd && this.activeName === 'enterpriceLogin') {
        var etpPassword = AES.encrypt(this.etpPassword, this.$api.AES_KEY)
        this.$utils.setCookie('id', this.etpNum)
        this.$utils.setCookie('ename', this.etpName)
        this.$utils.setCookie('epsd', etpPassword)
      } else {
        this.clearCookie()
      }
    },
    // 读取cookie
    getCookie() {
      if (this.activeName == 'userLogin') {
        this.userName = this.$utils.getCookie('name')
        let psd = this.$utils.getCookie('psd')
        if (psd) {
          this.userPassword = AES.decrypt(psd, this.$api.AES_KEY)
        }
        if (this.userName !== '') {
          this.rembPsdUser = true
        }
      } else {
        this.etpNum = this.$utils.getCookie('id')
        this.etpName = this.$utils.getCookie('ename')
        let epsd = this.$utils.getCookie('epsd')
        if (epsd) {
          this.etpPassword = AES.decrypt(epsd, this.$api.AES_KEY)
        }
        if (this.etpNum !== '') {
          this.rembPsd = true
        }
      }
    },
    // 清除cookie
    clearCookie() {
      if (this.activeName == 'userLogin') {
        this.$utils.clearCookie('name')
        this.$utils.clearCookie('psd')
      } else {
        this.$utils.clearCookie('id')
        this.$utils.clearCookie('ename')
        this.$utils.clearCookie('epsd')
      }
    },
    // 忘记密码
    forgetPsd(type) {
      this.$router.push({ path: '/forgotPsd', query: { type } })
    },
    // 切换幻灯片
    changeCarousel(curIdx, oldIdx) {
      $('.indicator li')
        .eq(curIdx)
        .addClass('active')
        .siblings()
        .removeClass('active')
    },
    // 点击留言图标
    openMesDialog() {
      this.dialogFormVisible = true
    },
    // 点击留言图标 手机
    openMobPage() {
      this.$router.push('/mobOnlineMsg')
    },
    // 控制留言显示
    handleMsgDialog(bool) {
      this.dialogFormVisible = bool
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/css/login.less';
#login {
  background-color: #fff;
  .homeBanner {
    .swiper {
      // width: 100%;
      height: 100%;
    }
    .login {
      width: 320px;
      min-width: 290px;
      height: auto;
      position: absolute;
      top: 49%;
      right: 6%;
      margin-top: -170px;
      border-radius: 10px;
      padding: 10px 5px;
      z-index: 3;
      background: #fff;
      .user-login {
        #pane-userLogin {
          li {
            margin-bottom: 18px;
            &.first {
              margin-top: 10px;
            }
          }
        }
        ul {
          height: auto;
          padding-top: 10px;
          li {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 15px;
            &.remember {
              display: flex;
              justify-content: space-between;
              p {
                font-size: 14px;
                color: #c1c1c1;
                &:hover {
                  color: @main;
                }
              }
            }
            &.warning {
              i {
                font-size: 14px;
                color: #f00;
                padding-right: 0;
              }
              font-size: 12px;
              color: #000;
              display: table;
              margin: 0 auto 15px;
              padding: 3px;
              border: solid 1px @main;
            }
            i {
              font-size: 30px;
              color: #999;
              padding-right: 10px;
            }
          }
        }
      }
    }
  }
  .onlineMes {
    position: fixed;
    right: 0;
    top: 48%;
    z-index: 999;
    width: 85px;
    height: 85px;
  }
}
@media screen and (max-width: 767px) {
  #login #mobHome {
    background-color: @background;
    padding-bottom: 1.5rem;
    // 轮播banner
    .swiper-container {
      img {
        width: 100%;
        height: auto;
      }
      // margin-bottom: 0.5rem;
    }
    // 方案展示 行业应用一起
    .solutionNav,
    .industry {
      ul {
        padding: 1rem 0;
        li {
          width: 25%;
          padding-top: 1rem;
          overflow: hidden;
          img {
            display: block;
            width: 5.5rem;
            margin: 0 auto;
            height: auto; //兼容ie10
            // flex布局，不设置高，拉伸了
          }
          p {
            font-size: 1.4rem;
            text-align: center;
            padding: 1rem 0;
          }
        }
      }
    }
    // 行业应用覆盖
    .industry {
      ul li {
        width: 33.33%;
        padding-top: 0.75rem;
        img {
          width: 6.5rem;
        }
        p {
          // font-size: 1.4rem;
          padding: 0.75rem 0;
        }
      }
    }
    //成功案例
    .case {
      .more {
        font-size: 1.2rem;
        color: @text5;
        cursor: pointer;
      }
      ul {
        padding: 0 1rem;
        li {
          padding: 1rem 0;
          border-bottom: 1px solid @border;
          .info {
            width: 65%;
          }
          h3 {
            font-size: 1.4rem;
            // font-weight: normal;
            padding-bottom: 0.5rem;
          }
          p {
            line-height: 1.5;
            font-size: 1.2rem;
          }
          .el-image {
            width: 34%;
            height: 6.3rem;
            margin-left: 1%;
            border-radius: 0.5rem;
          }
        }
        li:last-child {
          border-bottom: none;
        }
      }
    }
    //新闻资讯
    .news {
      ul {
        background-color: @background;
        li {
          a {
            padding-right: 2.5rem;
            height: 8rem;
            background: url(../../assets/images/mob/news_mob1.png) no-repeat
              center/cover;
            border-radius: 1rem;
            p {
              font-size: 1.4rem;
            }
            overflow: hidden;
          }
        }
      }
    }
    // 通用大盒子
    .sectionBox {
      padding: 0 1rem;
      ul {
        background-color: #fff;
        border-radius: 1rem;
      }
    }
    // 标题公用
    .title {
      line-height: 4.5rem;
      height: 4.5rem;
      font-size: 1.8rem;
    }
  }
  #login .onlineMes {
    width: 6rem;
    height: auto;
  }
}
</style>
<style lang="less">
.msgDialogForm {
  .el-dialog__body {
    padding: 0;
    margin: 0;
  }
}
</style>
