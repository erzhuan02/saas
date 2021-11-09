<template>
  <div id="channelPartner">
    <div class="body">
      <div class="title hidden-xs-only">
        <span>{{ $t('loginFooter.channelPartner') }}</span>
      </div>
      <ul>
        <li class="flex-hb" v-for="(item, index) in data" :key="index">
          <div>
            <div class="flex name">
              <div class="orange"></div>
              <p>{{item.companyName}}</p>
            </div>
            <div class="flex info">
              <p>{{ $t('basicInfo.contacts') }}:</p>
              <p>{{item.contact}}</p>
            </div>
            <div class="flex info">
              <p>{{ $t('common.tel') }}:</p>
              <p>{{item.tel}}</p>
            </div>
            <div class="flex info">
              <p>{{ $t('common.address') }}:</p>
              <p v-html="item.addr"></p>
            </div>
          </div>
          <img :src="item.logo" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      data: [
        {
          companyName: '成都西联软件有限公司',
          contact: '黄英',
          tel: '13541260264',
          addr: '成都高新区益州大道中段722号复地复城国际T4幢30楼3012',
          logo: require('../../assets/images/common/channelPartner2.png')
        },
        {
          companyName: '四川云创信来科技有限责任公司',
          contact: '方圆',
          tel: '17381858355',
          addr: '四川省成都市武侯区长益东三路21号5层508号',
          logo: require('../../assets/images/common/channelPartner3.png')
        },
        {
          companyName: '成都市凯德利经贸发展有限公司',
          contact: '唐光军',
          tel: '13208182423',
          addr: '成都市玉双路1号玉双大厦801室',
          logo: require('../../assets/images/common/channelPartner4.png')
        },
        {
          companyName: '广州市先讯贸易发展有限公司',
          contact: '宋祖胜',
          tel: '13798399116',
          addr: '广州办公室：广州市白云区新市齐富路归南1号名汇广场818房（510410）<br/>深圳办公室：深圳市龙岗区坂田街道大发埔社区里石排一巷20号坂田集团<br/>商务中心604室（518129）',
          logo: require('../../assets/images/common/channelPartner5.png')
        },
        {
          companyName: '上海宾匠智能科技有限公司',
          contact: '徐文锋',
          tel: '13603063377',
          addr: '上海市普陀区中江路118弄22号701室',
          logo: require('../../assets/images/common/channelPartner1.png')
        }
      ]
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
#channelPartner {
  .body {
    min-height: auto;
    .title {
      height: 42px;
      border-top: solid 1px @border;
      text-align: center;
      span {
        display: inline-block;
        font-size: 1.5rem;
        background: #fff;
        margin-top: -21px;
        padding: 0 15px;
      }
    }
    ul {
      li {
        padding: 30px 0;
        border-bottom: solid 1px @border;
        &:last-child {
          border-bottom: none;
        }
        .name {
          padding-bottom: 8px;
          .orange {
            width: 3px;
            height: 22px;
            background: @main;
            margin-right: 7px;
          }
          p {
            font-weight: bold;
          }
        }
        .info {
          p {
            line-height: 26px;
          }
        }
        img {
          width: 315px;
          height: 114px;
        }
      }
    }
  }
}
@media screen and (max-width: 767px) {
  div#channelPartner {
    .body {
      padding: 0 2rem;
      ul {
        li {
          .info {
            p {
              &:first-child {
                white-space: nowrap;
              }
            }
          }
          img {
            width: 140px;
            height: 72px;
          }
        }
      }
    }
  }
}
</style>
