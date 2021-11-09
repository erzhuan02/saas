<template>
  <div id="loginFooter">
    <div class="upper flex-hb">
      <!-- 左 -->
      <div class="service">
        <div class="hotline">
          <img src="../assets/images/login/Telephone.png" />
          {{ $t("order.tips2") }}
        </div>
        <p>021-6451 8711 {{ $t("order.tips0") }} 150</p>
        <div class="hotline">
          <img src="../assets/images/login/Repair.png" />
          {{ $t("order.tips21") }}
        </div>
        <p>021-6451 8711 {{ $t("order.tips0") }} 114</p>
        <span>{{ $t("loginFooter.MonToSat") }} 9:00-18:00</span>
      </div>
      <div class="line pc"></div>
      <!-- 中 -->
      <ul class="c_first pc">
        <li>{{ $t("login.solution") }}</li>
        <li @click="toPage('/solution/1')" :title="$t('setting.wisdomCashier')">
          <a>{{ $t("setting.wisdomCashier") }}</a>
        </li>
        <li @click="toPage('/solution/2')" :title="$t('setting.smartShop')">
          <a>{{ $t("setting.smartShop") }}</a>
        </li>
        <li @click="toPage('/solution/3')" :title="$t('setting.supervision')">
          <a>{{ $t("setting.supervision") }}</a>
        </li>
        <li @click="toPage('/solution/4')" :title="$t('setting.selfCheck')">
          <a>{{ $t("setting.selfCheck") }}</a>
        </li>
        <!-- <li @click="toPage('/solution/5')" :title="$t('setting.visual')">
          <a>{{ $t("setting.visual") }}</a>
        </li>
        <li @click="toPage('/solution/6')" :title="$t('setting.srsFace')">
          <a>{{ $t("setting.srsFace") }}</a>
        </li>
        <li @click="toPage('/solution/7')" :title="$t('setting.smartColdChain')">
          <a>{{ $t("setting.smartColdChain") }}</a>
        </li> -->
      </ul>
      <ul class="pc">
        <li>{{ $t("loginFooter.news") }}</li>
        <li :title="$t('loginFooter.companyNews')" @click="toPage('/news')">
          <a>{{ $t("loginFooter.companyNews") }}</a>
        </li>
      </ul>
      <ul class="pc">
        <li>{{ $t("loginFooter.service") }}</li>
        <li :title="$t('loginFooter.serviceProcess')" @click="toPage('/serviceProcess')">
          <a>{{ $t("loginFooter.serviceProcess") }}</a>
        </li>
        <li :title="$t('loginFooter.experience')" @click="toPage('/applyExperience')">
          <a>{{ $t("loginFooter.experience") }}</a>
        </li>
      </ul>
      <ul class="c_last pc">
        <li>{{ $t("loginFooter.aboutUs") }}</li>
        <li :title="$t('loginFooter.companyInfo')" @click="toPage('/aboutUs')">
          <a>{{ $t("loginFooter.companyInfo") }}</a>
        </li>
        <li :title="$t('loginFooter.jobRec')" @click="toPage('/recruit')">
          <a>{{ $t("loginFooter.jobRec") }}</a>
        </li>
        <li :title="$t('loginFooter.afterSale')" @click="toPage('/afterSale')">
          <a>{{ $t("loginFooter.afterSale") }}</a>
        </li>
        <li :title="$t('loginFooter.channelPartner')" @click="toPage('/channelPartner')">
          <a>{{ $t("loginFooter.channelPartner") }}</a>
        </li>
      </ul>
      <div class="line pc"></div>
      <!-- 右 -->
      <ul class="followUs">
        <li class="pc">{{ $t("loginFooter.attentUs") }}</li>
        <li>
          <img src="../assets/images/login/QR_code.png" />
        </li>
      </ul>
    </div>
    <div class="lower">
      {{ $t("home.company") }}
      <a href="http://beian.miit.gov.cn/" target="_blank">{{ $t("home.ICPNo") }}</a>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    toPage(path) {
      this.$router.push(path)
      $('.bg').scrollTop(0)
      // this.$nextTick(() => {
      //   $('.bg').scrollTop(0)
      // })
    }
  }
}
</script>

<style scoped lang="less">
@import '../assets/color';
#loginFooter {
  background: #1d1d1d;
  font-size: 16px;
  .upper {
    max-width: 1250px;
    margin: 0 auto;
    padding: 2.75rem 1.5rem;
    .service {
      img {
        margin-right: 0.2rem;
      }
      .hotline {
        font-size: 0.7rem;
        color: #ffc60d;
        line-height: 1.2rem;
      }
      p {
        color: #fff;
        // font-size: 0.9rem;
        padding: 0.4rem 0;
      }
      span {
        color: #a8a8a8;
        // font-size: 0.9rem;
      }
    }
    .line {
      border-right: solid 0.1rem #343434;
    }
    ul {
      // width: 160px;
      li {
        // width: 140px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 0.6rem;
        color: #636363;
        line-height: 1rem;
        &:first-child {
          margin-bottom: 0.75rem;
          font-size: 0.7rem;
          color: #fff;
          // &:hover {
          //   cursor: default;
          // }
        }
        &:not(:first-child):hover {
          cursor: pointer;
          color: #ffc60d;
        }
        // li:nth-child(1) {
        //   &:hover {
        //     cursor: default;
        //   }
        // }
        // &:hover {
        //   cursor: pointer;
        // }
        // &.c_first {
        //   margin-left: 5rem;
        // }
        // &.c_last {
        //   border-right: solid 2px #343434;
        // }
      }
      // &:hover {
      //   cursor: pointer;
      // }
      // &.c_first {
      //   margin-left: 100px;
      // }
      // &.c_last {
      //   border-right: solid 2px #343434;
      //   padding-right: 1rem;
      // }
      // &.followUs {
      //   li {
      //     margin-left: 40px;
      //   }
      // }
    }
  }
  .lower {
    text-align: center;
    padding: 1rem 0;
    border-top: solid 0.1rem #343434;
    font-size: 0.6rem;
    color: #a8a8a8;
    a:hover {
      color: #ffc60d;
    }
  }
}
@media only screen and (max-width: 767px) {
  #loginFooter {
    font-size: 0.9rem;
    padding: 0 1rem;
    .upper {
      padding: 2rem 1.5rem 1.5rem;
      .service {
        .hotline {
          img {
            width: 1.2rem;
            height: 1.2rem;
          }
        }
      }
      ul {
        li {
          width: 7.25rem;
        }
      }
      .followUs {
        img {
          width: 100%;
        }
      }
    }
    .lower {
      text-align: center;
      padding: 0.5rem 1.5rem 1rem 1.5rem;
      border-top: solid 0.1rem #343434;
      font-size: 0.8rem;
      a:hover {
        color: #ffc60d;
      }
    }
  }
  .pc {
    display: none;
  }
}
</style>
