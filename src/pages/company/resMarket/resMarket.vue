<template>
  <div id="resMarket">
    <!-- search box -->
    <div class="searchBox flex">
      <el-input v-model="searchInput" :placeholder="$t('placeholder.input')" maxlength="10"></el-input>
      <el-button type="primary" @click="search" :disabled="!canSearch" style="margin-left:14px;">{{ $t('button.search') }}</el-button>
      <el-card v-show="showCard" class="box-card">
        <div v-for="(item, index) in proName" :key="index" class="cardLi" @click="getName(item)">
          {{ item }}
        </div>
      </el-card>
    </div>
    <!-- display area -->
    <el-carousel class="swiper">
      <el-carousel-item>
        <img :src="language == 'cn' ? require('../../../assets/images/resource_banner.png') : require('../../../assets/images/resource_banner_1.png')" alt="banner">
      </el-carousel-item>
      <el-carousel-item>
        <img :src="language == 'cn' ? require('../../../assets/images/resource_banner2.png') : require('../../../assets/images/resource_banner2_1.png')" alt="banner">
      </el-carousel-item>
    </el-carousel>

    <market-module ref="marketBox" :searchInput="searchInput"></market-module>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MarketModule from '@/components/marketModule'
import '../../../../static/js/jquery'
export default {
  components: { MarketModule },
  data() {
    return {
      searchInput: '',
      showCard: false,
      canSearch: true,
      isAuto: false, // 是否自动播放
      proName: [] // 卡片列表
    }
  },
  watch: {
    searchInput(val) {
      if (val === '') {
        this.showCard = false
        this.canSearch = true
      } else {
        var specialKey = '[`~!#@%$^&*()=|{}\':;,，。.\'\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“\']‘\''
        for (var i = 0; i < val.length; i++) {
          if (specialKey.indexOf(val.substr(i, 1)) != -1) {
            this.showCard = false
            this.canSearch = false
            this.$utils.$message({
              message: this.$t('placeholder.specialCode'),
              type: 'error',
              duration: 1000
            })
            return false
          } else {
            this.showCard = true
            this.canSearch = true
            this.$http.posts('getProName', '', { productName: this.searchInput })
              .then((res) => {
                let data = res.data
                if (data.length === 0) {
                  this.proName = [this.$t('common.noData')]
                } else {
                  this.proName = data
                }
              })
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['language'])
  },
  created() {
    var _this = this
    document.onkeydown = e => {
      var key // keycode
      var flag = true
      var txt = $('.cardLi').eq(0).text().trim()
      if (window.event === undefined) {
        key = e.keyCode
      } else {
        key = window.event.keyCode
      }
      // 回车(card显示时回车选中所选文字，反之搜索)
      if (key === 13) {
        if (_this.showCard) {
          if (txt !== '' && txt !== '暂无数据' && txt !== 'No Data') {
            _this.searchInput = txt
            _this.showCard = false
          }
        } else {
          _this.search()
        }
      }
      // 38:上  40:下
      if (_this.showCard) {
        // $('.cardLi').removeClass('active')
        // var upDownClickNum = $('.cardLi').length
        if ((_this.language === 'cn' && txt === '暂无数据') || (_this.language === 'en' && txt === 'No Data')) {
          flag = false
        }
        if (key === 38) {
          if (flag) {
            // if (upDownClickNum <= 1) {
            //   $('.cardLi').eq(0).addClass('active').siblings().removeClass('active')
            // } else {
            //   $('.cardLi').removeClass('active').prev().addClass('active')
            // }
            if ($('.cardLi.active').length === 0) {
              $('.cardLi:last').addClass('active')
            } else {
              $('.cardLi.active').removeClass('active').prev().addClass('active')
            }
          }
          _this.stopDefault(event) // 不阻止光标户向前移动
        } else if (key === 40) {
          if (flag) {
            // if (upDownClickNum <= 1) {
            //   $('.cardLi').eq(0).addClass('active').siblings().removeClass('active')
            // } else {
            //   $('.cardLi').removeClass('active').next().addClass('active')
            // }
            this.$nextTick(() => {
              if ($('.cardLi.active').length === 0) {
                $('.cardLi:first').addClass('active')
              } else {
                $('.cardLi.active').removeClass('active').next().addClass('active')
              }
            })
          }
          _this.stopDefault(event)
        }
        // upDownClickNum++
      }
    }
  },
  mounted() { },
  methods: {
    // 点击搜索
    search() {
      this.showCard = false
      this.$refs.marketBox.getProduct()
    },
    // 点击模糊搜索出的产品名称
    getName(item) {
      this.searchInput = item
    },
    // 阻止默认事件
    stopDefault(e) {
      if (e && e.preventDefault) {
        e.preventDefault()
      } else {
        event.returnValue = false
      }
    }
  },
  beforeDestroy() {
    document.onkeydown = null
  }
}
</script>

<style lang="less" scoped>
#resMarket {
  .searchBox {
    position: relative;
    width: 500px;
    margin: 15px auto;
  }
  .box-card {
    position: absolute;
    width: 430px;
    margin: 0 auto 10px;
    top: 40px;
    left: 0;
    z-index: 10;
    .cardLi {
      font-size: 14px;
      color: grey;
      line-height: 28px;
      &:hover {
        cursor: pointer;
      }
    }
    .active {
      background: #fff6ec;
      color: #fea53d;
    }
  }
  // 轮播图区域
  .swiper {
    margin-top: 10px;
    background: #407bee;
    img {
      width: 1366px;
      height: 300px;
      display: block;
      margin: auto;
    }
  }
}
</style>
