<!--嵌入式 NVR-->
<template>
  <div class="HighDefinition">
    <div class="HighDefinition_1 h700 p8">
      <div class="HighDefinition_1_text NVR_1_text">
        <span class="fs50">{{ $t('Goods.NVR.Goods_1') }}</span>
        <br>
        <div class="h15"></div>
        <span class="fs22">{{ $t('Goods.NVR.Goods_1_1') }}</span>
      </div>
    </div>
    <div class="HighDefinition_2 h700 p8">
      <div class="HighDefinition_2_text">
        <span class="fs36">{{ $t('Goods.NVR.Goods_2') }}</span>
        <br>
        <div class="h15"></div>
        <span class="fs22" style="color: #04a1ff;">{{ $t('Goods.NVR.Goods_2_1') }}</span>
      </div>
    </div>
    <div class="HighDefinition_3 h890 p8">
      <div class="HighDefinition_2_text HighDefinition_3_text">
        <span class="fs36">{{ $t('Goods.NVR.Goods_3') }}</span>
        <br>
        <div class="h15"></div>
        <div class="fs22">{{ $t('Goods.NVR.Goods_3_1') }}</div>
        <div class="fs22">{{ $t('Goods.NVR.Goods_3_2') }}</div>
      </div>
    </div>
    <div class="HighDefinition_4 h650 p8">
      <div class="HighDefinition_2_text">
        <span class="fs36">{{ $t('Goods.NVR.Goods_4') }}</span>
        <br>
        <div class="h15"></div>
        <span class="fs22">{{ $t('Goods.NVR.Goods_4_1') }}</span>
      </div>
      <div class="NVR_4_img">
        <ul class="flex-hb">
          <li>
            <span class="fs22" style="color: #029cff;">{{ $t('Goods.NVR.Goods_4_2') }}</span>
            <img src="../../../assets/images/common/4lu.png" alt="">
          </li>
          <li>
            <span class="fs22" style="color: #029cff;">{{ $t('Goods.NVR.Goods_4_3') }}</span>
            <img src="../../../assets/images/common/8lu.png" alt="">
          </li>
          <li>
            <span class="fs22" style="color: #029cff;">{{ $t('Goods.NVR.Goods_4_4') }}</span>
            <img src="../../../assets/images/common/16lu.png" alt="">
          </li>
        </ul>
      </div>
    </div>
    <div class="HighDefinition_4 NVR_5 h650 p8">
      <div class="HighDefinition_2_text">
        <span class="fs36">{{ $t('Goods.NVR.Goods_5') }}</span>
        <br>
        <div class="h15"></div>
        <span class="fs22">{{ $t('Goods.NVR.Goods_5_1') }}</span>
      </div>
      <div class="NVR_5_bottom">
        <ul class="flex-hb">
          <li>
            <img src="../../../assets/images/common/DG201_3_1.png" alt="">
          </li>
          <li>
            <img src="../../../assets/images/common/DG201_3_2.png" alt="">
          </li>
          <li>
            <img src="../../../assets/images/common/DG201_3_3.png" alt="">
          </li>
          <li>
            <img src="../../../assets/images/common/DG201_3_4.png" alt="">
          </li>
          <li>
            <img src="../../../assets/images/common/DG201_3_5.png" alt="">
          </li>
        </ul>
      </div>
      <div>
      </div>
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
  .h650 {
    height: 650px;
  }
  .h15 {
    height: 15px;
  }
  .p8 {
    padding: 0 8%;
  }
  .HighDefinition_1 {
    background: #fff url('../../../assets/images/common/NVR_01.png') no-repeat
      center center;
    .HighDefinition_1_text {
      width: 50%;
      padding-top: 15%;
      padding-left: 8%;
    }
    .NVR_1_text {
      padding-left: 20%;
      padding-top: 20%;
    }
  }
  .HighDefinition_2 {
    background: #272e3c url('../../../assets/images/common/NVR_02.png')
      no-repeat center center;
    color: #fff;
  }
  .HighDefinition_3 {
    background: @background url('../../../assets/images/common/NVR_03.png')
      no-repeat center center;
    /*color: #fff;*/
  }
  .HighDefinition_4 {
    background: #ffffff;
    .NVR_4_img {
      width: 70%;
      margin: 0 auto;
      text-align: center;
      padding-top: 10%;
      img {
        width: 90%;
      }
    }
    /*background:#fff  url("../../../assets/images/common/Infrared_4.png") no-repeat center center;*/
  }
  .NVR_5 {
    background: @background;
  }
  .HighDefinition_2_text {
    width: 50%;
    margin: 0 auto;
    text-align: center;
    padding-top: 7%;
  }
  .HighDefinition_3_text {
    padding-top: 5%;
  }
  .NVR_5_bottom {
    width: 80%;
    margin: 0 auto;
    padding-top: 10%;
  }
}
</style>
<script>
export default {
  data() {
    return {}
  },
  components: {},
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
