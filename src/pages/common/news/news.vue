<template>
  <div id="news">
    <div class="banner flex-hcvc">
      <p>{{ $t('loginFooter.news') }}</p>
    </div>
    <div class="tabsBox body">
      <div class="tabs">
        <ul class="list">
          <li class="listItem">
            <router-link class="flex-hbvc" :to="{ path:'/news/news1' }">
              <img :src="language == 'cn' ? require('../../../assets/images/common/news4.png') : require('../../../assets/images/common/news4_1.png')" alt="">
              <div class="infoText">
                <h3 class="one-txt-cut">{{ $t('news.news1') }}</h3>
                <span class="two-txt-cut">{{ $t('news.news1_2') }}</span>
              </div>
              <!-- <img class="hidden-sm-and-up" :src="language == 'cn' ? require('../../../assets/images/common/news4.png') : require('../../../assets/images/common/news4_1.png')" alt=""> -->
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      activeName: 'supermarket'
    }
  },
  created() { },
  computed: {
    ...mapGetters(['language'])
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
@import '../../../assets/css/compatibility.less';
#news {
  .banner {
    background: url('../../../assets/images/common/news_1.png') no-repeat
      center/cover;
    // background: url('../../../assets/images/common/news_1.png') 100% 100% no-repeat;
  }
}
@media screen and (max-width: 767px) {
  div#news {
    background-color: @background;
    .banner {
      height: 10.5rem;
      p {
        font-size: 2rem;
      }
      span {
        font-size: 1.3rem;
      }
    }
    .listItem {
      margin-top: 0;
    }
  }
}
</style>
