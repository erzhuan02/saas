<template>
  <div id="genernalAgreement" class="flex">
    <!-- list -->
    <ul v-loading="loadingList" class="hidden-xs-only">
      <li class="title">
        <h2>{{ $t('websiteAgreement') }}</h2>
      </li>
      <li :class="item.active ? 'pointer active' : 'pointer'" v-for="(item, index) in proType" :key="index" @click="getContent(item, index)">
        <p>{{ language === 'cn' ? item.nameCn : item.nameEn}}</p>
      </li>
    </ul>
    <!-- content -->
    <div class="content previewWangEd" v-loading="loadingCon">
      <h3 class="title">{{ title }}</h3>
      <div v-html="content"></div>
    </div>
    <!-- drawer -->
    <el-drawer class="mobMenu" :visible.sync="isshow" :direction="direction" :before-close="closeList">
      <div slot="title">
        <img :src="language == 'cn' ? require('../../assets/images/moblogo.png') : require('../../assets/images/moblogo_1.png')" alt />
      </div>
      <ul class="protocalList">
        <li :class="item.active ? 'pointer active' : 'pointer'" v-for="(item, index) in proType" :key="index" @click="getContent(item, index)">
          <p>{{ language === 'cn' ? item.nameCn : item.nameEn}}</p>
        </li>
      </ul>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import '../../../static/js/jquery'
export default {
  data() {
    return {
      /** id:
       *  1 迪维欧服务条款
       *  2 迪维欧隐私政策声明
       *  3 六臂云用户协议
       *  4 六臂云最终用户许可协议  // 5 六臂云平台订单协议
       *  5 六臂云开发者注册协议
       */
      id: 1,
      pro: {},
      proType: [],
      content: '',
      title: '',
      loadingList: false,
      loadingCon: false,
      direction: 'ltr', // 从左往右
      isshow: false
    }
  },
  created() {
    this.$eventBus.$on('showList', val => {
      this.isshow = val
    })
  },
  mounted() {
    this.id = this.$route.params.id || 1
    this.getProType()
  },
  computed: {
    ...mapGetters(['language', 'clientType'])
  },
  watch: {
    // '$route'(to, from) {
    //   this.id = to.params.id
    //   this.getContent(this.proType[this.id - 1], this.id - 1)
    // },
    language(val) {
      if (val) {
        this.getContent(this.pro)
      }
    }
  },
  methods: {
    // 获取协议类型列表
    getProType() {
      this.loadingList = true
      // 类型：1.查询所有协议 0.排除订单协议
      this.$http.posts1('getProType')
        .then(res => {
          this.loadingList = false
          this.proType = res.data.map((item, index) => {
            return {
              active: index === 0 ? 1 : 0,
              ...item
            }
          }) || []
          this.getContent(this.proType[this.id - 1], this.id - 1)
        })
        .catch(er => {
          this.loadingList = false
        })
    },
    // 获取协议内容
    getContent(data, index) {
      if (index !== undefined) {
        for (var i = 0; i < this.proType.length; i++) {
          if (index === i) {
            this.proType[i].active = 1
            this.$router.push({
              name: 'GenernalAgreement',
              params: {
                id: i + 1
              }
            })
          } else {
            this.proType[i].active = 0
          }
        }
      }
      this.pro = data
      this.title = this.language === 'cn' ? data.nameCn : data.nameEn
      let params = {
        typeId: data.id,
        language: this.language === 'cn' ? '1' : '2'
      }
      this.loadingCon = true
      this.$http.posts1('getProContent', params)
        .then(res => {
          this.content = res.data
          this.loadingCon = false
        })
        .catch(er => {
          this.loadingCon = false
        })
      if (this.clientType === 'mob') {
        this.isshow = false
      }
    },
    closeList() {
      this.isshow = false
    }
  }
}
</script>

<style lang="less">
@import '../../assets/color';
#genernalAgreement {
  height: 100%;
  background: #fff;
  a {
    word-wrap: break-word;
    white-space: normal;
    word-break: break-all;
  }
  ul {
    width: 30%;
    padding: 2.5% 0 2% 10%;
    overflow: auto;
    li {
      border-bottom: solid 1px @border;
      p {
        padding: 0.5rem 0;
      }
      &.title {
        line-height: 50px;
      }
      &.active {
        color: @text2;
      }
    }
  }
  div.content {
    width: 70%;
    padding: 2.5% 10% 2% 2%;
    overflow: auto;
    .title {
      margin-bottom: 25px;
      line-height: 50px;
      border-bottom: solid 1px @border;
    }
  }
}
@media only screen and (max-width: 767px) {
  #genernalAgreement {
    div.content {
      width: 100%;
      padding: 2%;
    }
  }
  .mobMenu {
    ul.protocalList {
      padding: 0.5rem 1rem;
      li {
        padding: 0.5rem;
        &.active {
          color: @text2;
        }
      }
    }
  }
}
</style>
