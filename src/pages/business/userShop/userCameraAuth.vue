<template>
  <div id="userCameraAuth">
    <!-- 查询 -->
    <div class="queryForm">
      <el-form ref="queryForm" :model="queryForm" :rules="queryFormRules" inline label-width="auto">
        <el-form-item prop="orgId" :label="$t('account.organization')">
          <input-tree ref="orgTree" v-model="queryForm.orgId" :show-checkbox="true" :data="busiOrgTree"></input-tree>
        </el-form-item>
        <!-- <el-form-item prop="orgId" :label="$t('account.organization')">
          <el-cascader ref="mainCascader" v-model="queryForm.orgId" :options="busiOrgTree" :props="{ value: 'id', multiple: true }" :placeholder="$t('placeholder.select')" clearable collapse-tags></el-cascader>
        </el-form-item> -->
        <el-form-item prop="searchName" :label="$t('account.query')">
          <el-input v-model="queryForm.searchName" @keydown.enter.native="handleQuery" :placeholder="$t('placeholder.searchShop')" clearable></el-input>
        </el-form-item>
        <el-form-item prop="sysIdx" :label="$t('userShop.selectProd')">
          <el-select v-model="queryForm.sysIdx" :placeholder="$t('placeholder.select')" clearable>
            <el-option :label="$t('userShop.all')" value="0"></el-option>
            <el-option v-for="item in prodList" :key="item.moduleId" :label="$t(`${item.menuNameEn}`)" :value="item.moduleStr"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="cmrStatus" :label="$t('userShop.deviceStatus')">
          <el-select v-model="queryForm.cmrStatus" :placeholder="$t('placeholder.select')" clearable>
            <el-option :label="$t('userShop.all')" :value="-1"></el-option>
            <el-option :label="$t('userShop.online')" :value="1"></el-option>
            <el-option :label="$t('userShop.offline')" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="term" :label="$t('userShop.authorizationStatus1')">
          <el-select v-model="queryForm.term" :placeholder="$t('placeholder.select')" clearable>
            <el-option :label="$t('userShop.all')" :value="2"></el-option>
            <el-option :label="$t('userShop.auth')" :value="1"></el-option>
            <el-option :label="$t('userShop.noAuth')" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item prop="term" :label="$t('userShop.condition')">
          <el-select v-model="queryForm.term" :placeholder="$t('placeholder.select')" clearable>
            <el-option :label="$t('userShop.all')" :value="2"></el-option>
            <el-option :label="$t('userShop.auth')" :value="1"></el-option>
            <el-option :label="$t('userShop.noAuth')" :value="0"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label=" ">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作 -->
    <div class="CRUD">
      <el-button v-if="button.authCamera" type="primary" icon="el-icon-key" @click="handleDialogOpen('auth',1)">{{ $t('button.authorization') }}</el-button>
      <el-button v-if="button.deAuthCamera" type="primary" icon="el-icon-refresh-left" @click="handleDialogOpen('deauth',0)">{{ $t('button.deauthorization') }}</el-button>
    </div>
    <!-- 结果 -->
    <div class="result clearfix" v-loading="listLoading">
      <div class="caption">{{ $t('userShop.cameraList') }}</div>
      <el-table ref="mainTable" stripe border max-height="560" :data="list" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" highlight-current-row>
        <!-- @sort-change="handleSortChange" :span-method="objectSpanMethod"-->
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index" :label="$t('common.no')" width="70" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
        <el-table-column prop="shopNo" :label="$t('userShop.shopNo')"></el-table-column>
        <el-table-column prop="shopName" :label="$t('userShop.shopName')"></el-table-column>
        <el-table-column prop="cmrName" :label="$t('userShop.cameraName')"></el-table-column>
        <el-table-column prop="cmrIP" :label="$t('userShop.cameraIp')"></el-table-column>
        <el-table-column :label="$t('userShop.cameraStatus')">
          <span slot-scope="scope" :style="{color: scope.row.IsOnline ? '#2bc553' : '#ff5722'}">
            {{scope.row.IsOnline ? $t('userShop.online') : $t('userShop.offline') }}
          </span>
        </el-table-column>
        <el-table-column v-if="button.previewCamera" :label="$t('button.preview')" width="80">
          <i slot-scope="scope" class="el-icon-video-play" @click="handleDialogOpen('preview',scope.row)" :style="{color: scope.row.IsOnline ? '#fea53d' : '#b7b7b9','font-size':'26px'}"></i>
        </el-table-column>
        <el-table-column prop="fullAddress" :label="$t('userShop.shopAddress')" min-width="160"></el-table-column>
        <template v-for="(item, index) in moduleList">
          <el-table-column :prop="item.moduleStr" :key="item.moduleStr + `${index}`">
            <!-- 解决表头不能动态渲染的问题 -->
            <!-- 1.slot-scope="scope" 动态数据不可缺少，静态无所谓 -->
            <template slot="header" slot-scope="scope">
              <el-checkbox v-model="moduleObj[item.moduleStr]">{{item.moduleName}}</el-checkbox>
              <!-- <span>({{item.actPointNumb}}/{{item.pointNumb}})</span> 2.不可,要写从data中直接取-->
              <span>({{ $t('userShop.used').replace('xxx',moduleList[index].actPointNumb) }}/{{ $t('userShop.total').replace('xxx',moduleList[index].pointNumb) }})</span>
            </template>
            <template slot-scope="scope">
              <span :style="{color: scope.row[item.moduleStr] === '1' ? '#2bc553' : '#535353'}">
                {{scope.row[item.moduleStr] === '1'? $t('userShop.auth'): $t('userShop.noAuth') }}
              </span>
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
      <div class="dialogInfo"><i class="el-icon-warning"></i><span>{{ $t('message.auth1') }}</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="authDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAuth('auth',1)">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 撤销授权对话框 -->
    <el-dialog :title="$t('button.deauthorization') + $t('userShop.authTip')" :visible.sync="deauthDialogVisible" :close-on-click-modal="false">
      <div class="dialogInfo"><i class="el-icon-warning"></i><span>{{ $t('message.noAuth1') }}</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deauthDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAuth('deauth',0)">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 预览对话框 -->
    <el-dialog class="videoDialog" :title="$t('button.preview')" :visible.sync="previewDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('preview')">
      <div class="video">
        <h3>{{previewForm.cmrName}}</h3>
        <v-player ref="player" @duration-ended="handleDurationEnded" style="margin: 20px 0"></v-player>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      busiOrgTree: [],
      prodList: [], // 产品列表
      // 查询表单数据
      queryForm: {
        orgId: [],
        searchName: '', // 店名或店号
        sysIdx: '', // 产品
        cmrStatus: '', // 设备状态
        term: '', // ??

        moduleId: ''// 模块id，后台用
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
      // showTable: true,

      moduleList: [], // 授权的模块列表
      moduleObj: {}, // 双向数据绑定checkbox

      authDialogVisible: false,
      deauthDialogVisible: false,

      previewDialogVisible: false,
      previewForm: {},

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
    // getSpanArr (data) {
    //   console.log('getSpanArr', data)
    //   this.spanArr = []
    //   this.pos = 0
    //   for (var i = 0; i < data.length; i++) {
    //     if (i === 0) {
    //       this.spanArr.push(1)
    //       this.pos = 0
    //     } else {
    //       // 判断当前元素与上一个元素是否相同
    //       if (data[i].fullAddress === data[i - 1].fullAddress) {
    //         this.spanArr[this.pos] += 1
    //         this.spanArr.push(0)
    //       } else {
    //         this.spanArr.push(1)
    //         this.pos = i
    //       }
    //     }
    //     console.log(this.spanArr)
    //   }
    // },
    // objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
    //   if (columnIndex === 2 || columnIndex === 3) {
    //     const row1 = this.spanArr[rowIndex]
    //     const col1 = row1 > 0 ? 1 : 0
    //     console.log(`rowspan:${row1} colspan:${col1}`)
    //     return {
    //       rowspan: row1,
    //       colspan: col1
    //     }
    //   }
    // },
    // 进入页面就发的请求
    init() {
      this.$utils.getButton(this.$route.path, 2).then(res => {
        this.button = res
      }) // 按钮权限
      this.getList(true) // 获取列表数据
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
      this.$http.posts('getCameraModuleList', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let content = data.Data || {}
          let list = content.List || []
          this.total = content.Total || 0
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
          // 动态表头 模块
          var moduleList = content.title || []
          var moduleObj = {}
          moduleList.forEach(item => {
            if (item.billingCycle === 3) {
              item.pointNumb = '-'
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
          this.realQuery = { ...this.realQuery, ...this.queryForm, pageNumber: 1, pageSize: 10 }
          var realQuery = this.realQuery
          realQuery.orgId = realQuery.orgId.join()
          // 再传moduleId
          if (!realQuery.sysIdx) {
            // 全部的时候
            realQuery.moduleId = 0
          } else {
            var oneItem = this.prodList.find(item => realQuery.sysIdx === item.moduleStr)
            realQuery.moduleId = oneItem && oneItem.moduleId
          }
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
    // 新增/修改/详情/删除对话框打开
    handleDialogOpen(type, row) {
      if (type === 'auth' || type === 'deauth') {
        // status 0-撤销 1-授权
        var status = row
        // 获取选中的门店，没有选中的提示
        if (this.selection.length === 0) {
          // 提示的消息
          var selectAuth
          status === 1 ? selectAuth = this.$t('message.selectAuth2') : selectAuth = this.$t('message.selectAuth3')
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
      } else if (type === 'preview') {
        // subStream 0高清 1普通
        this.previewForm = { ...row, subStream: 1 }
        if (!this.previewForm.cmrUUID) {
          this.$utils.$message({
            message: this.$t('message.noCamera'),
            type: 'error'
          })
          return
        }
        var { cmrIP: cmrIp, cmrUUID: cmrUuid, subStream } = this.previewForm
        var cameraData = { cmrIp, cmrUuid, subStream }
        this.$http.posts('getRealTimeVideo', cameraData).then(res => {
          this.previewDialogVisible = true
          this.$nextTick(() => {
            this.$refs.player.create(res.data, cameraData)
          })
        })
      }
      if (type !== 'preview') {
        this[`${type}DialogVisible`] = true
      }
    },
    // 授权/撤销授权
    handleAuth(type, status) {
      // status 0-撤销 1-授权
      // 获取选中授权的模块
      var moduleArr = []
      var realmodule = []
      for (var key in this.moduleObj) {
        if (this.moduleObj[key]) {
          moduleArr.push(key)
          var oneItem = this.moduleList.find(item => key === String(item.certNumb))
          var innermoduleId = oneItem && oneItem.moduleId
          realmodule.push(innermoduleId)
        }
      }
      let authIds = moduleArr.join()
      this.$http.posts('updateCameraStatus', {
        authStatus: status,
        authIds: authIds,
        req: this.selection,
        moduleIds: realmodule.join()
      }, '', true)
        .then(res => {
          this.getList()
        })
        .catch(er => {
          if (typeof res === 'object') { this.getList() }
        })
      this[`${type}DialogVisible`] = false
    },
    // 视频默认时长播放完毕
    handleDurationEnded() {
      this.previewDialogVisible = false
    },
    // 新增/修改/详情/删除对话框关闭,重置表单
    handleDialogClose(type) {
      if (type === 'preview') {
        this.$refs.player.destroy(true)
        this.previewForm = {}
      }
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#userCameraAuth {
  .queryForm {
    .el-form-item:not(:last-child) .el-form-item__content {
      width: 215px;
    }
  }
  .result {
    // min-height: 300px;
    .el-checkbox {
      color: @text1;
      font-weight: bold;
    }
  }
}
</style>
