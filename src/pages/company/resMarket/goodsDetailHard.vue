<template>
  <div id="goodsDetailHard" class="flex">
    <div class="left">
      <!-- 面包屑导航 -->
      <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/resMarket' }">{{ $t('home.nav81') }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ goods.productName }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="brief flex">
        <!-- 图 -->
        <p class="image" v-if="goods.logoUrl == '/'">{{ $t('common.noImg') }}</p>
        <p class="image" v-else>
          <img :src="goods.logoUrl" />
        </p>
        <div class="bBox">
          <!-- 标题及副标题 -->
          <div class="flex">
            <p class="name" :title="goods.productName">{{ goods.productName }}</p>
            <button class="pointer" @click="openDialog">{{ $t('resource.toBuy') }}</button>
          </div>
          <p class="intro">{{ goods.introduction }}</p>
          <!-- 关键字 -->
          <div class="keywords flex">
            <div v-for="(item, index) in keywords" :key="index">{{ item }}</div>
          </div>
          <!-- 规格 -->
          <p class="gg">{{ $t('order.specification') }}：{{ goods.description }}</p>
        </div>
      </div>
      <!-- 7天无理由退换 -->
      <div class="promise flex">
        <p class="flex">
          <img src="@/assets/images/7days.png" alt="7days.png">
          {{ $t('order.mes9') }}
        </p>
        <p class="flex">
          <img src="@/assets/images/heart.png" alt="heart.png">
          {{ $t('order.mes10') }}
        </p>
      </div>
      <!-- 详情 -->
      <div class="details">
        <el-tabs v-model="activeName">
          <el-tab-pane :label="$t('order.goodsDetails')" name="first">
            <img :src="this.imgUrl[0]" />
          </el-tab-pane>
          <el-tab-pane :label="$t('order.detailsParam')" name="second">
            <img :src="this.imgUrl[1]" />
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 对话框 -->
      <el-dialog class="hardDetailDialogForm" :title="$t('resource.toBuy')" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <p>{{ $t('order.tips11') }}</p>
        <p>{{ $t('order.tips2') }}: 021-6451 8711 {{ $t('order.tips0') }} 150</p>
        <el-form ref="dialogForm" :model="dialogForm" :rules="rules">
          <el-form-item :label="$t('login.product')" prop="productId">
            <el-select v-model="dialogForm.productId" :placeholder="$t('placeholder.select') + $t('placeholder.softMes')">
              <el-option v-for="item in options" :key="item.productId" :label="item.productName" :value="item.productId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('order.mesContent')" prop="content">
            <el-input type="textarea" :rows="3" :placeholder="$t('order.message2')" maxlength="200" v-model.trim="dialogForm.content">
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('common.name')" prop="userName">
            <el-input v-model="dialogForm.userName" :placeholder="$t('placeholder.input') + $t('common.name')" maxlength="30"></el-input>
          </el-form-item>
          <el-form-item :label="$t('common.phone')" prop="phoneNumb">
            <div class="phoneNumber flex-hb">
              <el-select v-model="phonePrefix" filterable :placeholder="$t('placeholder.select')" class="prefix">
                <el-option v-for="(item,index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-input v-model.trim="dialogForm.phoneNumb" :placeholder="$t('placeholder.input') + $t('common.phone')" maxlength="11" class="phone"></el-input>
            </div>
          </el-form-item>
          <el-form-item :label="$t('common.companyName')" prop="companyName">
            <el-input v-model="dialogForm.companyName" :placeholder="$t('placeholder.input') + $t('common.companyName')" maxlength="128"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ $t('button.cancel') }}</el-button>
          <el-button type="primary" @click="toMes('dialogForm')">{{ $t('button.send') }}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $utils from '@/utils'
export default {
  data() {
    return {
      goods: {},
      menuItem: [],
      activeName: 'first',
      keywords: [],
      imgUrl: [],
      dialogForm: {
        productId: '',
        content: '',
        userName: '',
        phoneNumb: '',
        companyName: '',
        sourceId: 1, // 1.硬件产品购买 2.购买问题咨询 3.产品功能咨询 4.申请体验
        type: 1 // 1.普通留言 2.协议申请留言
      },
      phonePrefix: '86',
      prefixOptions: [],
      dialogFormVisible: false,
      options: []
    }
  },
  created() {
    this.goods = JSON.parse(sessionStorage.getItem('GOODS_MES'))
    this.keywords = this.goods.keywords.split(';')
    var imgUrl = this.goods.details.split(',')
    imgUrl.forEach(item => {
      item = this.$api.staticUrl + '/static/itemLogo/' + item
      this.imgUrl.push(item)
    })
  },
  mounted() {
    if (this.language == 'cn') {
      this.prefixOptions = this.$utils.formatPrefixCN()
    } else if (this.language == 'en') {
      this.prefixOptions = this.$utils.formatPrefixEN()
    }
    // 强制给左侧导航加class保持高亮
    this.$nextTick(() => {
      this.menuItem = document.getElementsByClassName('el-menu-item')
      for (let i of this.menuItem) {
        if (i.innerText == '资源市场' || i.innerText == 'Resource Market') {
          i.classList.add('is-active')
        }
      }
      // 页面置顶
      let container = document.getElementsByClassName('el-main')[0]
      container.scrollTop = 0
    })
  },
  watch: {
    language(val) {
      if (val == 'cn') {
        this.prefixOptions = this.$utils.formatPrefixCN()
      }
      if (val == 'en') {
        this.prefixOptions = this.$utils.formatPrefixEN()
      }
    }
  },
  computed: {
    ...mapGetters(['language']),
    rules() {
      const rules = {
        productId: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '') {
                callback(new Error(this.$t('placeholder.select') + this.$t('placeholder.softMes')))
              }
              callback()
            }
          }
        ],
        content: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '') {
                callback(new Error(this.$t('placeholder.input') + this.$t('order.mesContent')))
              }
              callback()
            }
          }
        ],
        userName: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              var newVal = this.$utils.trim(value)
              if (newVal === '') {
                callback(new Error(this.$t('common.noEmpty')))
              } else {
                // eslint-disable-next-line
                this.dialogForm.userName = newVal
                callback()
              }
            }
          }
        ],
        phoneNumb: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (value == '') {
                callback(new Error(this.$t('common.plzRight') + this.$t('common.phone')))
              } else {
                var phoneNORegA = this.$utils.reg.phoneNoA
                var phoneNORegC = this.$utils.reg.phoneNoC1
                var phoneNORegC1 = this.$utils.reg.phoneNoC2
                if (!phoneNORegA.test(value)) {
                  callback(new Error(this.$t('message.inputRight')))
                } else {
                  let reg = (this.phonePrefix === '86' && !phoneNORegC.test(value)) ||
                    (this.phonePrefix === '886' && !phoneNORegC1.test(value))
                  if (reg) {
                    callback(new Error(this.$t('message.inputRight')))
                  } else {
                    callback()
                  }
                }
              }
            }
          }
        ],
        companyName: [
          {
            required: true,
            trigger: 'blur',
            pattern: this.$utils.reg.companyName,
            validator: this.$utils.validator.common
          }
        ]
        // companyName: [
        //   {
        //     required: true,
        //     trigger: 'blur',
        //     validator: (rule, value, callback) => {
        //       var newVal = this.$utils.trim(value)
        //       if (newVal === '') {
        //         callback(new Error(this.$t('common.noEmpty')))
        //       } else {
        //         // eslint-disable-next-line
        //         this.dialogForm.companyName = newVal
        //         callback()
        //       }
        //     }
        //   }
        // ]
      }
      return rules
    }
  },
  methods: {
    // 获取产品数据
    getProductData() {
      // type: 1 软件 2 门店用户许可证 3.硬件
      this.$http.posts1('getProductData', { type: 3 }).then(res => {
        this.options = res.data
      })
    },
    // 留言发送
    toMes: $utils.debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.posts('addCoLeaveAuth', this.dialogForm, '', true)
            .then(res => {
              this.dialogFormVisible = false
            })
        } else {
          return false
        }
      })
    }),
    // 点立即购买
    openDialog() {
      this.getProductData()
      this.dialogFormVisible = true
      if (this.$refs['dialogForm']) {
        this.$refs['dialogForm'].resetFields()
      }
    }
  },
  beforeDestroy() {
    for (let i of this.menuItem) {
      if (i.innerText == '资源市场' || i.innerText == 'Resource Market') {
        i.classList.remove('is-active')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color.less';
#goodsDetailHard {
  padding: 0 !important;
  .left {
    width: 100%;
    margin: auto;
    & > div {
      padding: 0 5% !important;
      &.breadcrumb {
        padding: 20px 5% 0 !important;
      }
    }
    .brief {
      height: auto;
      margin: 30px 0 40px 0;
      .image {
        width: 188px;
        height: 188px;
        background-color: @background;
        text-align: center;
        line-height: 188px;
        border-radius: 5px;
        img {
          width: 149px;
          height: 113px;
          margin-top: 36px;
        }
      }
      .bBox {
        width: calc(100% - 200px);
        padding-left: 10px;
        .name {
          font-weight: bold;
          font-size: 20px;
          padding-top: 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        button {
          margin: 8px 0 0 25px;
          width: 130px;
          height: 30px;
          color: #fff;
          background: #f00;
          border-radius: 5px;
        }
        .intro {
          padding-top: 10px;
        }
        .keywords {
          margin-top: 10px;
          div {
            background: @main;
            line-height: 26px;
            color: #fff;
            margin-left: 20px;
            font-size: 14px;
            padding: 0 10px;
            border-radius: 5px;
            &:first-child {
              margin-left: 0px;
            }
          }
        }
        .gg {
          font-size: 12px;
          line-height: 40px;
        }
      }
    }
    .promise {
      height: 60px;
      border-top: solid 1px @background;
      width: 72%;
      margin: auto;
      padding: 0 !important;
      p {
        color: #f00;
        font-weight: bold;
        line-height: 60px;
        &:nth-child(2) {
          margin-left: 20px;
        }
      }
      img {
        width: 34px;
        height: 34px;
        margin: 12px 6px 0 0;
      }
    }
    .details {
      border-top: solid 15px @background;
      padding: 15px 0;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .hardDetailDialogForm {
      p {
        font-size: 16px;
        line-height: 36px;
      }
      .phoneNumber {
        width: 100%;
        .prefix {
          width: 35% !important;
        }
        .phone {
          width: 61%;
        }
      }
    }
  }
}
</style>
