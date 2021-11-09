<template>
  <div id="download">
    <div v-show="!showOp">
      <!-- :class="{banner_1:language !== 'cn'}" -->
      <div class="banner">
        <img :src="language == 'cn' ? require('../../assets/images/downloadBg.png') : require('../../assets/images/downloadBg_1.png')" alt />
      </div>
      <input type="hidden" id="downPDF" />
      <div class="downloads body">
        <div class="dowIms">
          <h3>{{ $t('download.downloadT') }}</h3>
          <div class="flex-ha imgs">
            <div>
              <a :href="language == 'cn' ? downloadurl : downloadurl_en" :download="language == 'cn' ? '六臂云产品画册.pdf' : 'Catalogue.pdf'">
                <img src="../../assets/images/dowImg.png" alt />
              </a>
              <br />
              <span>{{ $t('download.sixArams') }}</span>
            </div>
            <div>
              <a :href="language == 'cn' ? downloadurl_DG20 : downloadurl_DG20_en" :download="language == 'cn' ? '六臂云智能数据管理网关安装说明.pdf' : 'DG-20X.pdf'">
                <img src="../../assets/images/dowImg_dg200.png" alt />
              </a>
              <br />
              <span>{{ $t('download.dg20x') }}</span>
            </div>
            <!-- <div>
            <a :href="downloadurl_NVR"  download="六臂云NVR安装说明.pdf" >
              <img  src="../../assets/images/dowImg_nvr.png" alt="">
            </a>
            <br>
            <span>NVR安装说明</span>
          </div>-->
            <div>
              <a :href="language == 'cn' ? downloadurl_CAMERA : downloadurl_CAMERA_en" :download="language == 'cn' ? '六臂云像机安装说明.pdf' : 'Camera.pdf'">
                <img src="../../assets/images/dowImg_camera.png" alt />
              </a>
              <br />
              <span>{{ $t('download.camera') }}</span>
            </div>
            <div @click="handleShowOp(true)">
              <img src="../../assets/images/dowImg_protocol.png" alt />
              <br />
              <span>{{ $t('download.protocol') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <open-platform v-show="showOp" @showOp="handleShowOp"></open-platform>
  </div>
</template>

<script>
import OpenPlatform from '@/pages/common/openPlatform'// 原来的开放平台
import { mapGetters } from 'vuex'
export default {
  components: { OpenPlatform },
  data() {
    return {
      downloadurl: this.$api.downDvoProductAlbum,
      downloadurl_DG20: this.$api.downloadurl_DG20,
      downloadurl_NVR: this.$api.downloadurl_NVR,
      downloadurl_CAMERA: this.$api.downloadurl_CAMERA,
      downloadurl_en: this.$api.downDvoProductAlbum_EN,
      downloadurl_DG20_en: this.$api.downloadurl_DG20_EN,
      downloadurl_CAMERA_en: this.$api.downloadurl_CAMERA_EN,
      showOp: false
    }
  },
  computed: { ...mapGetters(['language']) },
  methods: {
    handleShowOp(isShow) {
      this.showOp = isShow
    }
  }
}
</script>

<style lang="less">
@import '../../assets/color';
#download {
  // .body {
  //   padding-bottom: 10rem;
  // }
  .banner {
    height: auto;
    img {
      width: 100%;
      height: auto;
    }
    // background: url('../../assets/images/downloadBg.png') no-repeat center/cover;
  }
  // .banner_1 {
  //   background-image: url(../../assets/images/downloadBg_1.png);
  // }
  .downloads {
    // padding-top: 75px;
    // background-color: @background;
    .dowIms {
      text-align: center;
      // width: 70%;
      margin: auto;
      h3 {
        font-size: 1.3rem;
      }
      img {
        padding: 30px 0 10px 0;
        width: 100%;
        height: auto; //兼容ie10
      }
      .imgs {
        & > div {
          width: 202px;
          max-width: 23%; //兼容ie10
        }
        & > div:not(:last-child) {
          margin-right: 1rem;
        }
      }
    }
  }
}
@media only screen and (max-width: 767px) {
  #download {
    .downloads {
      background-color: #fff;
      .dowIms {
        text-align: center;
        width: 100%;
        margin: auto;
        // h3 {
        //   font-size: 1.3rem;
        // }
        img {
          padding: 1.5rem 0 0.5rem 0;
          width: 100%;
        }
        .imgs {
          font-size: 1rem;
        }
      }
    }
  }
}
</style>
