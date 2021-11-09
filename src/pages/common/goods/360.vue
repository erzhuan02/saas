<!--360度全景高清球机-->
<template>
  <div class="Goods360">
    <div class="goods360_f goods360H890  goods360_1 p5">
      <div class="">
        <span class="fs50">{{ $t('Goods.360.Goods_1') }}</span>
        <br class="h15">
        <span class="fs30 mt20">{{ $t('Goods.360.Goods_1_1') }}</span>
      </div>
    </div>
    <div class="goods360_e goods360H890 p5">
      <div class=" goods360_2 flex-hbvc">
        <div class="goods360_2_fz ">
          <span class="fs34">{{ $t('Goods.360.Goods_2') }}</span>
          <br>
          <div class="h15"></div>
          <span class="fs22">{{ $t('Goods.360.Goods_2_1') }}</span>
        </div>
        <img src="../../../assets/images/common/goods360_2.jpg" alt="">
      </div>
    </div>
    <div class="goods360_f goods360H890 p5">
      <div class="">
        <div class="goods360_3_t">
          <span class="fs50">{{ $t('Goods.360.Goods_3') }}</span>
          <br>
          <div class="h15"></div>
          <span class="fs22">{{ $t('Goods.360.Goods_3_1') }}</span>
        </div>
        <div class="goods360_3_b flex-hb">
          <div>
            <img src="../../../assets/images/common/goods360_3_1.jpg" alt="">
            <span class="fs30">{{ $t('Goods.360.Goods_3_2') }}</span>
          </div>
          <div>
            <img src="../../../assets/images/common/goods360_3_2.jpg" alt="">
            <span class="fs30">{{ $t('Goods.360.Goods_3_3') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="goods360_e goods360H890 p5">
      <div class="">
        <div class="goods360_3_t">
          <span class="fs44">{{ $t('Goods.360.Goods_4') }}</span>
          <br>
          <div class="h15"></div>
          <span class="fs30">{{ $t('Goods.360.Goods_4_1') }}</span>
        </div>
        <div class="goods360_3_b flex-hb">
          <div>
            <img src="../../../assets/images/common/goods360_4_1.jpg" alt="">
          </div>
          <div>
            <img src="../../../assets/images/common/goods360_4_2.jpg" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
/*@import url('');*/
@import '../../../assets/color';
.Goods360 {
  // & > div {
  //   min-width: 980px;
  // }
  .h15 {
    height: 15px;
  }
  .p5 {
    padding: 0 8%;
  }
  .goods360H950 {
    height: 950px;
  }
  .goods360H890 {
    height: 890px;
  }
  .goods360H800 {
    height: 800px;
  }
  .goods360_f {
    background: #fff;
  }
  .goods360_e {
    background: @border1;
  }
  .goods360_1 {
    width: 100%;
    overflow: hidden;
    background: #fff url('../../../assets/images/common/goods360_1.jpg')
      no-repeat top right;
    background-size: auto 75%;
    div {
      margin-top: 23%;
    }
  }
  .goods360_2 {
    text-align: right;
    padding-top: 203px;
    position: relative;
    div {
      position: relative;
      top: -80px;
      left: 20%;
      max-width: 30%;
      /*left: 0;*/
    }
    img {
      width: 60%;
    }
    .goods360_2_fz {
      text-align: left;
    }
  }
  .goods360_3_t,
  .goods360_3_b {
    text-align: center;
  }
  .goods360_3_t {
    padding-top: 119px;
  }
  .goods360_3_b {
    padding-top: 90px;
    display: flex;
    width: 80%;
    margin: 0 auto;
    div {
      /*flex: 1;*/
      width: 50%;
      img {
        width: 90%;
      }

      span {
        padding-top: 20px;
        display: block;
      }
    }
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
