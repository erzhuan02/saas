<template>
  <div id="areaShop">
    <!-- 操作 -->
    <div class="CRUD">
      <el-button type="primary" v-if="button.add" icon="el-icon-plus" @click="handleDialogOpen('add')">{{ $t('button.newArea') }}</el-button>
      <el-button type="primary" v-if="button.details" icon="el-icon-view" @click="handleDialogOpen('details')">{{ $t('button.viewAreaDetails') }}</el-button>
      <el-button type="primary" v-if="button.delete" icon="el-icon-delete" :disabled="selection.length == 0" @click="handleDialogOpen('del')">{{ $t('button.delete') }}</el-button>
    </div>
    <!-- 查询结果 表格 -->
    <div class="result clearfix" v-loading="listLoading">
      <el-table ref="resultTable" stripe border max-height="565" :data="list" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" highlight-current-row>
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column type="index" :label="$t('common.no')" width="300" :index="realQuery.pageSize * (realQuery.pageNumber - 1) + 1"></el-table-column>
        <el-table-column prop="areaName" :label="$t('area.areaName')"></el-table-column>
        <el-table-column :label="$t('common.operation')">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-if="button.edit" icon="el-icon-edit" @click="handleDialogOpen('edit', scope.row)" plain>{{ $t('button.edit') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="currentTotal">
        {{ $t('common.currentPage') }} {{ list.length }}
        {{ $t('common.unit') }}
      </div>
      <el-pagination @size-change="handleSizeChange($event, 'real')" @current-change="handleCurrentChange($event, 'real')" :current-page="realQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="realQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
    </div>
    <!-- 新增/编辑对话框 -->
    <el-dialog :title="isAdd ? $t('button.newArea') : $t('button.edit')" :visible.sync="addDialogVisible" :close-on-click-modal="false">
      <el-form label-width="150px" :validate-on-rule-change="false">
        <el-form-item :label="$t('area.areaName')" prop="areaName">
          <el-input v-model="areaName" :placeholder="$t('placeholder.input')" maxlength="10"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="isAdd ? handleAddOrEdit('add') : handleAddOrEdit('edit')">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 区域详情对话框 -->
    <el-dialog class="dlgWidthAuto preview modeDia" :title="$t('button.viewAreaDetails')" :visible.sync="detailsDialogVisible" :close-on-click-modal="false">
      <div class="flex-hb">
        <div class="lft">
          <h3>{{ $t('area.area') }}</h3>
          <el-select v-model="areaVal" :placeholder="$t('placeholder.allRegions')" @change="getShop">
            <el-option v-for="item in areaList" :key="item.id" :label="item.areaName" :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="rgt result" v-loading="listLoading">
          <h3>{{ $t('area.storeList') }}</h3>
          <p class="shopList" v-if="shopList.length === 0">{{ $t('common.noData') }}</p>
          <ul class="shopList" v-else>
            <li v-for="(item, index) in shopList" :key="index">
              <span v-if="item.shopPic == null || item.shopPic == ''">{{ $t('common.noImg') }}</span>
              <img v-else :src="item.shopPic">
              <p class="name two-txt-cut" :title="item.shopId+''+item.shopName">{{item.shopId}} {{item.shopName}}</p>
              <div class="flex">
                <i class="el-icon-location-outline"></i>
                <p class="two-txt-cut addr" :title="item.area + item.address">{{item.area}}{{item.address}}</p>
              </div>
            </li>
          </ul>
          <div class="currentTotal">
            {{ $t('common.currentPage') }} {{ shopList.length }}
            {{ $t('common.unit') }}
          </div>
          <el-pagination @size-change="handleSizeChange($event, 'shop')" @current-change="handleCurrentChange($event, 'shop')" :current-page="shopQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="shopQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="shopTotal" background></el-pagination>
        </div>
      </div>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="delDialogVisible" :close-on-click-modal="false">
      <span>{{ $t('message.delSelectedArea') }}</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDelete">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import $utils from '@/utils'
export default {
  data() {
    return {
      realQuery: {
        pageNumber: 1,
        pageSize: 10
      },
      shopQuery: {
        pageNumber: 1,
        pageSize: 10
      },
      list: [], // 区域数据
      areaList: [], // 区域数据(全部)
      total: 0,
      shopTotal: 0,
      selection: [],
      listLoading: false,
      addDialogVisible: false,
      areaName: '', // 区域名称
      isAdd: false, // 是否新增
      detailsDialogVisible: false,
      delDialogVisible: false,
      areaVal: '',
      areaId: '',
      shopList: []
    }
  },
  created() {
    this.getList()
  },
  mounted() { },
  props: ['button'],
  methods: {
    // 获取区域
    getList() {
      this.listLoading = true
      this.$http.posts('areaList', this.realQuery)
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
    // 获取全部区域
    getAllArea() {
      this.$http.posts('allArea')
        .then(res => {
          this.areaList = res.data || []
          this.areaVal = this.areaList[0].id
          this.getShop()
        })
    },
    // 新增/编辑/详情/删除对话框打开
    handleDialogOpen(type, row) {
      if (type === 'add' || type === 'edit') {
        if (type === 'add') {
          this.areaName = ''
          this.isAdd = true
        } else {
          this.areaName = row.areaName
          this.areaId = row.id
          this.isAdd = false
        }
        this.addDialogVisible = true
      } else {
        if (type === 'details') {
          this.getAllArea()
        }
        this[`${type}DialogVisible`] = true
      }
    },
    // 新增/编辑
    handleAddOrEdit: $utils.debounce(function (type) {
      if (this.areaName.trim().length === 0) {
        this.$utils.$message({
          message: this.$t('message.areaNameNotEmpty'),
          type: 'error'
        })
        return
      }
      let params = { areaName: this.areaName }
      if (type === 'edit') {
        params = { ...params, id: this.areaId }
      }
      this.$http.posts('areaAdd', params, '', true)
        .then(res => {
          this.getList()
          this.addDialogVisible = false
        })
    }),
    // 删除区域
    handleDelete() {
      let ids = this.selection.map(item => item.id).join()
      this.$http.posts('areaDel', '', { id: ids }, true)
        .then(res => {
          if (this.realQuery.pageNumber !== 1 && this.list.length === 1) {
            this.realQuery.pageNumber -= 1
          }
          this.getList()
        })
      this.delDialogVisible = false
    },
    // 获取门店列表
    getShop() {
      this.listLoading = true
      this.$http.posts('areaShopList', { ...this.shopQuery, areaId: this.areaVal }, '', { showErrorMsg: true })
        .then(res => {
          this.listLoading = false
          let data = res.data
          this.shopList = data.list || []
          this.shopTotal = data.total || 0
        }).catch(er => {
          this.listLoading = false
          this.shopList = []
          this.shopTotal = 0
        })
    },
    // 多选选中
    handleSelectionChange(val) {
      this.selection = val
    },
    // 一页显示多少条
    handleSizeChange(val, type) {
      this[`${type}Query`].pageSize = val
      if (type === 'real') {
        this.getList()
      } else if (type === 'shop') {
        this.getShop()
      }
    },
    // 当前第几页
    handleCurrentChange(val, type) {
      this[`${type}Query`].pageNumber = val
      if (type === 'real') {
        this.getList()
      } else if (type === 'shop') {
        this.getShop()
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../../assets/color.less';
#areaShop {
  h3 {
    margin-bottom: 10px;
  }
  .lft {
    width: 20%;
  }
  .rgt {
    width: 80%;
    margin-left: 10px;
    h3 {
      padding-left: 12px;
    }
    p.shopList {
      text-align: center;
      line-height: 565px;
    }
    .shopList {
      padding-left: 10px;
      height: 565px;
      overflow: auto;
      border-left: solid 1px @border;
      li {
        width: 178px;
        min-height: 286px;
        margin: 0 15px 20px 0;
        float: left;
        img,
        span {
          width: 100%;
          height: 178px;
          line-height: 178px;
          background: @background;
          display: inline-block;
          border-radius: 5px;
          text-align: center;
          color: @text5;
        }
        .name {
          font-weight: bold;
          font-size: 18px;
          padding: 10px 0 4px;
        }
        i {
          color: @text2;
          font-size: 20px;
          padding-top: 2px;
        }
        .addr {
          width: 158px;
          height: 46px;
          line-height: 23px;
        }
      }
    }
  }
}
</style>
