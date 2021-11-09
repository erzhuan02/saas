<template>
  <div id="top">
    <div class="pc flex-hb hidden-xs-only">
      <div>
        <img class="dvoMark" :src="language == 'cn'? require('../assets/images/dvoMark.png'): require('../assets/images/dvoMark_1.png')" />
      </div>
      <div class="box flex-hcvc">
        <lang></lang>
        <i class="el-icon-user-solid"></i>
        <p v-if="isExit">
          <span @click="toLogin">{{ $t("login.login") }} /</span>
          <span @click="toRegis">{{ $t("login.regis") }}</span>
        </p>
        <p v-else>{{userName}}</p>
      </div>
    </div>
    <div class="mob flex-hb hidden-sm-and-up">
      <div>
        <img class="dvoMark" :src="language == 'cn' ? require('../assets/images/mob/logo.png') : require('../assets/images/dvoMark_1.png')" />
      </div>
      <div class="box flex-hcvc">
        <i class="el-icon-user-solid" @click="toMobLogin"></i>
        <!-- <img :src="require('../assets/images/mob/user.png')" @click="toMobLogin" alt /> -->
        <img :src="require('../assets/images/mob/Open.png')" @click="showNav" alt />
      </div>
    </div>
  </div>
</template>

<script>
import Lang from '@/components/langSelectNoAuth'
import { mapGetters } from 'vuex'
export default {
  components: { Lang },
  props: ['isshow'],
  data() {
    return {
      isExit: true,
      userName: ''
    }
  },
  computed: { ...mapGetters(['language']) },
  mounted() { },
  methods: {
    toLogin() {
      this.$router.push('/login')
      this.$store.commit('LOGIN_BOX_STATUS', true)
      $('.bg').scrollTop(0)
    },
    toRegis() {
      this.$router.push('/regis')
    },
    toMobLogin() {
      this.$router.push('/mobLogin')
    },
    showNav() {
      this.$emit('isshow', true)
    }
  }
}
</script>

<style lang="less">
@import '../assets/color.less';
#top {
  .pc {
    height: 56px;
    line-height: 56px;
    color: #fff;
    padding: 0 20px;
    background: @navMenu;
    .dvoMark {
      margin-top: 12px;
    }
    .box {
      i {
        font-size: 24px;
        margin-right: 2px;
      }
      span:hover {
        cursor: pointer;
      }
    }
  }
}
@media only screen and (max-width: 767px) {
  #top {
    .mob {
      height: 4.2rem;
      padding: 0 1.5rem;
      color: #fff;
      background: @main1;
      .dvoMark {
        height: 2rem;
        margin-top: 1.1rem;
      }
      .box {
        i {
          font-size: 2rem;
          margin-right: 1.5rem;
        }
        img:nth-child(2) {
          width: 2.2rem;
          height: 1.7rem;
        }
      }
    }
  }
}
</style>
