<!--DG-201智能数据管理网关-->
<template>
  <div class="DG201">
    <div class="bgf p5 H890">
      <div class="pb100">
        <div class="DG201_1">
          <div>
            <span class="fs50">{{ $t('Goods.DG201.Goods_1') }}</span>
            <br />
            <div class="h15"></div>
            <span class="fs22">{{ $t('Goods.DG201.Goods_1_1') }}</span>
          </div>
          <img width="40%" src="../../../assets/images/common/DG201_1.jpg" alt />
        </div>
      </div>
    </div>
    <div class="DG201_2 H890 p5">
      <div class>
        <div class="DG201_2_top">
          <span class="fs50">{{ $t('Goods.DG201.Goods_2') }}</span>
          <br />
          <div class="h15"></div>
          <span class="fs22">{{ $t('Goods.DG201.Goods_2_1') }}</span>
        </div>
        <div class="DG201_2_bottom">
          <ul class="flex-hb">
            <li>
              <img src="../../../assets/images/common/NVR.png" alt />
              <div class="h15"></div>
              <span class="fs22">{{ $t('Goods.DG201.Goods_2_2') }}</span>
            </li>
            <li>
              <img src="../../../assets/images/common/IPC.png" alt />
              <div class="h15"></div>
              <span class="fs22">{{ $t('Goods.DG201.Goods_2_3') }}</span>
            </li>
            <li>
              <img src="../../../assets/images/common/pos.png" alt />
              <div class="h15"></div>
              <span class="fs22">{{ $t('Goods.DG201.Goods_2_4') }}</span>
            </li>
            <li>
              <img src="../../../assets/images/common/pp.png" alt />
              <div class="h15"></div>
              <span class="fs22">{{ $t('Goods.DG201.Goods_2_5') }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="DG201_3 H890 bgf p5">
      <div class>
        <div class="DG201_3_top">
          <span class="fs50">{{ $t('Goods.DG201.Goods_3') }}</span>
          <br />
          <div class="h15"></div>
          <span class="fs22">{{ $t('Goods.DG201.Goods_3_1') }}</span>
          <br />
          <span class="fs22">{{ $t('Goods.DG201.Goods_3_2') }}</span>
          <br />
          <span class="fs22" style="color: #fea53d">{{ $t('Goods.DG201.Goods_3_3') }}</span>
        </div>
        <div class="DG201_3_bottom">
          <ul class="flex-hb">
            <li>
              <img src="../../../assets/images/common/DG201_3_1.png" alt />
            </li>
            <li>
              <img src="../../../assets/images/common/DG201_3_2.png" alt />
            </li>
            <li>
              <img src="../../../assets/images/common/DG201_3_3.png" alt />
            </li>
            <li>
              <img src="../../../assets/images/common/DG201_3_4.png" alt />
            </li>
            <li>
              <img src="../../../assets/images/common/DG201_3_5.png" alt />
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="DG201_3 DG201_4 bge p5">
      <div class>
        <div class="DG201_3_top DG201_4_top">
          <span class="fs50">{{ $t('Goods.DG201.Goods_4') }}</span>
          <br />
          <div class="h15"></div>
          <div class="fs22">{{ $t('Goods.DG201.Goods_4_1') }}</div>
          <div class="fs22">{{ $t('Goods.DG201.Goods_4_2') }}</div>
        </div>
        <img width="60%" src="../../../assets/images/common/DG201_4.jpg" alt />
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.DG201 {
  text-align: center;
  // & > div {
  //   min-width: 980px;
  // }
  .h1200 {
    height: 1200px;
  }
  .p5 {
    padding: 0 8%;
  }
  .h15 {
    height: 15px;
  }
  .H890 {
    height: 890px;
  }
  .DG201_1 {
    text-align: center;
    padding-top: 80px;
    img {
      margin-top: 80px;
    }
  }
  .DG201_2 {
    text-align: center;
    color: #fff;
    background: url('../../../assets/images/common/DG201_2.jpg') no-repeat;
    .DG201_2_top {
      padding-top: 200px;
    }
    .DG201_2_bottom {
      width: 80%;
      margin: 0 auto;
      padding-top: 8%;
      li {
        width: 25%;
      }
      img {
        width: 70%;
        height: auto;
      }
    }
  }
  .DG201_3 {
    text-align: center;
    padding-bottom: 200px;
    .DG201_3_top {
      padding-top: 170px;
    }
    .DG201_3_bottom {
      padding-top: 90px;
      ul {
        display: flex;
        li {
          width: 20%;
          img {
            width: 70%;
            height: auto;
          }
        }
      }
    }
    .DG201_4_top {
      padding-bottom: 140px;
    }
  }
  .DG201_4 {
    padding-bottom: 150px;
  }
}
@media only screen and (max-width: 767px) {
  .fs50 {
    font-size: 2.5rem !important;
  }
  .fs22 {
    font-size: 1.2rem !important;
  }
  .DG201 {
    text-align: center;
    & > div {
      min-width: 100%;
      width: 100%;
    }
    .h1200 {
      height: 60rem;
    }
    .p5 {
      padding: 0px 0px;
    }
    .h15 {
      height: 0.75rem;
    }

    .H890 {
      height: 30rem;
    }
    .DG201_1 {
      text-align: center;
      padding-top: 4rem;
      img {
        margin-top: 4rem;
      }
    }
    .DG201_2 {
      .DG201_2_top {
        padding-top: 6rem;
      }
    }
    .DG201_3 {
      .DG201_3_top {
        padding-top: 7rem;
      }
      .DG201_3_bottom {
        padding-top: 4.5rem;
        ul {
          display: flex;
          li {
            width: 20%;
            img {
              width: 85%;
            }
          }
        }
      }
      .DG201_4_top {
        padding-bottom: 5rem;
      }
    }
    .DG201_4 {
      padding: 0 2rem;
      padding-bottom: 5rem;
      img {
        width: 80%;
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
