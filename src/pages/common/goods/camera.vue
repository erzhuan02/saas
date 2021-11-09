<!--智能高清网络摄像机 Camera-->
<template>
  <div class="HighDefinition">
    <div class="HighDefinition_1 h700 p8">
      <div class="HighDefinition_1_text">
        <span class="fs50">{{ $t('Goods.Camera.Goods_1') }}</span>
        <br />
        <div class="h15"></div>
        <span class="fs22">{{ $t('Goods.Camera.Goods_1_1') }}</span>
      </div>
    </div>
    <div :class="language == 'cn' ? 'HighDefinition_2 h890 p8' : 'HighDefinition_2_1 h890 p8'">
      <div class="HighDefinition_2_text">
        <span class="fs36">{{ $t('Goods.Camera.Goods_2') }}</span>
        <br />
        <div class="h15"></div>
        <span class="fs22">{{ $t('Goods.Camera.Goods_2_1') }}</span>
      </div>
    </div>
    <div :class="language == 'cn' ? 'HighDefinition_3 h890 p8' : 'HighDefinition_3_1 h890 p8'">
      <div class="HighDefinition_2_text HighDefinition_3_text">
        <span class="fs36">{{ $t('Goods.Camera.Goods_3') }}</span>
        <br />
        <div class="h15"></div>
        <span class="fs22">{{ $t('Goods.Camera.Goods_3_1') }}</span>
      </div>
    </div>
    <div class="HighDefinition_4 h890 p8 Camera_4">
      <div class="HighDefinition_2_text">
        <span class="fs36">{{ $t('Goods.Camera.Goods_4') }}</span>
        <br />
        <div class="h15"></div>
        <span class="fs22">{{ $t('Goods.Camera.Goods_4_1') }}</span>
      </div>
      <img :src="language == 'cn' ? require('../../../assets/images/common/Camera_4.png') : require('../../../assets/images/common/Camera_4_1.png')" alt />
    </div>
  </div>
</template>
<style lang="less" scoped>
@import '../../../assets/color';
.HighDefinition {
  // & > div {
  //   min-width: 980px;
  // }
  .h700 {
    height: 700px;
  }
  .h890 {
    height: 890px;
  }
  .h750 {
    height: 750px;
  }
  .h15 {
    height: 15px;
  }
  .p8 {
    padding: 0 8%;
  }
  .HighDefinition_1 {
    background: #fff url('../../../assets/images/common/Overlying_1.png')
      no-repeat center center;
    .HighDefinition_1_text {
      width: 50%;
      padding-top: 15%;
      padding-left: 8%;
    }
  }
  .HighDefinition_2 {
    background: @border1 url('../../../assets/images/common/Camera_2.png')
      no-repeat center center;
  }
  .HighDefinition_2_1 {
    background: @border1 url('../../../assets/images/common/Camera_2_1.png')
      no-repeat center center;
  }
  .HighDefinition_3 {
    background: #272727 url('../../../assets/images/common/Camera_3.png')
      no-repeat center center;
    color: #fff;
  }
  .HighDefinition_3_1 {
    background: #272727 url('../../../assets/images/common/Camera_3_1.png')
      no-repeat center center;
    color: #fff;
  }
  .HighDefinition_4 {
    background: #fff;
    .DG201_3_bottom {
      padding-top: 8%;
      ul {
        display: flex;
        li {
          width: 18%;
          img {
            width: 100%;
          }
        }
      }
    }
  }
  .HighDefinition_2_text {
    width: 50%;
    margin: 0 auto;
    text-align: center;
    padding-top: 7%;
  }
  .Overlying_2_text {
    padding-top: 15%;
  }
  .HighDefinition_3_text {
    padding-top: 5%;
  }
  .Camera_4 {
    text-align: center;
    img {
      margin-top: 5%;
      width: 45%;
    }
  }
}
@media only screen and (max-width: 767px) {
  .fs50 {
    font-size: 2.5rem !important;
  }
  .fs22 {
    font-size: 1.2rem !important;
  }
  .HighDefinition {
    & > div {
      min-width: 100%;
      width: 100%;
    }
    .h700 {
      height: 30rem;
    }
    .h890 {
      height: 35rem;
    }
    .h750 {
      height: 30rem;
    }
    .h15 {
      height: 0.75rem;
    }
    .p8 {
      padding: 0px 0px;
    }
    .fs36 {
      font-size: 1.8rem;
    }
    .HighDefinition_1 {
      background: #fff url('../../../assets/images/common/Overlying_1_mob.png')
        no-repeat no-repeat center 13rem;
      background-size: 80%;

      .HighDefinition_1_text {
        width: 70%;
        padding-top: 15%;
        padding-left: 0px;
        margin: 0 auto;
        text-align: center;
      }
    }
    .HighDefinition_2 {
      background: @border1 url('../../../assets/images/common/Camera_2.png')
        no-repeat center center;
      background-size: 150%;
    }
    .HighDefinition_2_1 {
      background: @border1 url('../../../assets/images/common/Camera_2_1.png')
        no-repeat -8rem center;
      background-size: 135%;
    }
    .HighDefinition_3 {
      background: #272727 url('../../../assets/images/common/Camera_3.png')
        no-repeat top center;
      background-size: 180%;
      color: #fff;
    }
    .HighDefinition_3_1 {
      background: #272727 url('../../../assets/images/common/Camera_3_1.png')
        no-repeat top center;
      background-size: 180%;
      color: #fff;
    }
    .HighDefinition_2_text {
      width: 70%;
      margin: 0 auto;
      text-align: center;
      padding-top: 7%;
    }
    .Overlying_2_text {
      padding-top: 15%;
    }
    .HighDefinition_3_text {
      padding-top: 5%;
    }
    .Camera_4 {
      text-align: center;
      img {
        margin-top: 5%;
        width: 85%;
      }
    }
  }
}
</style>
<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  components: {},
  computed: {
    ...mapGetters(['language'])
  },
  beforeCreate: function () {
    // console.group('beforeCreate 创建前状态===============》');
  },
  created: function () {
    // console.group('created 创建完毕状态 初始化===============》');
  },
  beforeMount: function () {
    // console.group('beforeMount 挂载前状态===============》');
  },
  mounted: function () {
    // console.group('mounted 挂载结束状态===============》');
  },
  beforeUpdate: function () {
    // console.group('beforeUpdate 更新前状态===============》');
  },
  methods: {}
}
</script>
