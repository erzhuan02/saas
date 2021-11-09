<template>
  <div id="tree">
    <el-input :placeholder="$t('placeholder.shopIdOrName')" v-show="showFilter" v-model="filterText" suffix-icon="el-icon-search"></el-input>
    <div class="cutOrg">
      <img v-if="cutTreeList" src="@/assets/images/structure.png" alt="structure.png" @click="cutList('shop')">
      <img v-else src="@/assets/images/Framework.png" alt="Framework.png" @click="cutList('org')">
    </div>
    <!-- 组织架构列表 -->
    <el-tree class="filter-tree" v-loading="loadTree" :show-checkbox="showOrgCheckbox" v-if="cutTreeList" :filter-node-method="filterNode" :data="data" :props="defaultProps" node-key="id" @node-click="nodeClick" :highlight-current="highlightTree" @check="checkNode" ref="tree">
      <span class="organBox" slot-scope="{ node, data }">
        <img v-if="data.isShop == 0" src="@/assets/images/organization.png" alt="organization">
        <img v-else src="@/assets/images/store.png" alt="store" style="margin-top: 5px">
        <span class="one-txt-cut organName" :title="node.label">{{node.label}}</span>
      </span>
    </el-tree>
    <!-- 门店列表 -->
    <el-tree v-else v-loading="loadShop" class="shop-tree" :show-checkbox="showShopCheckbox" :data="allShops" :props="defaultShopProps" node-key="orgId" @node-click="nodeClick" :highlight-current="highlightTree" @check="checkNode" ref="shop">
      <span class="organBox" slot-scope="{ node, data }">
        <img src="@/assets/images/store.png" alt="store" style="margin-top: 8px !important;">
        <span class="one-txt-cut organName" :title="data.shopId + ' ' + data.orgName">{{data.shopId + ' ' + data.orgName}}</span>
      </span>
    </el-tree>
  </div>
</template>

<script>
/**
 * 目前传父的数据有：
 * @isCurrentOrg 当前是否是组织架构
 * @curData 当前被点击的节点数据
 * @checkedNodes 复选框点击时,当前所选中的所有数据
 */
export default {
  name: 'InputTree',
  data() {
    return {
      loadTree: false,
      loadShop: false,
      filterText: '',
      cutTreeList: true, // 切换至组织架构或门店列表
      data: [], // 树
      noShopData: [], // 树（不包含门店）
      allShops: [], // 所有门店
      allShops2: [], // =allShops
      shopName: '',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultShopProps: {
        label: function (data, node) {
          return data.shopId + ' ' + data.orgName
        }
      },
      highlightTree: false, // 选中(门店)高亮
      shopUuid: '', // 门店id
      isCurrentOrg: true // 当前是否组织架构
    }
  },
  props: {
    // 是否显示筛选框
    showFilter: {
      type: Boolean,
      default: false
    },
    // 是否显示组织架构的复选框
    showOrgCheckbox: {
      type: Boolean,
      default: false
    },
    // 是否显示门店列表的复选框
    showShopCheckbox: {
      type: Boolean,
      default: false
    },
    // 查询组织架构类型 1.排除门店 2.查询所有(默认)
    orgType: {
      type: Number,
      default: 2
    }
  },
  watch: {
    filterText(val) {
      if (this.isCurrentOrg) {
        // tree
        this.$refs.tree.filter(val)
      } else {
        // shops
        this.allShops = []
        if (val == '') {
          this.allShops = this.allShops2
        } else {
          this.allShops2.forEach((e, i) => {
            if (e.orgName.indexOf(val) !== -1 || e.shopId.indexOf(val) !== -1) {
              this.allShops.push(e)
            }
          })
        }
      }
    },
    // 为解决切换列表时闪过暂无数据
    loadTree(newVal, oldVal) {
      if (newVal === false) {
        this.$nextTick(() => {
          var noData = document.querySelector('#tree .filter-tree>.el-tree__empty-block')
          if (noData) { noData.style.display = 'block' }
        })
      }
    },
    loadShop(newVal, oldVal) {
      if (newVal === false) {
        this.$nextTick(() => {
          var noData = document.querySelector('#tree .shop-tree>.el-tree__empty-block')
          if (noData) { noData.style.display = 'block' }
        })
      }
    }
  },
  created() {
    this.getOrgTree()
  },
  mounted() { },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 获取组织架构
    getOrgTree() {
      this.loadTree = true
      this.$http.posts('getOrgTree', '', { orgType: this.orgType, timeout: 0 })
        .then((res) => {
          this.loadTree = false
          if (this.orgType === 2) {
            this.data = res.data || []
          } else {
            this.noShopData = res.data
          }
        }).catch((er) => {
          this.loadTree = false
        })
    },
    // 获取所有门店
    getShops() {
      this.loadShop = true
      this.$http.posts('getShops', '', '')
        .then((res) => {
          this.loadShop = false
          this.allShops = res.data
          this.allShops2 = this.allShops
        }).catch((er) => {
          this.loadShop = false
        })
    },
    // 切换树列表
    cutList(to) {
      this.shopUuid = ''
      this.cutTreeList = !this.cutTreeList
      this.filterText = ''
      if (to == 'shop') {
        this.getShops()
        this.isCurrentOrg = false
      } else {
        this.getOrgTree(2)
        this.isCurrentOrg = true
      }
      this.$emit('isCurrentOrg', this.isCurrentOrg)
      this.$emit('checkedNodes', [])
    },
    // 树节点被点击
    nodeClick(data, node, current) {
      if (data.isShop == 1) {
        if (this.cutTreeList) {
          this.shopUuid = data.id
          this.shopName = data.label
        } else {
          this.shopUuid = data.orgId
          this.shopName = data.shopId + ' ' + data.orgName
        }
        this.highlightTree = true
        this.$emit('curData', data)
      } else {
        this.highlightTree = false
        this.shopName = ''
      }
    },
    // 复选框被点击
    checkNode(val, data) {
      this.$emit('checkedNodes', data.checkedNodes)
    }
  }
}
</script>

<style lang="less">
#tree {
  .filter-tree {
    .el-tree__empty-block {
      display: none;
    }
  }
  .shop-tree {
    .el-tree__empty-block {
      display: none;
    }
  }
}
</style>
<style lang="less" scoped>
#tree {
  height: 100%;
  .cutOrg {
    margin-top: 15px;
    padding-left: 5px;
    img {
      cursor: pointer;
      width: 24px;
      height: 24px;
      margin-top: 3px;
    }
  }
  .filter-tree,
  .shop-tree {
    padding-top: 10px;
    height: calc(100% - 80px);
    overflow-y: auto;
    width: 300px;
    li {
      height: 26px;
      padding-left: 8px;
      line-height: 26px;
      img {
        width: 14px;
        height: 14px;
        margin-top: 3px;
      }
      span {
        font-size: 16px;
      }
    }
  }
}
</style>
