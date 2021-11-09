<template>
  <div id="recruit">
    <div class="banner flex-hcvc">
      <div>
        <p>{{ $t('recruit.title') }}</p>
        <span>{{ $t('recruit.subTitle') }}</span>
      </div>
    </div>
    <div class="body">
      <div class="bodyContent">
        <div class="map clearfix">
          <div class="tech fl">
            <h2>{{ $t('order.tips11') }}</h2>
            <p>{{ $t('recruit.mes1') }}</p>
            <p>{{ $t('recruit.mes2') }}</p>
            <p>{{ $t('recruit.mes3') }}</p>
            <p>{{ $t('recruit.mes4') }}</p>
          </div>
          <el-collapse v-model="activeName" accordion class="info fl">
            <el-collapse-item name="1">
              <template slot="title">
                <p class="workTitle">{{ $t('recruit.workName1') }}<span>（{{ $t('recruit.team1') }}）</span></p>
              </template>
              <h3>{{ $t('recruit.job') }}：</h3>
              <p>
                {{ $t('recruit.job1') }}：<br>
                1、{{ $t('recruit.work1_1') }}<br>
                2、{{ $t('recruit.work1_2') }}<br>
                3、{{ $t('recruit.work1_3') }}<br>
                4、{{ $t('recruit.work1_4') }}<br>
                5、{{ $t('recruit.work1_5') }}<br>
                6、{{ $t('recruit.work1_6') }}<br>
                7、{{ $t('recruit.work1_7') }}<br>
                8、{{ $t('recruit.work1_8') }}
              </p>
              <p>
                {{ $t('recruit.Qualifications') }}：<br>
                1、{{ $t('recruit.work1_9') }}<br>
                2、{{ $t('recruit.work1_10') }}<br>
                3、{{ $t('recruit.work1_11') }}
              </p>
            </el-collapse-item>
            <el-collapse-item name="2">
              <template slot="title">
                <p class="workTitle">{{ $t('recruit.workName2') }}<span>（{{ $t('recruit.team2') }}）</span></p>
              </template>
              <h3>{{ $t('recruit.job') }}：</h3>
              <p>
                {{ $t('recruit.job1') }}：<br>
                1、{{ $t('recruit.work2_1') }}<br>
                2、{{ $t('recruit.work2_2') }}
              </p>
              <p>
                {{ $t('recruit.Qualifications') }}：<br>
                1、{{ $t('recruit.work2_3') }}<br>
                2、{{ $t('recruit.work2_4') }}<br>
                3、{{ $t('recruit.work2_5') }}<br>
                4、{{ $t('recruit.work2_6') }}<br>
                5、{{ $t('recruit.work2_7') }}
              </p>
            </el-collapse-item>
            <el-collapse-item name="3">
              <template slot="title">
                <p class="workTitle">{{ $t('recruit.workName3') }}<span>（{{ $t('recruit.team2') }}）</span></p>
              </template>
              <h3>{{ $t('recruit.job') }}：</h3>
              <p>
                {{ $t('recruit.job1') }}：<br>
                1、{{ $t('recruit.work3_1') }}<br>
                2、{{ $t('recruit.work3_2') }}
              </p>
              <p>
                {{ $t('recruit.Qualifications') }}：<br>
                1、{{ $t('recruit.work3_3') }}<br>
                2、{{ $t('recruit.work3_4') }}<br>
                3、{{ $t('recruit.work3_5') }}<br>
                4、{{ $t('recruit.work3_6') }}
              </p>
            </el-collapse-item>
            <el-collapse-item name="4">
              <template slot="title">
                <p class="workTitle">{{ $t('recruit.workName4') }}<span>（{{ $t('recruit.team3') }}）</span></p>
              </template>
              <h3>{{ $t('recruit.job') }}：</h3>
              <p>
                {{ $t('recruit.job1') }}：<br>
                1、{{ $t('recruit.work4_1') }}<br>
                2、{{ $t('recruit.work4_2') }}<br>
                3、{{ $t('recruit.work4_3') }}<br>
                4、{{ $t('recruit.work4_4') }}<br>
                5、{{ $t('recruit.work4_5') }}<br>
              </p>
              <p>
                {{ $t('recruit.Qualifications') }}：<br>
                1、{{ $t('recruit.work4_6') }}<br>
                2、{{ $t('recruit.work4_7') }}<br>
                3、{{ $t('recruit.work4_8') }}<br>
                4、{{ $t('recruit.work4_9') }}<br>
                5、{{ $t('recruit.work4_10') }}<br>
              </p>
            </el-collapse-item>
            <el-collapse-item name="5">
              <template slot="title">
                <p class="workTitle">{{ $t('recruit.workName5') }}<span>（{{ $t('recruit.team1') }}）</span></p>
              </template>
              <h3>{{ $t('recruit.job') }}：</h3>
              <p>
                {{ $t('recruit.job1') }}：<br>
                1、{{ $t('recruit.work5_1') }}<br>
                2、{{ $t('recruit.work5_2') }}<br>
                3、{{ $t('recruit.work5_3') }}<br>
                4、{{ $t('recruit.work5_4') }}<br>
                5、{{ $t('recruit.work5_5') }}<br>
                6、{{ $t('recruit.work5_6') }}<br>
                7、{{ $t('recruit.work5_7') }}<br>
              </p>
              <p>
                {{ $t('recruit.Qualifications') }}：<br>
                1、{{ $t('recruit.work5_8') }}<br>
                2、{{ $t('recruit.work5_9') }}<br>
                3、{{ $t('recruit.work5_10') }}<br>
                4、{{ $t('recruit.work5_11') }}<br>
                5、{{ $t('recruit.work5_12') }}
              </p>
            </el-collapse-item>
            <el-collapse-item name="6">
              <template slot="title">
                <p class="workTitle">{{ $t('recruit.workName6') }}<span>（{{ $t('recruit.team4') }}）</span></p>
              </template>
              <h3>{{ $t('recruit.job') }}：</h3>
              <p>
                {{ $t('recruit.job1') }}：<br>
                1、{{ $t('recruit.work6_1') }}<br>
                2、{{ $t('recruit.work6_2') }}<br>
                3、{{ $t('recruit.work6_3') }}<br>
                4、{{ $t('recruit.work6_4') }}<br>
                5、{{ $t('recruit.work6_5') }}
              </p>
              <p>
                {{ $t('recruit.Qualifications') }}：<br>
                1、{{ $t('recruit.work6_6') }}<br>
                2、{{ $t('recruit.work6_7') }}<br>
                3、{{ $t('recruit.work6_8') }}<br>
                4、{{ $t('recruit.work6_9') }}<br>
                5、{{ $t('recruit.work6_10') }}<br>
                6、{{ $t('recruit.work6_11') }}
              </p>
              <h4>{{ $t('recruit.note') }}：{{ $t('recruit.note1') }}</h4>
            </el-collapse-item>
          </el-collapse>
        </div>
        <h2>{{ $t('recruit.Welfare') }}</h2>
        <ul class="flex-whc">
          <li>
            <img src="../../assets/images/common/recruit1.png" alt="">
            <p>{{ $t('recruit.Welfare1') }}</p>
          </li>
          <li>
            <img src="../../assets/images/common/recruit2.png" alt="">
            <p>{{ $t('recruit.Welfare2') }}</p>
          </li>
          <li>
            <img src="../../assets/images/common/recruit3.png" alt="">
            <p>{{ $t('recruit.Welfare3') }}</p>
          </li>
          <li>
            <img src="../../assets/images/common/recruit4.png" alt="">
            <p>{{ $t('recruit.Welfare4') }}</p>
          </li>
          <li>
            <img src="../../assets/images/common/recruit5.png" alt="">
            <p>{{ $t('recruit.Welfare5') }}</p>
          </li>
          <li>
            <img src="../../assets/images/common/recruit6.png" alt="">
            <p>{{ $t('recruit.Welfare6') }}</p>
          </li>
          <li>
            <img src="../../assets/images/common/recruit7.png" alt="">
            <p>{{ $t('recruit.Welfare7') }}</p>
          </li>
          <li>
            <img src="../../assets/images/common/recruit8.png" alt="">
            <p>{{ $t('recruit.Welfare8') }}</p>
          </li>
          <li>
            <img src="../../assets/images/common/recruit9.png" alt="">
            <p>{{ $t('recruit.Welfare9') }}</p>
          </li>
          <li>
            <img src="../../assets/images/common/recruit10.png" alt="">
            <p>{{ $t('recruit.Welfare10') }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import '../../../static/js/jquery'
export default {
  data() {
    return {
      activeName: ''
    }
  },
  created() {
    this.switchCss(this.language)
  },
  methods: {
    switchCss(lang) {
      if (lang == 'cn') {
        $('.workTitle').css('line-height', '50px')
      } else {
        $('.workTitle').css('line-height', '30px')
      }
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  watch: {
    language(val) {
      this.switchCss(val)
    }
  }
}
</script>

<style lang="less">
@import '../../assets/color';
#recruit {
  .banner {
    background: url('../../assets/images/common/recruit_1.png') no-repeat
      center/cover;
  }
  .body {
    .map {
      padding-bottom: 1rem;
      .info {
        width: 40%;
        margin-top: 3.6rem;
        span {
          font-size: 14px;
          color: #b5b5b5;
        }
        .el-collapse-item__header {
          line-height: 2;
          padding: 0.35rem 0;
        }
      }
      .tech {
        width: 60%;
        padding-right: 1.5rem;
        // font-size: 16px;
        h2,
        p {
          padding-bottom: 1rem;
          line-height: 1.8;
        }
      }
    }
    ul {
      li {
        text-align: center;
        margin: 1rem 1rem;
        width: 6.4rem;
        img {
          width: 4.8rem;
        }
        p {
          padding-top: 0.75rem;
        }
      }
    }
  }
}
@media screen and (max-width: 767px) {
  #recruit {
    .body {
      // font-size: 1.3rem;
      .map {
        padding-bottom: 2rem;
        .info {
          width: 100%;
          font-size: 1.3rem;
          margin-top: 0.5rem;
          .el-collapse-item__header {
            font-size: 1.3rem;
          }
          .el-collapse-item__content {
            font-size: 1.2rem;
            padding-bottom: 1.25rem;
          }
        }
        .tech {
          width: 100%;
          padding-right: 0;
          // font-size: 1.3rem;
        }
      }
      ul {
        font-size: 1.2rem;
        li {
          margin: 1rem 0.5rem;
        }
      }
    }
  }
}
</style>
