<!--sanjiang-->
<template>
  <div id="news1" class="coDetails">
    <div class="body">
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/news' }">{{ $t('loginFooter.companyNews') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('button.details') }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="bodyContent">
        <div class="newsContent">
          <h3>@{{ $t('news.news1') }}</h3>
          <div class="text">
            <div class="h10"></div>
            <span>
              {{ $t('news.news1_1') }}
            </span>
            <div class="h10"></div>
            <span>{{ $t('news.news1_2') }}</span>
            <img :src="language == 'cn' ? require('../../../assets/images/common/news1.png') : require('../../../assets/images/common/news1_1.png')" alt="">
            <span>{{ $t('news.news1_3') }}</span>
            <div class="h10"></div>
            <span>
              {{ $t('news.news1_4') }}
            </span>
            <img src="../../../assets/images/common/news2.png" alt="">
            <span>{{ $t('news.news1_5') }}</span>
            <img :src="language == 'cn' ? require('../../../assets/images/common/news3.png') : require('../../../assets/images/common/news3_1.png')" alt="">
            <span>{{ $t('news.news1_6') }}</span>
            <img :src="language == 'cn' ? require('../../../assets/images/common/news4.png') : require('../../../assets/images/common/news4_1.png')" alt="">
            <span>{{ $t('news.news1_7') }}</span>
            <img :src="language == 'cn' ? require('../../../assets/images/common/news5.png') : require('../../../assets/images/common/news5_1.png')" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['language'])
  }
}
</script>

<style lang="less" scoped >
#news1 {
}
</style>
