<template>
  <div id="areaCamera">
    <el-container>
      <el-aside style="width:300px;">
        <tree :showFilter="true" @isCurrentOrg="isChangeTree" @curData="curData">
        </tree>
      </el-aside>
      <el-main>
        <!-- 操作 -->
        <div class="queryForm">
          <el-form ref="areaQuery" :model="areaQuery" inline label-width="auto">
            <el-form-item prop="searchName" :label="$t('area.nameOrIP')">
              <el-input v-model="areaQuery.search" @keydown.enter.native="handleQuery" :placeholder="$t('placeholder.channelOrIP')" clearable></el-input>
            </el-form-item>
            <el-form-item prop="term" :label="$t('area.filter')">
              <el-select v-model="areaQuery.areaIds" :placeholder="$t('order.all')" clearable filterable>
                <el-option v-for="item in areaQuery.areaList" :key="item.id" :label="item.areaName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" icon="el-icon-search" @click="handleQuery">{{ $t('button.query') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="CRUD">
          <el-button type="primary" v-if="button.addTo" icon="el-icon-plus" @click="handleDialogOpen('add')" :disabled="selection.length === 0">{{ $t('button.addTo') }}</el-button>
          <el-button type="primary" v-if="button.clear" icon="el-icon-close" @click="handleDialogOpen('clear')" :disabled="selection.length === 0">{{ $t('button.clearAreaCamera') }}</el-button>
        </div>
        <!-- 表格 -->
        <div class="result clearfix" v-loading="listLoading">
          <el-table ref="table" stripe border max-height="500" :data="list" @selection-change="handleSelectionChange" highlight-current-row>
            <el-table-column :label="shopName + $t('area.cameraTableHead')">
              <el-table-column type="selection" width="60"></el-table-column>
              <el-table-column type="index" :label="$t('common.no')" width="80" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
              <el-table-column prop="cmrName" :label="$t('area.cameraName')"></el-table-column>
              <el-table-column prop="cmrIP" :label="$t('area.cameraIp')"></el-table-column>
              <el-table-column prop="state" width="120" :label="$t('area.cameraStatus')">
                <template slot-scope="scope">
                  <span v-if="scope.row.state === 1" style="color: rgb(0, 255, 0)">在线</span>
                  <span v-if="scope.row.state === 0">离线</span>
                </template>
              </el-table-column>
              <el-table-column prop="areaName" :label="$t('area.homeArea')"></el-table-column>
              <el-table-column :label="$t('common.operation')" width="120">
                <template slot-scope="scope">
                  <el-button size="mini" type="primary" icon="el-icon-view" plain @click="preview(scope.row)">{{ $t('button.preview') }}</el-button>
                </template>
              </el-table-column>
            </el-table-column>
          </el-table>
          <div class="currentTotal">
            {{ $t('common.currentPage') }} {{ list.length }}
            {{ $t('common.unit') }}
          </div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
        </div>
        <!-- 添加至对话框 -->
        <el-dialog class="max10char" :title="$t('area.selectArea')" :visible.sync="addDialogVisible" :close-on-click-modal="false">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ $t('common.selectAll') }}</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group class="max10char" v-model="addAreas" @change="handleCheckedAreaChange">
            <el-checkbox v-for="item in areaQuery.areaList" :label="item.id" :key="item.id" :title="item.areaName">{{item.areaName}}</el-checkbox>
          </el-checkbox-group>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="addOrClear('add')" :disabled="clickflag">{{ $t('button.confirm') }}</el-button>
          </div>
        </el-dialog>
        <!-- 清空区域对话框 -->
        <el-dialog :title="$t('button.clearAreaCamera')" :visible.sync="clearDialogVisible" :close-on-click-modal="false">
          <span>{{ $t('dialog.clearAreaCamera') }}</span>
          <div slot="footer" class="dialog-footer">
            <el-button @click="clearDialogVisible = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="addOrClear('clear')">{{ $t('button.confirm') }}</el-button>
          </div>
        </el-dialog>
        <!-- 预览对话框 -->
        <el-dialog class="videoDialog" :title="$t('button.preview')" :visible.sync="previewDialogVisible" :close-on-click-modal="false" @closed="dialogClose">
          <div class="video">
            <h3>{{curCamera.cmrName}}</h3>
            <v-player ref="player" @duration-ended="handleDurationEnded" style="margin: 20px 0"></v-player>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Tree from '../../../components/tree'
import $utils from '@/utils'
import '../../../../static/js/jquery'
export default {
  components: { Tree },
  data() {
    return {
      disabledPlayer: false,
      areaQuery: {
        areaList: [],
        shopUuid: '',
        search: '',
        areaIds: ''
      },
      realQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      list: [],
      total: 0,
      selection: [],
      listLoading: false,
      addDialogVisible: false,
      clearDialogVisible: false,
      previewDialogVisible: false,
      checkAll: false,
      addAreas: [],
      isIndeterminate: false,
      // src: '',
      curCamera: {}, // 当前相机数据

      shopName: '',
      isCurrentOrg: true, // 当前是否组织架构
      highlightTree: false, // 选中(门店)高亮
      clickflag: false
    }
  },
  watch: {
    // 修改最后一页删除的bug
    total() {
      if (
        this.total ===
        (this.realQuery.pageNumber - 1) * this.realQuery.pageSize &&
        this.total !== 0
      ) {
        this.realQuery.pageNumber -= 1
        this.getList() // 获取列表数据
      }
    },
    isCurrentOrg(val) {
      this.areaQuery.shopUuid = ''
      this.areaQuery.search = ''
      this.areaQuery.areaIds = ''
      this.shopName = ''
      this.list = []
      this.total = 0
    }
  },
  mounted() {
    this.getArea()
  },
  props: ['button'],
  methods: {
    // 点击查询
    handleQuery() {
      if (this.areaQuery.shopUuid === '') {
        this.$utils.$message({
          message: this.$t('message.noShopId'),
          type: 'error'
        })
        return
      }
      this.realQuery = { ...this.realQuery, ...this.areaQuery, pageNumber: 1, pageSize: 10 }
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.$http.posts('cameraAreaList', this.realQuery)
        .then(res => {
          this.listLoading = false
          let data = res.data
          let list = data.list || []
          this.total = data.total || 0
          this.list = list
        })
        .catch(er => {
          this.listLoading = false
          this.list = []
          this.total = 0
        })
    },
    // 获取区域(筛选)
    getArea() {
      this.$http.posts('allArea')
        .then(res => {
          this.areaQuery.areaList = res.data || []
        })
    },
    isChangeTree(data) {
      this.isCurrentOrg = data
    },
    curData(data) {
      if (data.isShop === 1) {
        if (this.isCurrentOrg) {
          this.shopName = data.label
          this.areaQuery.shopUuid = data.id
        } else {
          this.shopName = data.shopId + ' ' + data.orgName
          this.areaQuery.shopUuid = data.orgId
        }
        this.handleQuery()
      } else {
        this.shopName = ''
      }
    },
    // 添加至/清空相机
    addOrClear(type) {
      if (type === 'add' && this.addAreas.length === 0) {
        this.$utils.$message({
          message: this.$t('message.selectArea'),
          type: 'error'
        })
        return
      }
      this.clickflag = true
      let cameraAreaList = []
      this.selection.forEach(item => {
        cameraAreaList.push({
          cmrIP: item.cmrIP,
          serialNum: item.serialNum
        })
      })
      let params = {
        shopUuid: this.areaQuery.shopUuid,
        cameraAreaList
      }
      if (type === 'add') {
        params = { ...params, type: 1, ids: this.addAreas.join(',') }
      } else {
        params = { ...params, type: 2, ids: this.areaQuery.areaIds }
      }
      this.$http.posts('updateCameraArea', params, '', true)
        .then(res => {
          this[`${type}DialogVisible`] = false
          setTimeout(() => {
            this.clickflag = false
          }, 400)
          this.getList()
        }).catch(er => {
          this.clickflag = false
        })
    },
    // 预览
    preview: $utils.debounce(function (data) {
      this.curCamera = { ...data, subStream: 1 }
      if (!data.cmrUUID) {
        this.$utils.$message({
          message: this.$t('message.noCamera'),
          type: 'error'
        })
        return
      }
      var { cmrIP: cmrIp, cmrUUID: cmrUuid, subStream } = this.curCamera
      var cameraData = { cmrIp, cmrUuid, subStream }
      this.$http.posts('getRealTimeVideo', cameraData).then(res => {
        this.previewDialogVisible = true
        this.$nextTick(() => {
          this.$refs.player.create(res.data, cameraData)
        })
      })
    }),
    // 视频默认时长播放完毕
    handleDurationEnded() {
      this.previewDialogVisible = false
    },
    // 弹窗关闭
    dialogClose() {
      this.$refs.player.destroy(true)
    },
    // 复选框-全选
    handleCheckAllChange(val) {
      let arr = []
      this.areaQuery.areaList.forEach(item => {
        arr.push(item.id)
      })
      this.addAreas = val ? arr : []
      this.isIndeterminate = false
    },
    // 复选框-多选
    handleCheckedAreaChange(value) {
      this.addAreas = value
      let checkedCount = value.length
      this.checkAll = checkedCount === this.areaQuery.areaList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.areaQuery.areaList.length
    },
    // 对话框打开
    handleDialogOpen(type) {
      if (type === 'add') {
        this.clickflag = false
        // 保留之前所属区域的记录，多个则同时保留
        let arr = []
        this.selection.forEach(item => {
          arr.push(item.cmrIP)
        })
        this.$http.posts('cmrIpChecked', '', { cmrIps: arr.join(',') })
          .then(res => {
            this.addAreas = res.data
            if (this.addAreas.length === 0) {
              this.checkAll = false
              this.isIndeterminate = false
            } else if (this.addAreas.length === this.areaQuery.areaList.length) {
              this.checkAll = true
              this.isIndeterminate = false
            } else {
              this.checkAll = false
              this.isIndeterminate = true
            }
          })
          .catch(er => {
            this.checkAll = false
            this.isIndeterminate = false
          })
        // let arr = []
        // let newArr = []
        // let areaName = []
        // this.selection.forEach(item => {
        //   arr.push(item.areaName)
        // })
        // arr.forEach(item => {
        //   if (item) {
        //     item = item.split(',')
        //     item.forEach(ele => {
        //       newArr.push(ele)
        //     })
        //   }
        // })
        // newArr.forEach(item => {
        //   if (areaName.indexOf(item) < 0) {
        //     areaName.push(item)
        //   }
        // })
        // areaName.forEach(item => {
        //   this.areaQuery.areaList.forEach(ele => {
        //     if (item && item === ele.areaName) {
        //       ids.push(ele.id)
        //     }
        //   })
        // })
      }
      this[`${type}DialogVisible`] = true
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
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color.less';
#areaCamera {
  .queryForm {
    .el-form-item:not(:last-child) .el-form-item__content {
      width: 245px;
    }
  }
  section {
    height: calc(100vh - 128px);
    aside {
      padding: 10px 10px 10px 2px;
      height: 100%;
      border-right: solid 1px @border1;
      overflow: hidden;
      position: relative;
    }
  }
  .el-main {
    padding: 0 0 0 8px;
  }
}
</style>
