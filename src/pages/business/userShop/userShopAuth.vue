<template>
  <div id="userShopAuth">
    <!-- 查询 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item prop="orgId" :label="$t('account.organization')">
          <input-tree ref="orgTree" v-model="queryForm.orgId" :show-checkbox="true" :data="busiOrgTree"></input-tree>
        </el-form-item>
        <el-form-item prop="searchName" :label="$t('account.query')">
          <el-input v-model="queryForm.searchName" @keydown.enter.native="handleQuery" :placeholder="$t('placeholder.searchShop')" clearable></el-input>
        </el-form-item>
        <el-form-item prop="moduleId" :label="$t('userShop.selectProd')">
          <el-select v-model="queryForm.moduleId" :placeholder="$t('placeholder.select')" clearable>
            <el-option :label="$t('userShop.all')" :value="0"></el-option>
            <el-option v-for="item in prodList" :key="item.moduleId" :label="$t(`${item.menuNameEn}`)" :value="item.moduleId"></el-option>
            <!-- <el-option :label="$t('userShop.auth')" :value="1"></el-option>
            <el-option :label="$t('userShop.noAuth')" :value="0"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item prop="auth" :label="$t('userShop.authorizationStatus1')">
          <el-select v-model="queryForm.auth" :placeholder="$t('placeholder.select')" clearable>
            <el-option :label="$t('userShop.all')" :value="2"></el-option>
            <el-option :label="$t('userShop.auth')" :value="1"></el-option>
            <el-option :label="$t('userShop.noAuth')" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作 -->
    <div class="CRUD">
      <el-button v-if="button.authorization" type="primary" icon="el-icon-key" @click="handleDialogOpen('auth',1)">{{ $t('button.authorization') }}</el-button>
      <el-button v-if="button.deauthorization" type="primary" icon="el-icon-refresh-left" @click="handleDialogOpen('deauth',0)">{{ $t('button.deauthorization') }}</el-button>
    </div>
    <!-- 表格 v-if="showTable"-->
    <div class="result clearfix" v-loading="listLoading">
      <div class="caption">{{ $t('userShop.shopList') }}</div>
      <el-table ref="mainTable" stripe border max-height="561" :data="list" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" @sort-change="handleSortChange" highlight-current-row>
        <!-- @sort-change="handleSortChange" -->
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index" :label="$t('common.no')" width="70" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
        <el-table-column sortable="custom" prop="shopId" :label="$t('userShop.shopNo')"></el-table-column>
        <el-table-column prop="shopName" :label="$t('userShop.shopName')"></el-table-column>
        <el-table-column prop="fullAddress" :label="$t('userShop.address')" min-width="150"></el-table-column>
        <template v-for="(item,index) in moduleList">
          <!--  + `${index}` 解决选了全部又选了其他产品，布局混乱的bug -->
          <el-table-column :prop="item.moduleStr" :key="item.moduleStr + `${index}`">
            <template slot="header" slot-scope="scope">
              <el-checkbox v-model="moduleObj[item.moduleStr]">{{item.moduleName}}</el-checkbox>
              <!-- <span>({{ $t('userShop.used').replace('xxx',item.actPointNumb) }}/{{ $t('userShop.total').replace('xxx',item.pointNumb) }})</span> -->
              <span>({{ $t('userShop.used').replace('xxx',moduleList[index].actShopNumb) }}/{{ $t('userShop.total').replace('xxx',moduleList[index].shopNumb) }})</span>
            </template>
            <template slot-scope="scope">
              <span :style="{ color:scope.row[item.moduleStr] === '1'? '#2bc553' : '#535353'}">{{scope.row[item.moduleStr]=== '1'?$t('userShop.auth'):$t('userShop.noAuth') }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 授权对话框 -->
    <el-dialog :title="$t('button.authorization') + $t('userShop.authTip')" :visible.sync="authDialogVisible" :close-on-click-modal="false">
      <div class="dialogInfo"><i class="el-icon-warning"></i><span>{{ $t('message.auth') }}</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="authDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAuth('auth',1)">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 撤销授权对话框 -->
    <el-dialog :title="$t('button.deauthorization') + $t('userShop.authTip')" :visible.sync="deauthDialogVisible" :close-on-click-modal="false">
      <div class="dialogInfo"><i class="el-icon-warning"></i>
        <span v-if="deauthOnlyShop">{{ $t('message.noAuth2') }}</span>
        <span v-else>{{ $t('message.noAuth') }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deauthDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAuth('deauth',0)">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      busiOrgTree: [],
      prodList: [], // 产品option
      // 查询表单数据
      queryForm: {
        orgId: [],
        searchName: '', // 输入查询
        moduleId: '', // 产品
        auth: '' // 授权状态
      },
      realQuery: {
        sortKey: '',
        sortValue: '',

        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      }, // 当前表格的查询条件
      list: [],
      total: 0,
      selection: [],
      listLoading: false,
      // showTable: true, //

      moduleList: [], // 授权的模块列表
      moduleObj: {}, // 双向数据绑定checkbox

      authDialogVisible: false,
      deauthDialogVisible: false,
      deauthOnlyShop: false,

      button: {}
    }
  },
  computed: {
    ...mapGetters(['language']),
    ...mapGetters({ busiOrgTree1: 'busiOrgTree' }),
    // 查询验证规则
    queryFormRules() {
      return {
        searchName: [
          {
            // trigger: 'blur',
            trigger: 'change',
            message: this.$t('message.noSpecial'),
            pattern: this.$utils.reg.searchName
          }
        ]
      }
    }
  },
  watch: {
    // 修改最后一页删除的bug
    total() {
      if (this.total === (this.realQuery.pageNumber - 1) * this.realQuery.pageSize && this.total !== 0) {
        this.realQuery.pageNumber -= 1
        this.getList() // 获取列表数据
      }
    },
    // 可能刚进页面请求还没有回来，同步
    busiOrgTree1: {
      handler(newVal, oldVal) {
        this.busiOrgTree = this.busiOrgTree1
      },
      deep: true
    }
  },
  created() {
    this.init()
  },
  mounted() { },
  methods: {
    // 进入页面就发的请求
    init() {
      this.$utils.getButton(this.$route.path, 2).then(res => {
        this.button = res
      })// 按钮权限
      this.getList(true)// 获取列表数据
      // 是为了让tab切换流畅，数据非常多的的会有点卡顿。渲染树也要点时间
      setTimeout(() => {
        this.busiOrgTree = this.busiOrgTree1
      }, 0)
      // this.$store.dispatch('busiGetOrgTree', { url: 'getOrgTreeShop', orgType: 2 }).then(res => {
      //   this.busiOrgTree = res
      // })// 获取查询的组织架构
    },
    // 获取列表数据
    // type 1.企业用户 2.业务用户
    getList(isInitial) {
      this.listLoading = true
      this.$http.posts('getShopModuleList', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let content = data.content || {}
          let list = content.list || []
          this.total = content.total || 0
          this.list = list.map((item, index) => {
            var fullAddress
            var addressArr = []
            if (item.area) { addressArr.push(item.area) }
            if (item.address) { addressArr.push(item.address) }
            fullAddress = addressArr.join('-')
            return {
              ...item,
              fullAddress
            }
          })
          // console.log(this.list)
          // 动态表头 模块
          var moduleList = data.title || []
          var moduleObj = {}
          moduleList.forEach(item => {
            if (item.billingCycle === 3) {
              item.shopNumb = '-'
            }
            item.moduleStr = String(item.certNumb)
            moduleObj[item.moduleStr] = false
          })
          this.moduleList = moduleList
          this.moduleObj = moduleObj
          if (isInitial) {
            this.prodList = this.moduleList
          }
        })
        .catch(er => {
          console.log(er)
          this.listLoading = false
          this.list = []
          this.total = 0
          this.moduleList = []
        })
    },
    // 查询表单提交
    handleQuery() {
      this.$refs.queryForm.validate(valid => {
        if (valid) {
          // var queryForm = this[`queryForm${queryType}`]
          this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
          var realQuery = this.realQuery
          // var checkedNodes = this.$refs.mainCascader.getCheckedNodes()
          // realQuery.orgId = checkedNodes.map(item => item.value).join()
          realQuery.orgId = realQuery.orgId.join()
          this.getList()
        } else {
          return false
        }
      })
    },
    // 多选选中
    handleSelectionChange(val) {
      this.selection = val
    },
    // 排序
    handleSortChange(data) {
      // let sortValue, sortKey
      // console.log(data)
      if (data.order === 'ascending') {
        this.realQuery.sortValue = 'asc'
      } else if (data.order === 'descending') {
        this.realQuery.sortValue = 'desc'
      } else {
        this.realQuery.sortValue = ''
        this.realQuery.sortKey = ''
        // this.listParams = { ...this.paging, type: 2 }
        this.getList()
        return false
      }
      this.realQuery.sortKey = data.prop
      this.getList()
    },
    // 一页显示多少条
    handleSizeChange(val) {
      this.realQuery.pageSize = val
      this.getList()
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.realQuery.pageNumber = val
      this.getList()
    },
    // 授权/撤销授权 对话框打开
    handleDialogOpen(type, status) {
      if (type === 'auth' || type === 'deauth') {
        // status 0-撤销 1-授权
        // 获取选中的门店，没有选中的提示
        if (this.selection.length === 0) {
          // 提示的消息
          var selectAuth
          status === 1 ? selectAuth = this.$t('message.selectAuth') : selectAuth = this.$t('message.selectAuth1')
          this.$utils.$message({
            message: selectAuth,
            type: 'warning'
          })
          return
        }
        // 获取选中授权的模块，没有选中的提示
        // 选出true的选项
        var moduleArr = []
        for (var key in this.moduleObj) {
          if (this.moduleObj[key]) { moduleArr.push(key) }
        }
        if (moduleArr.length === 0) {
          this.$utils.$message({
            message: this.$t('message.chooseAuth'),
            type: 'warning'
          })
          return
        }
        if (type === 'deauth') {
          var onlyShop = moduleArr.length === 1 && moduleArr[0] === '3'
          var onlyAudit = moduleArr.length === 1 && moduleArr[0] === '5'
          var onlyShopAndAudit = moduleArr.length === 2 && moduleArr.find(item => item === '3') && moduleArr.find(item => item === '5')
          // console.log(onlyShop, onlyAudit, onlyShopAndAudit)
          onlyShop || onlyAudit || onlyShopAndAudit ? this.deauthOnlyShop = true : this.deauthOnlyShop = false
        }
      }
      this[`${type}DialogVisible`] = true
    },
    // 授权/撤销授权
    handleAuth(type, status) {
      // status 0-撤销 1-授权
      // 获取选中授权的模块
      var moduleArr = []
      for (var key in this.moduleObj) {
        if (this.moduleObj[key]) { moduleArr.push(key) }
      }
      let authIds = moduleArr.join()
      // 获取选中的店铺
      let ids = this.selection.map(item => item.shopUuid).join()
      this.$http.posts('updateShopStatus', {
        authStatus: status,
        authIds: authIds,
        ids: ids,
        pageNumber: this.realQuery.pageNumber
      }, '', true).then((res) => {
        this.getList()
      })
      this[`${type}DialogVisible`] = false
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#userShopAuth {
  .result {
    .el-checkbox {
      color: @text1;
      font-weight: bold;
    }
  }
}
</style>
