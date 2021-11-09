<!--百万高清网络半球-->
<template>
  <div class="HighDefinition">
    <div class="HighDefinition_1 h700 p8">
      <div class="HighDefinition_1_text">
        <span class="fs50">{{ $t('Goods.HighDefinition.Goods_1') }}</span>
        <br />
        <div class="h15"></div>
        <span class="fs22">{{ $t('Goods.HighDefinition.Goods_1_1') }}</span>
      </div>
    </div>
    <div class="HighDefinition_2 h890 p8">
      <div class="HighDefinition_2_text">
        <span class="fs36">{{ $t('Goods.HighDefinition.Goods_2') }}</span>
        <br />
        <div class="h15"></div>
        <span class="fs22">{{ $t('Goods.HighDefinition.Goods_2_1') }}</span>
      </div>
    </div>
    <div class="HighDefinition_3 h890 p8">
      <div class="HighDefinition_2_text HighDefinition_3_text">
        <span class="fs36">{{ $t('Goods.HighDefinition.Goods_3') }}</span>
        <br />
        <div class="h15"></div>
        <span class="fs22">{{ $t('Goods.HighDefinition.Goods_3_1') }}</span>
      </div>
    </div>
    <div class="HighDefinition_4 h890 p8">
      <div class="HighDefinition_2_text">
        <span class="fs36">{{ $t('Goods.HighDefinition.Goods_4') }}</span>
        <br />
        <div class="h15"></div>
        <span class="fs22">{{ $t('Goods.HighDefinition.Goods_4_1') }}</span>
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
  .h15 {
    height: 15px;
  }
  .p8 {
    padding: 0 8%;
  }
  .HighDefinition_1 {
    background: #fff url('../../../assets/images/common/HighDefinition_1.png')
      no-repeat center center;
    .HighDefinition_1_text {
      width: 50%;
      padding-top: 15%;
      padding-left: 8%;
    }
  }
  .HighDefinition_2 {
    background: @border1
      url('../../../assets/images/common/HighDefinition_2.png') no-repeat center
      center;
  }
  .HighDefinition_3 {
    background: #272727
      url('../../../assets/images/common/HighDefinition_3.png') no-repeat center
      center;
    color: #fff;
  }
  .HighDefinition_4 {
    background: #fff url('../../../assets/images/common/HighDefinition_4.png')
      no-repeat center center;
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
