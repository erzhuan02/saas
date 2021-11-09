<template>
  <div id="successfulCase">
    <!-- :class="{banner_1:language !== 'cn'}" -->
    <div class="banner">
      <img :src="language === 'cn' ? require('../../../assets/images/successCaseBg.png') : require('../../../assets/images/successCaseBg_1.png')" alt="">
      <!-- <div>
        <p>SUCCESSFUL CASE</p>
        <p>成功案例</p>
      </div> -->
    </div>
    <div class="tabsBox body">
      <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane :label="$t('tabs.Retail')" name="supermarket">
          <ul class="list">
            <li class="listItem">
              <router-link class="flex-hbvc" :to="{ path:'/successfulCase/sanjiang' }">
                <img src="../../../assets/images/demos/sanjiang.png" alt="">
                <div class="infoText">
                  <h3 class="one-txt-cut">{{ $t('case.sanjiang') }}</h3>
                  <span class="two-txt-cut">{{ $t('case.sanjiang2') }}</span>
                </div>
              </router-link>
            </li>
            <li class="listItem">
              <router-link class="flex-hbvc" :to="{ path:'/successfulCase/lvdi' }">
                <img src="../../../assets/images/demos/ludi1.png" alt="">
                <div class="infoText">
                  <h3 class="one-txt-cut">{{ $t('case.lvdi') }}</h3>
                  <span class="two-txt-cut">{{ $t('case.lvdi2') }}</span>
                </div>
              </router-link>
            </li>
            <li class="listItem">
              <router-link class="flex-hbvc" :to="{ path:'/successfulCase/rtMart' }">
                <img src="../../../assets/images/demos/rtMart.png" alt="">
                <div class="infoText">
                  <h3 class="one-txt-cut">{{ $t('case.rtMartSub') }}</h3>
                  <span class="two-txt-cut">{{ $t('case.rtMart1') }}</span>
                </div>
              </router-link>
            </li>
          </ul>
          <div class="business listItem">
            <ul class="flex-w">
              <li>
                <img src="../../../assets/images/demos/darufa.png" alt="">
              </li>
              <li>
                <img src="../../../assets/images/demos/hejiafu.png" alt="">
              </li>
              <li>
                <img src="../../../assets/images/demos/xishiduo.png" alt="">
              </li>
              <li>
                <img src="../../../assets/images/demos/ludi.png" alt="">
              </li>
              <li>
                <img src="../../../assets/images/demos/sanjiang1.png" alt="">
              </li>
              <li>
                <img src="../../../assets/images/demos/oushang.png" alt="">
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('tabs.Catering')" name="beverage">
          <ul class="list">
            <li class="listItem">
              <router-link class="flex-hbvc" :to="{ path:'/successfulCase/dicos' }">
                <img src="../../../assets/images/demos/dicos.png" alt="">
                <div class="infoText">
                  <h3 class="one-txt-cut">{{ $t('case.dicosSub') }}</h3>
                  <span class="two-txt-cut">{{ $t('case.dicos1') }}</span>
                </div>
              </router-link>
            </li>
            <li class="listItem">
              <router-link class="flex-hbvc" :to="{ path:'/successfulCase/dingxin' }">
                <img src="../../../assets/images/demos/dingxin.png" alt="">
                <div class="infoText">
                  <h3 class="one-txt-cut">{{ $t('case.dingxinSub') }}</h3>
                  <span class="two-txt-cut">{{ $t('case.dingxin1') }}</span>
                </div>
              </router-link>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane :label="$t('tabs.Warehouse')" name="depot">
          <ul class="list">
            <li class="listItem">
              <router-link class="flex-hbvc" :to="{ path:'/successfulCase/dingshi' }">
                <img src="../../../assets/images/demos/dingshi.png" alt="">
                <div class="infoText">
                  <h3 class="one-txt-cut">{{ $t('case.dingshi') }}</h3>
                  <span class="two-txt-cut">{{ $t('case.dingshi1') }}</span>
                </div>
              </router-link>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane :label="$t('tabs.Logistics')" name="car">
          <ul class="list">
            <li class="listItem">
              <router-link class="flex-hbvc" :to="{ path:'/successfulCase/visual' }">
                <img src="../../../assets/images/demos/visual.png" alt="">
                <div class="infoText">
                  <h3 class="one-txt-cut">{{ $t('case.visual') }}</h3>
                  <span class="two-txt-cut">{{ $t('case.visual1') }}</span>
                </div>
              </router-link>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane :label="$t('tabs.Factory')" name="factory">
          <ul class="list">
            <li class="listItem">
              <router-link class="flex-hbvc" :to="{ path:'/successfulCase/srsFace' }">
                <img src="../../../assets/images/demos/srsFace.png" alt="">
                <div class="infoText">
                  <h3 class="one-txt-cut">{{ $t('case.guangda') }}</h3>
                  <span class="two-txt-cut">{{ $t('case.guangda1') }}</span>
                </div>
              </router-link>
            </li>
          </ul>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--</div>-->
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
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!from.path.startsWith('/successfulCase')) {
        vm.activeName = 'supermarket'
      }
    })
  },
  computed: {
    ...mapGetters(['language'])
  },
  methods: {}
}
</script>

<style lang="less">
@import '../../../assets/color';
#successfulCase {
  .banner {
    // background: url('../../assets/images/successCaseBg.png') 100% 100% no-repeat;
    height: auto;
    img {
      width: 100%;
      height: auto;
    }
  }
  .tabsBox {
    .el-tabs__item {
      width: 20%;
    }
    .business {
      background: #fff;
      ul {
        border-top: 1px solid @border1;
        border-left: 1px solid @border1;
        li {
          width: 33.33333%;
          border-bottom: 1px solid @border1;
          border-right: 1px solid @border1;
          img {
            width: 100%;
            height: auto;
          }
        }
      }
    }
  }
}
@media only screen and (max-width: 767px) {
  #successfulCase {
    background-color: @background;
  }
}
</style>
