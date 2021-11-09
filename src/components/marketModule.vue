<template>
  <div id="marketModule">
    <!-- pay product -->
    <div class="paied" v-show="payProduct.length > 0">
      <div class="flex titleBox">
        <h3>{{ $t('resource.myResource') }}</h3>
      </div>
      <ul class="produceCard">
        <li v-for="(item, index) in payProduct" :key="'product_'+index">
          <div class="up flex">
            <!-- <p class="image" v-if="item.logoUrl == '/'">{{ $t('common.noImg') }}</p> -->
            <img :src="item.logoUrl" alt="">
            <div class="infor">
              <div class="flex-hb infor_up">
                <p class="name">
                  {{ item.productName }}
                  <span v-show="item.billingCycle !== 3" v-if="item.isLate == 0">({{ $t('resource.running') }})</span>
                  <span v-show="item.billingCycle !== 3" v-else style="color:#f00">({{ $t('resource.outage') }})</span>
                </p>
                <!-- productType 1系统 2用户 -->
                <div class="attent" v-if="item.billingCycle == 1">
                  <div v-if="item.pointPrice > 0 || item.shopPrice > 0">
                    <p v-if="item.pointPrice > 0">
                      ￥{{ item.pointPrice }}<span>{{ $t('resource.pointMonth') }}</span>
                    </p>
                    <p v-if="item.shopPrice > 0">
                      ￥{{ item.shopPrice }}<span>{{ $t('resource.shopMonth') }}</span>
                    </p>
                  </div>
                  <p v-else style="color:#f00">{{ $t('common.noPrice') }}</p>
                </div>
                <div class="attent" v-if="item.billingCycle == 2">
                  <p v-if="item.userPrice > 0">￥{{ item.userPrice }}<span>{{ $t('resource.anMonth') }}</span></p>
                  <p v-else style="color:#f00">{{ $t('common.noPrice') }}</p>
                </div>
                <div class="attent" v-if="item.billingCycle == 3">
                  <p v-if="item.trafficPrice > 0">￥{{ item.trafficPrice }}<span>/GB</span></p>
                  <p v-else style="color:#f00">{{ $t('common.noPrice') }}</p>
                </div>
              </div>
              <div class="flex-hb infor_dow">
                <p :title="item.feature" class="one-txt-cut">{{ item.feature }}</p>
              </div>
            </div>
          </div>
          <div class="fot">
            <div v-if="item.billingCycle === 3" class="flex-hb">
              <!-- isLate是否禁用 0.永久 1.禁用 -->
              <template>
                <p class="deadline" v-if="item.isLate == 0">{{ $t('order.cycle') }}：{{ $t('order.permanent') }}</p>
                <p v-else class="deadline warn">{{ $t('order.cycle') }}：{{ $t('resource.disabled') }}</p>
              </template>
              <span class="postpaid">{{ $t('order.postpaid') }}</span>
            </div>
            <div v-else class="flex-hb">
              <!-- isLate是否过期 0.否 1.是 -->
              <template>
                <p v-if="item.isLate == 0" class="deadline">{{ $t('order.cycle') }}：{{ item.startTime }} - {{ item.validityPeriod }}</p>
                <p v-else class="deadline warn">{{ item.productName }}{{ $t('resource.dued') }} ({{ item.startTime }} - {{ item.validityPeriod }})</p>
              </template>
              <el-button class="renew" @click="renewal(item, 2)">{{ $t('resource.renew') }}</el-button>
            </div>
          </div>
          <div class="odr one-txt-cut">
            {{ $t('order.orderNum') }}：{{item.orderId}}
          </div>
          <span v-if="item.isLate == 1 && item.billingCycle !== 3" class="delete el-icon-error pointer" @click="openDelDialog(item)"></span>
        </li>
      </ul>
    </div>
    <!-- recommend product -->
    <div class="paied" v-show="recommendProduct.length > 0">
      <div class="flex titleBox">
        <h3>{{ $t('resource.recom') }}</h3>
      </div>
      <ul class="commandCard flex-w">
        <li v-for="(item, index) in recommendProduct" :key="'recom_'+index">
          <div class="co-Info">
            <div class="pic">
              <img :src="item.logoUrl" alt="">
              <p class="productName">{{ item.productName }}</p>
              <p class="delt one-txt-cut" :title="item.feature" style="-webkit-box-orient: vertical;box-orient: vertical;">{{ item.feature }}</p>
            </div>
            <div class="flex-hb purchase">
              <p class="title">{{ item.productName }}</p>
              <el-button @click="renewal(item, 1)">{{ $t('resource.toBuy') }}</el-button>
            </div>
          </div>
          <div class="co-price flex-hb">
            <div v-if="item.billingCycle == 1">
              <div v-if="item.pointPrice > 0 || item.shopPrice > 0">
                <p v-if="item.pointPrice > 0">
                  ￥{{ item.pointPrice }}<span>{{ $t('resource.pointMonth') }}</span>
                </p>
                <p v-if="item.shopPrice > 0">
                  ￥{{ item.shopPrice }}<span>{{ $t('resource.shopMonth') }}</span>
                </p>
              </div>
              <p v-else style="color:#f00">{{ $t('common.noPrice') }}</p>
            </div>
            <div v-if="item.billingCycle == 2">
              <p v-if="item.userPrice > 0">￥{{ item.userPrice }}<span>{{ $t('resource.anMonth') }}</span></p>
              <p v-else style="color:#f00">{{ $t('common.noPrice') }}</p>
            </div>
            <div v-if="item.billingCycle == 3">
              <p v-if="item.trafficPrice > 0">￥{{ item.trafficPrice }}<span>/GB</span></p>
              <p v-else style="color:#f00">{{ $t('common.noPrice') }}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- hard-software product -->
    <div class="paied" v-show="hardwareProduct.length > 0">
      <div class="flex titleBox">
        <h3>{{ $t('resource.hardware') }}</h3>
      </div>
      <ul class="commandCard flex-w">
        <li v-for="(item, index) in hardwareProduct" :key="'recom_'+index">
          <div class="co-Info">
            <div class="pic">
              <img :src="item.logoUrl" alt="" class="hardSoftProImg">
              <p>{{ item.productName }}</p>
            </div>
            <p class="description" :title="item.description">*{{ item.description }}</p>
            <p class="delt1" style="-webkit-box-orient: vertical;box-orient: vertical;">{{ item.feature }}</p>
          </div>
          <div class="co-price flex-hb">
            <p v-if="item.pointPrice !== -1">
              ￥{{ item.pointPrice }}<span>{{ $t('resource.platMonth') }}</span>
            </p>
            <el-button @click="renewal(item, 3)">{{ $t('resource.toBuy') }}</el-button>
          </div>
        </li>
      </ul>
    </div>
    <!-- 删除 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false">
      <span>{{ $t('resource.isDel') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="deleteLateProd">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      payProduct: [],
      recommendProduct: [],
      hardwareProduct: [], // 配套硬件产品

      delData: {},
      deleteDialogVisible: false
    }
  },
  mounted() {
    this.getProduct()
  },
  props: ['searchInput'],
  methods: {
    getProduct() {
      this.$http.posts('searchProduct', '', { productName: this.searchInput || '' })
        .then((res) => {
          let data = res.data
          data.payProduct.forEach(item => {
            var logoUrl = item.logoUrl.replace('/basicplatform', '')
            item.logoUrl = this.$api.staticUrl + logoUrl
          })
          data.recommendProduct.forEach(item => {
            var logoUrl = item.logoUrl.replace('/basicplatform', '')
            item.logoUrl = this.$api.staticUrl + logoUrl
          })
          data.hardwareProduct.forEach(item => {
            var logoUrl = item.logoUrl.replace('/basicplatform', '')
            item.logoUrl = this.$api.staticUrl + logoUrl
          })
          this.payProduct = data.payProduct
          this.recommendProduct = data.recommendProduct
          this.hardwareProduct = data.hardwareProduct
        })
    },
    // 点击立即续费/购买 type：1购买 2续费 3硬件
    renewal(item, type) {
      if (
        (item.billingCycle == 1 && item.pointPrice == -1 && item.shopPrice == -1) ||
        (item.productType == 2 && item.userPrice == -1) ||
        (item.billingCycle == 3 && item.trafficPrice == -1)
      ) {
        this.$utils.$message({
          type: 'warning',
          message: this.$t('setting.notOpen')
        })
        return
      }
      sessionStorage.setItem('GOODS_MES', JSON.stringify(item))
      sessionStorage.setItem('joinOrder', 0)
      if (type == 1) {
        this.$router.push({
          path: '/goodsDetail',
          query: {
            type: type
          }
        })
      } else if (type == 2) {
        sessionStorage.setItem('renewOrderId', item.orderId)
        this.$router.push('/renew')
      } else {
        this.$router.push('/goodsDetailHard')
      }
    },
    openDelDialog(data) {
      this.delData = data
      this.deleteDialogVisible = true
    },
    // 删除已过期产品
    deleteLateProd() {
      this.$http.posts('deleteBackOrder', '', { orderId: this.delData.orderId }, true)
        .then((res) => {
          this.deleteDialogVisible = false
          this.getProduct()
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../assets/color';
#marketModule {
  // 已购买
  .paied {
    margin: 30px 0;
  }
  .titleBox {
    border-left: solid 4px @main;
    padding-left: 13px;
    line-height: 30px;
  }
  .produceCard {
    width: 100%;
    height: auto;
    overflow: hidden;
    li {
      // width: 360px;
      height: auto;
      border: solid 1px @border1;
      margin: 10px 0 10px 20px;
      float: left;
      position: relative;
      padding-top: 5px;
      .up {
        img {
          width: 80px;
          height: 80px;
          margin: 8px 0 0 8px;
        }
        p.image {
          width: 88px;
          line-height: 88px;
          text-align: center;
          font-size: 12px;
          border-radius: 5px;
          background: #d3dce6;
        }
        .infor {
          // width: 270px;
          .infor_up {
            padding: 17px 5px 10px 0;
            p.name {
              width: 180px;
              font-weight: bold;
              span {
                color: @main;
                font-weight: normal;
              }
            }
            .attent {
              color: #f00;
              span {
                font-size: 12px;
                color: @text;
              }
            }
          }
          .infor_dow {
            padding-right: 5px;
            p {
              font-size: 12px;
              max-width: 230px;
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
      }
      .fot {
        border-top: solid 1px #efeff0;
        margin: 0 12px;
        p.deadline {
          font-size: 12px;
          line-height: 40px;
          &.warn {
            color: #f00;
          }
        }
        .renew {
          width: 65px;
          height: 30px;
          background: #388cff;
          color: #fff;
          border-radius: 5px;
          font-size: 12px;
          padding: 0;
          margin: 4px 0;
        }
        .postpaid {
          font-size: 12px;
          line-height: 40px;
          font-weight: bold;
        }
      }
      .odr {
        line-height: 30px;
        background: #f6f6f6;
        font-size: 12px;
        padding-left: 12px;
      }
      .delete {
        position: absolute;
        right: 5px;
        top: 5px;
        color: @text6;
        font-size: 18px;
        &:hover {
          color: @main;
        }
      }
    }
  }
  .commandCard {
    li {
      width: 280px;
      height: 295px;
      margin: 20px;
      box-shadow: 2px 2px 14px #e7e7e8;
      .co-Info {
        min-height: 245px;
        padding: 0 20px;
        .pic {
          img {
            width: 116px;
            height: 116px;
            display: block;
            margin: 10px auto 0;
            &.hardSoftProImg {
              width: 139px;
              height: 103px;
            }
          }
          p {
            font-weight: bold;
            text-align: center;
            padding: 20px 0;
            border-bottom: solid 1px #efeff0;
            &.productName {
              border-bottom: none;
              padding: 10px 0;
            }
            &.delt {
              font-size: 12px;
              border-bottom: solid 1px #efeff0;
              padding: 0 0 10px 0;
              font-weight: normal;
            }
          }
        }
        .purchase {
          p.title {
            line-height: 58px;
          }
          button {
            width: 70px;
            height: 30px;
            margin-top: 16px;
            background: @main;
            color: #fff;
            font-size: 12px;
            padding: 0;
          }
        }
        .description {
          color: @main;
          padding: 10px 0;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        .delt1 {
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .co-price {
        height: 50px;
        background: #f5f5f5;
        padding: 0 15px;
        p {
          font-size: 16px;
          color: #f00;
          line-height: 50px;
          span {
            font-size: 12px;
            color: @text;
          }
          &:hover {
            cursor: pointer;
          }
        }
        button {
          width: 70px;
          height: 30px;
          margin-top: 12px;
          background: @main;
          color: #fff;
          font-size: 12px;
          padding: 0;
        }
      }
    }
  }
}
</style>
