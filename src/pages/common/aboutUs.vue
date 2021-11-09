<template>
  <div id="aboutUs">
    <div class="banner flex-hcvc">
      <div>
        <p>{{ $t('loginFooter.aboutUs') }}</p>
        <span>{{ $t('profile.subTitle') }}</span>
      </div>
    </div>
    <div class="body">
      <div class="bodyContent">
        <p class="intro">{{ $t('profile.mes1') }}</p>
        <div class="flex-wha">
          <div>
            <p class="title">15<span>+{{ $t('time.year') }}</span></p>
            <p>{{ $t('profile.mes2') }}</p>
            <span>{{ $t('profile.mes3') }}<br>{{ $t('profile.mes4') }}</span>
          </div>
          <div>
            <p class="title">200<span>+{{ $t('profile.mes5') }}</span></p>
            <p>{{ $t('profile.mes6') }}</p>
            <span>{{ $t('profile.mes7') }}<br>{{ $t('profile.mes8') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="bodyContent">
        <h3>{{ $t('loginFooter.contactUs') }}</h3>
        <div class="map clearfix">
          <img class="adressMap fl" :src="language === 'cn' ? require('@/assets/images/common/aboutUs_map.png') : require('@/assets/images/common/aboutUs_map1.png')" alt="">
          <!-- <img src="@/assets/images/common/aboutUs_map.png" alt=""> -->
          <el-collapse v-model="activeName" accordion class="info fl">
            <el-collapse-item :title="$t('profile.mes9')" name="1">
              <div>{{ $t('common.address') }}：{{ $t('profile.mes10') }}</div>
              <div>{{ $t('common.tel') }}：021-64518711</div>
              <div>{{ $t('common.fax') }}：021-64518712</div>
            </el-collapse-item>
            <el-collapse-item :title="$t('profile.mes11')" name="2">
              <div>{{ $t('common.address') }}：{{ $t('profile.mes12') }}</div>
              <div>{{ $t('common.tel') }}：010-82435571</div>
              <div>{{ $t('common.fax') }}：010-82435571-606</div>
            </el-collapse-item>
            <el-collapse-item :title="$t('profile.mes13')" name="3">
              <div>{{ $t('common.address') }}：{{ $t('profile.mes14') }}</div>
              <div>{{ $t('common.tel') }}：023-65636683</div>
              <div>{{ $t('common.fax') }}：023-68797087</div>
            </el-collapse-item>
            <!-- <el-collapse-item :title="$t('profile.mes15')" name="4">
            <div>{{ $t('common.address') }}：{{ $t('profile.mes16') }}</div>
            <div>{{ $t('common.tel') }}：0991-4514795</div>
          </el-collapse-item> -->
            <el-collapse-item :title="$t('profile.mes17')" name="5">
              <div>{{ $t('common.address') }}：{{ $t('profile.mes18') }}</div>
              <div>{{ $t('common.tel') }}：020-38358550</div>
            </el-collapse-item>
            <!-- <el-collapse-item :title="$t('profile.mes19')" name="6">
            <div>{{ $t('common.address') }}：{{ $t('profile.mes20') }}</div>
            <div>{{ $t('common.tel') }}：027-65520771</div>
          </el-collapse-item> -->
            <el-collapse-item :title="$t('profile.mes21')" name="7">
              <div>{{ $t('common.address') }}：{{ $t('profile.mes22') }}</div>
              <div>{{ $t('common.tel') }}：00882-27213625</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: '1'
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  created() { },
  methods: {}
}
</script>

<style lang="less">
@import '../../assets/color';
#aboutUs {
  .banner {
    background: url(../../assets/images/common/aboutUs_1.png) no-repeat
      center/cover;
  }
  .body {
    min-height: auto;
    &:nth-of-type(3) {
      padding-top: 2rem;
    }
    h3 {
      text-align: center;
      font-size: 1.5rem;
    }
    p.intro {
      line-height: 1.8;
      // padding-top: 0.75rem;
    }
    .flex-wha > div {
      margin-top: 2rem;
      text-align: center;
      p {
        font-size: 1rem;
        &.title {
          font-size: 45px;
          span {
            font-size: 45px;
            color: rgb(193, 9, 14);
          }
        }
      }
      span {
        font-size: 0.6rem;
      }
    }
    .map {
      padding-top: 2rem;
      .adressMap {
        width: 60%;
        padding-right: 1.5rem;
      }
      .info {
        width: 40%;
        margin-top: 2rem;
        .el-collapse-item__header {
          line-height: 2;
          padding: 0.35rem 0;
        }
      }
    }
  }
}
@media screen and (max-width: 767px) {
  div#aboutUs {
    .body {
      &:nth-of-type(3) {
        padding-top: 0;
      }
      h3 {
        text-align: center;
        font-size: 1.5rem;
      }
      p.intro {
        font-size: 1.3rem;
      }
      .flex-wha > div {
        line-height: 1.3;
        p {
          font-size: 1.5rem;
          &.title {
            font-size: 3rem;
            span {
              font-size: 3rem;
            }
          }
        }
        span {
          font-size: 1rem;
        }
      }
      .map {
        .adressMap {
          width: 100%;
          padding-right: 0;
        }
        .info {
          width: 100%;
          .el-collapse-item__header {
            font-size: 1.3rem;
          }
          .el-collapse-item__content {
            font-size: 1.2rem;
            padding-bottom: 1.25rem;
          }
        }
      }
    }
  }
}
</style>
