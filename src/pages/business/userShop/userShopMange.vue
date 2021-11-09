<template>
  <div id="userShopMange">
    <div v-show="!detailsDialogVisible">
      <!-- 查询 -->
      <div class="queryForm">
        <el-form ref="shopQuery" :model="shopQuery" :rules="shopQueryRules" inline label-width="auto">
          <el-form-item prop="orgId" :label="$t('account.organization')">
            <input-tree ref="orgTree" v-model="shopQuery.orgId" :show-checkbox="true" :data="busiOrgTree"></input-tree>
          </el-form-item>
          <!-- <el-form-item prop="orgId" :label="$t('account.organization')" class="orgTreeForm">
            <el-cascader ref="shopCascader" v-model="shopQuery.orgId" :options="busiOrgTree" :props="{ value: 'id',multiple: true}" :placeholder="$t('placeholder.select')" clearable collapse-tags></el-cascader>
          </el-form-item> -->
          <el-form-item prop="searchName" :label="$t('account.query')">
            <el-input v-model="shopQuery.searchName" @keydown.enter.native="handleQuery('shop')" :placeholder="$t('placeholder.searchShop')" clearable></el-input>
          </el-form-item>
          <el-form-item prop="term" :label="$t('userShop.condition')">
            <el-select v-model="shopQuery.term" :placeholder="$t('placeholder.select')" clearable>
              <el-option :label="$t('userShop.all')" :value="1"></el-option>
              <el-option :label="$t('userShop.exemption')" :value="2"></el-option>
              <el-option :label="$t('userShop.operation')" :value="3"></el-option>
              <el-option :label="$t('userShop.org')" :value="4"></el-option>
              <el-option :label="$t('userShop.deleted')" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery('shop')">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 操作 -->
      <div class="CRUD">
        <!-- shopRealQuery.term === 5 -->
        <el-button v-if="button.add" type="primary" icon="el-icon-plus" @click="handleDialogOpen('add')">{{ $t('button.add') }}</el-button>
        <el-button v-if="button.delete" type="primary" icon="el-icon-delete" @click="handleDialogOpen('delete')" :disabled="shopSelection.length === 0 || shopRealQuery.term === 5">{{ $t('button.delete') }}</el-button>
        <el-button v-if="button.export" type="primary" icon="el-icon-download" @click="handleDownload" :disabled="shopList.length === 0">{{ $t('button.export') }}</el-button>
        <el-button v-if="button.pause" type="primary" icon="el-icon-close" @click="handleDialogOpen('pause')" :disabled="shopSelection.length === 0 || shopRealQuery.term === 5">{{ $t('button.pause') }}</el-button>
        <el-button v-if="button.restore" type="primary" icon="el-icon-refresh-left" @click="handleDeleteAndStatus('',1)" :disabled="shopSelection.length === 0 || shopRealQuery.term === 5">{{ $t('button.restore') }}</el-button>
      </div>
      <!-- 表格 -->
      <div class="result clearfix" v-loading="listLoading">
        <div class="caption">{{ $t('userShop.shopList') }}</div>
        <el-table ref="resultTable" stripe border max-height="560" :data="shopList" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" @sort-change="handleSortChange" highlight-current-row>
          <el-table-column type="selection" width="60"></el-table-column>
          <el-table-column type="index" :label="$t('common.no')" width="70" :index="shopRealQuery.pageSize * (shopRealQuery.pageNumber - 1) + 1"></el-table-column>
          <el-table-column sortable="custom" prop="shopId" :label="$t('userShop.shopNo')"></el-table-column>
          <el-table-column prop="shopName" :label="$t('userShop.shopName')"></el-table-column>
          <el-table-column sortable="custom" prop="area" :label="$t('userShop.area')" min-width="140"></el-table-column>
          <el-table-column prop="contact" :label="$t('userShop.contacts')"></el-table-column>
          <el-table-column prop="phoneNumb" :label="$t('userShop.phoneNo')" width="170"></el-table-column>
          <el-table-column sortable="custom" prop="property" :label="$t('userShop.property')"></el-table-column>
          <el-table-column sortable="custom" prop="onlineStatus" :label="$t('userShop.networkState')">
            <span slot-scope="scope" :style="{color: scope.row.onlineStatus === 1 ? '#2bc553' : '#ff5722'}">
              {{scope.row.onlineStatus === 1 ? $t('userShop.online') : $t('userShop.offline') }}
            </span>
          </el-table-column>
          <el-table-column sortable="custom" prop="status" :label="$t('userShop.operationStatus')">
            <template slot-scope="scope">
              {{scope.row.status === 1 ? $t('userShop.operating'):$t('userShop.suspend') }}
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="shopAuth" :label="$t('userShop.authorizationStatus')">
            <template slot-scope="scope">
              {{scope.row.shopAuth === 1 ? $t('userShop.auth'):$t('userShop.noAuth') }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.operation')" width="180">
            <template slot-scope="scope">
              <el-button v-if="button.edit" size="mini" type="primary" icon="el-icon-edit" @click="handleDialogOpen('edit', scope.row)" plain :disabled="scope.row.status === 2">{{ $t('button.edit') }}</el-button>
              <el-button size="mini" type="primary" @click="handleDialogOpen('details', scope.row)" plain>{{ $t('button.details') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="currentTotal">
          {{ $t('common.currentPage') }} {{ shopList.length }}
          {{ $t('common.unit') }}
        </div>
        <el-pagination @size-change="handleSizeChange($event, 'shop')" @current-change="handleCurrentChange($event, 'shop')" :current-page.sync="shopRealQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="shopRealQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="shopTotal" background></el-pagination>
      </div>
    </div>
    <!-- 新增对话框 -->
    <el-dialog :title="$t('button.add')" :visible.sync="addDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('add')">
      <el-form :model="addForm" label-width="7.5rem" :rules="addOrEditFormRules" ref="addForm" :validate-on-rule-change="false">
        <el-form-item :label="$t('userShop.shopImg')" prop="shopPic" class="avatarItem">
          <el-upload class="avatar-uploader" action="string" :show-file-list="false" :before-upload="handleBeforePhotoUpload" accept="image/bmp, image/jpeg, image/png">
            <el-image v-if="addForm.shopPic" :src="addForm.shopPic" class="avatar" fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="tip">{{ $t('message.photoMessage') }}</div>
          </el-upload>
          <el-input v-model="addForm.shopPic" :placeholder="$t('placeholder.input')" type="hidden" style="display:none"></el-input>
        </el-form-item>
        <el-form-item :label="$t('userShop.shopNo')" prop="shopId">
          <el-input v-model.trim="addForm.shopId" :placeholder="$t('placeholder.input')" type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('userShop.shopName')" prop="shopName">
          <el-input v-model="addForm.shopName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item label-width="0" required>
          <el-col :span="15">
            <el-form-item :label="$t('userShop.contacts')" prop="contact" style="width: 100%;min-width:auto">
              <el-input ref="addContact" v-model="addForm.contact" readonly :placeholder="$t('placeholder.input')" @focus="handleDialogOpen('contact')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item :label="$t('userShop.membership')" label-width="105px" prop="memberNumb" style="width: 100%;min-width:auto">
              <el-input v-model.trim="addForm.memberNumb" :placeholder="$t('placeholder.input1')" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('userShop.phoneNo')" required>
          <el-col :span="9">
            <el-form-item prop="phonePrefix" style="width: 100%;min-width:auto">
              <el-select v-model="addForm.phonePrefix" filterable :placeholder="$t('placeholder.select')" style="width: 100%;">
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1" style="text-align:center">-</el-col>
          <el-col :span="14">
            <el-form-item prop="phoneNumb" style="width: 100%;min-width:auto">
              <el-input v-model.trim="addForm.phoneNumb" :placeholder="$t('placeholder.input')" maxlength="30" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('userShop.openTime')" prop="openingTime">
          <el-date-picker v-model="addForm.openingTime" :placeholder="$t('placeholder.select')" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('userShop.area')">
          <el-col :span="11">
            <el-form-item prop="area1" style="width: 100%;min-width:auto">
              <el-select v-model="addForm.area1" :placeholder="$t('common.province')" @change="handleChangeArea1" filterable>
                <el-option v-for="item in area1Options" :key="item.areaId" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align:center">-</el-col>
          <el-col :span="11">
            <el-form-item prop="area2" style="width: 100%;min-width:auto">
              <el-select v-model="addForm.area2" :placeholder="$t('common.city')" filterable>
                <el-option v-for="item in area2Options" :key="item.value" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('userShop.address')" prop="address">
          <el-input v-model.trim="addForm.address" :placeholder="$t('placeholder.input')" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-col :span="14">
            <el-form-item :label="$t('userShop.longitude')" prop="pointX" style="width: 100%;min-width:auto">
              <el-input v-model.trim="addForm.pointX" :placeholder="$t('placeholder.input')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('userShop.latitude')" prop="pointY" label-width="80px" style="width: 100%;min-width:auto">
              <el-input v-model.trim="addForm.pointY" :placeholder="$t('placeholder.input')"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('common.shortName')" prop="shortName">
          <el-input :placeholder="$t('placeholder.input')" v-model.trim="addForm.shortName" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item :label="$t('userShop.property')" prop="property">
          <el-select v-model="addForm.property" :placeholder="$t('placeholder.select')">
            <el-option :label="$t('userShop.franchisee')" value="加盟">
            </el-option>
            <el-option :label="$t('userShop.directSale')" value="直营">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('userShop.inspection')" prop="isExemption">
          <el-select v-model="addForm.isExemption" :placeholder="$t('placeholder.select')">
            <el-option :label="$t('userShop.yes')" :value="1">
            </el-option>
            <el-option :label="$t('userShop.no')" :value="0">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('add')" :disabled="addDisabled">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog :title="$t('button.edit')" :visible.sync="editDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('edit')">
      <el-form :model="editForm" label-width="7.5rem" :rules="addOrEditFormRules" ref="editForm" :validate-on-rule-change="false">
        <el-form-item :label="$t('userShop.shopImg')" prop="shopPic" class="avatarItem">
          <el-upload class="avatar-uploader" action="string" :show-file-list="false" :before-upload="handleBeforePhotoUpload" accept="image/bmp, image/jpeg, image/png">
            <el-image v-if="editForm.shopPic" :src="editForm.shopPic" class="avatar" fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="tip">{{ $t('message.photoMessage') }}</div>
          </el-upload>
          <el-input v-model="editForm.shopPic" :placeholder="$t('placeholder.input')" type="hidden" style="display:none"></el-input>
        </el-form-item>
        <el-form-item :label="$t('userShop.shopNo')" prop="shopId">
          <el-input v-model.trim="editForm.shopId" :placeholder="$t('placeholder.input')" type="number" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('userShop.shopName')" prop="shopName">
          <el-input v-model="editForm.shopName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <el-form-item label-width="0" required>
          <el-col :span="15">
            <el-form-item :label="$t('userShop.contacts')" prop="contact" style="width: 100%;min-width:auto">
              <!--  <el-select v-model="editForm.contact" filterable :placeholder="$t('placeholder.select')" style="width: 100%;">
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select> -->
              <el-input ref="editContact" v-model="editForm.contact" readonly :placeholder="$t('placeholder.input')" @focus="handleDialogOpen('contact')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item :label="$t('userShop.membership')" label-width="110px" prop="memberNumb" style="width: 100%;min-width:auto">
              <el-input v-model.trim="editForm.memberNumb" :placeholder="$t('placeholder.input1')" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('userShop.phoneNo')" required>
          <el-col :span="9">
            <el-form-item prop="phonePrefix" style="width: 100%;min-width:auto">
              <el-select v-model="editForm.phonePrefix" filterable :placeholder="$t('placeholder.select')" style="width: 100%;">
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1" style="text-align:center">-</el-col>
          <el-col :span="14">
            <el-form-item prop="phoneNumb" style="width: 100%;min-width:auto">
              <el-input v-model.trim="editForm.phoneNumb" :placeholder="$t('placeholder.input')" type="number" maxlength="30" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- <el-form-item :label="$t('userShop.phoneNo')" prop="phoneNumb">
          <el-input v-model.trim="editForm.phoneNumb" :placeholder="$t('placeholder.input')" type="number"></el-input>
        </el-form-item> -->
        <el-form-item :label="$t('userShop.openTime')" prop="openingTime">
          <el-date-picker v-model="editForm.openingTime" :placeholder="$t('placeholder.select')" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('userShop.area')">
          <el-col :span="11">
            <el-form-item prop="area1" style="width: 100%;min-width:auto">
              <el-select v-model="editForm.area1" :placeholder="$t('common.province')" @change="handleChangeArea1" filterable>
                <el-option v-for="item in area1Options" :key="item.areaId" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align:center">-</el-col>
          <el-col :span="11">
            <el-form-item prop="area2" style="width: 100%;min-width:auto">
              <el-select v-model="editForm.area2" :placeholder="$t('common.city')" filterable>
                <el-option v-for="item in area2Options" :key="item.value" :label="item.areaName" :value="item.areaName">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('userShop.address')" prop="address">
          <el-input v-model.trim="editForm.address" :placeholder="$t('placeholder.input')" maxlength="128"></el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <el-col :span="14">
            <el-form-item :label="$t('userShop.longitude')" prop="pointX" style="width: 100%;min-width:auto">
              <el-input v-model.trim="editForm.pointX" :placeholder="$t('placeholder.input')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item :label="$t('userShop.latitude')" prop="pointY" label-width="80px" style="width: 100%;min-width:auto">
              <el-input v-model.trim="editForm.pointY" :placeholder="$t('placeholder.input')"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item :label="$t('common.shortName')" prop="shortName">
          <el-input :placeholder="$t('placeholder.input')" v-model.trim="editForm.shortName" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item :label="$t('userShop.property')" prop="property">
          <el-select v-model="editForm.property" :placeholder="$t('placeholder.select')">
            <el-option :label="$t('userShop.franchisee')" value="加盟">
            </el-option>
            <el-option :label="$t('userShop.directSale')" value="直营">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('userShop.inspection')" prop="isExemption">
          <el-select v-model="editForm.isExemption" :placeholder="$t('placeholder.select')">
            <el-option :label="$t('userShop.yes')" :value="1">
            </el-option>
            <el-option :label="$t('userShop.no')" :value="0">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('edit')" :disabled="editDisabled">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 删除对话框 {{deleteShops}}-->
    <el-dialog :title="$t('button.delete')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false">
      <div class="deleteInfo"><i class="el-icon-warning"></i><span>{{ $t('message.isDeleteShop') }}</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDeleteAndStatus('delete',2)">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 详情 -->
    <div class="details" v-show="detailsDialogVisible">
      <div class="queryForm">
        <el-button type="primary" icon="el-icon-arrow-left" @click="handleDialogClose('details')">{{ $t('button.back') }}</el-button>
      </div>
      <!-- 基本信息 -->
      <div class="result basic">
        <div class="title">
          <i class="el-icon-collection-tag"></i>{{ $t('role.basic') }}
        </div>
        <el-table max-height="565">
          <el-table-column width="150">
            <template slot="header">
              <div style="line-height:1">
                <el-image v-if="detailsForm.shopPic" :src="detailsForm.shopPic" fit="contain">
                  <div slot="error" class="image-slot"></div>
                </el-image>
              </div>
              <p style="line-height:1.8">{{ detailsForm.shopName }}</p>
            </template>
          </el-table-column>
          <el-table-column :label="$t('userShop.shopNo')" width="150">
            <el-table-column :label="$t('userShop.shopName')" width="150">
              <el-table-column :label="$t('userShop.contacts')" width="150">
                <el-table-column :label="$t('userShop.address')" width="150">
                  <el-table-column :label="$t('userShop.membership')" width="150">
                  </el-table-column>
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column>
            <template slot="header">
              {{ detailsForm.shopId }}
            </template>
            <el-table-column label="">
              <template slot="header">
                {{ detailsForm.shopName }}
              </template>
              <el-table-column label="">
                <template slot="header">
                  {{ detailsForm.contact }}
                </template>
                <el-table-column label="">
                  <template slot="header">
                    {{ detailsForm.address }}
                  </template>
                  <el-table-column label="">
                    <template slot="header">
                      {{ detailsForm.memberNumb }}
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="$t('userShop.openTime')" width="150">
            <el-table-column :label="$t('userShop.phoneNo')" width="150">
              <el-table-column :label="$t('userShop.area')" width="150">
                <el-table-column :label="$t('userShop.property')" width="150">
                  <el-table-column :label="$t('userShop.inspection')" width="150">
                  </el-table-column>
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column>
            <template slot="header">
              {{ detailsForm.openingTime }}
            </template>
            <el-table-column label="">
              <template slot="header">
                {{ detailsForm.phoneNumb }}
              </template>
              <el-table-column label="">
                <template slot="header" slot-scope="scope">
                  {{ detailsForm.area }}
                </template>
                <el-table-column label="">
                  <template slot="header" slot-scope="scope">
                    {{ detailsForm.property }}
                  </template>
                  <el-table-column label="">
                    <template slot="header">
                      {{ detailsForm.isExemption === 1?$t('userShop.yes'):$t('userShop.no') }}
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <!-- 所属组织架构 -->
      <div class="result clearfix">
        <div class="title">
          <i class="el-icon-collection-tag"></i>{{ $t('userShop.subordinateOrg') }}
        </div>
        <el-table ref="resultTable" max-height="565" stripe border :data="detailsTable1" tooltip-effect="dark" @selection-change="handleSelectionChange" highlight-current-row>
          <el-table-column prop="shopName" :label="$t('userShop.shopName')" width="150"></el-table-column>
          <el-table-column prop="org" :label="$t('org.organ')"></el-table-column>
        </el-table>
      </div>
      <!-- 门店资产列表 -->
      <div class="result clearfix">
        <div class="title">
          <i class="el-icon-collection-tag"></i>{{ $t('userShop.shopAssets') }}
        </div>
        <el-table ref="assetsTable" max-height="565" stripe border :data="assetsList" tooltip-effect="dark" highlight-current-row>
          <el-table-column width="90" :label="$t('common.no')"></el-table-column>
          <el-table-column prop="deviceName" :label="$t('userShop.deviceName')"></el-table-column>
          <el-table-column prop="model" :label="$t('userShop.model')"></el-table-column>
          <el-table-column prop="qty" :label="$t('userShop.qty')"></el-table-column>
          <el-table-column prop="warranty" :label="$t('userShop.warranty')"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange($event, 'assets')" @current-change="handleCurrentChange($event, 'assets')" :current-page.sync="assetsRealQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="assetsRealQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="assetsTotal" background></el-pagination>
      </div>
    </div>
    <!-- 暂停营运对话框 -->
    <el-dialog :title="$t('button.pause')" :visible.sync="pauseDialogVisible" :close-on-click-modal="false">
      <div class="deleteInfo"><i class="el-icon-warning"></i><span>{{pauseShops}} {{ $t('message.isPauseShop') }}</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pauseDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDeleteAndStatus('pause',0)">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 联系人 -->
    <el-dialog class="innerDialog" :title="$t('userShop.contacts')" :visible.sync="contactDialogVisible" :close-on-click-modal="false" @opened="handleDialogOpened" @closed="handleDialogClose('contact')">
      <!-- 查询 -->
      <div>
        <el-form ref="contactQuery" :model="contactQuery" class="clearfix" :rules="contactFormRules">
          <el-form-item prop="orgId">
            <input-tree ref="contactOrgTree" v-model="contactQuery.orgId" :show-checkbox="true" :data="busiOrgTreeC"></input-tree>
          </el-form-item>
          <!-- <el-form-item prop="orgId">
            <el-cascader ref="contactCascader" v-model="contactQuery.orgId" :options="busiOrgTreeC" :props="{ value: 'id',multiple: true}" :placeholder="$t('placeholder.select')" clearable collapse-tags></el-cascader>
          </el-form-item> -->
          <el-form-item prop="searchName">
            <el-input v-model="contactQuery.searchName" :placeholder="$t('placeholder.userName1')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery('contact')">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="result clearfix">
        <el-table ref="contactTable" max-height="500" :data="contactList" @row-click="handleRowClick" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
          <el-table-column prop="userName" :label="$t('account.userList')"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange($event, 'contact')" @current-change="handleCurrentChange($event, 'contact')" :current-page.sync="contactRealQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="contactRealQuery.pageSize" layout=" prev, pager, next,sizes" :pager-count="5" :total="contactTotal" background></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="contactDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleContact('contact')">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 导入 -->
    <!-- <el-dialog class="importDialog" :title="$t('button.import') + $t('role.role')" :visible.sync="importDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('import')">
      <div class="flex-hc importBox">
        <span>{{ $t('org.selectFile') }}</span>
        <div class="importFileInfo">
          <a class="el-upload-list__item-name" v-if="this.importFile">
            <i class="el-icon-document"></i>{{this.importFile.name}}
          </a>
        </div>
        <el-upload class="importUpload" :show-file-list="false" :before-upload="handleBeforeUpload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" action="string">
          <el-button size="small" type="primary">{{ $t('button.browse') }}</el-button>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button>{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleImport" :disabled="importDisabled">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>

<script>
import $utils from '@/utils'
// import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      busiOrgTree: [], // 组织架构数据非常非常多的话，不直接从store取，为了菜单切换流畅，渲染要时间。现在渲染变快了点
      // 查询表单数据
      shopQuery: {
        orgId: [],
        searchName: '', // 角色名称
        term: '' // 条件筛选
      },
      shopRealQuery: {
        sortKey: '',
        sortValue: '',

        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      }, // 当前表格的查询条件
      shopList: [],
      shopTotal: 0,
      shopSelection: [],
      listLoading: false,

      type: '', // 操作类型，如add/edit

      photoFile: '', // 图片文件
      prefixOptions: [], // 号码前缀

      addCascaderVisible: false, // 为了让关闭再打开去掉高亮
      addDialogVisible: false,
      addForm: {
        shopPic: '', // 门头照
        shopId: '', // 门店号
        shopName: '', // 门店名称
        contactId: '', // 联系人id
        contact: '', // 联系人名字(店长)
        memberNumb: '', // 成员数
        phonePrefix: '86',
        phoneNumb: '', // 手机号码
        openingTime: '', // 开店时间
        area1: '',
        area2: '',
        area: '', // 行政地区
        address: '', // 地址
        pointX: '',
        pointY: '',
        shortName: '',
        property: '', // 属性 直营/加盟
        isExemption: '', // 是否免检 是1 否0

        type: 1 // 新增1 修改2
        // status: 1
      },
      addDisabled: false,

      contactDialogVisible: false, // 联系人
      contactQuery: {
        orgId: [],
        searchName: '' // 名称
      },
      contactRealQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10, // 一页显示多少条

        onlySearch: 'userName', // 只查询用户名
        type: 2, // 1.企业用户 2.业务用户
        moduleId: 1 // 基础模块
      },
      activeContactRow: {},
      busiOrgTreeC: [], // 联系人中的级联菜单，关闭对话框重置

      editCascaderVisible: true,
      editDialogVisible: false,
      editForm: {},
      editDisabled: false,

      detailsDialogVisible: false,
      detailsForm: {}, // 高亮的数据
      detailsTable1: [],

      deleteDialogVisible: false,
      // deleteShops: '',

      pauseDialogVisible: false,
      pauseShops: '',

      assetsRealQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      assetsList: [],
      assetsTotal: 0,
      // assetsTotal: 0, // 总条数

      // importUrl: this.$api.apiBase + this.$api.importUser, // 导入的地址
      // importHeaders: { Authorization: sessionStorage.getItem('authorization') }, // 导入的请求头
      // importDialogVisible: false,
      // importFile: '',
      // importDisabled: false,

      button: {}
    }
  },
  computed: {
    ...mapGetters(['language', 'area1Options', 'area2Options']),
    ...mapGetters({ contactList: 'busiUserList', contactTotal: 'busiUserTotal', busiOrgTree1: 'busiOrgTree' }),
    // 查询验证规则
    shopQueryRules() {
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
    },
    // 联系人查询验证规则
    contactFormRules() {
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
    },
    // 编辑/新增 表单验证
    addOrEditFormRules() {
      return {
        // shopImg: [
        //   {
        //     required: true,
        //     trigger: 'change',
        //     message: this.$t('message.choosePhoto')
        //     // pattern: this.$utils.reg.name
        //   }
        // ],
        shopId: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (this.$utils.reg.shopNo.test(value)) {
              // 验证成功后
              // 发送请求看是否重复
              if (this.type === 'edit') {
                callback()
              } else {
                this.$store.dispatch('isValueRepeat', { moduleVal: 'busiShop', value, callback })
              }
            } else {
              callback(new Error(this.$t('message.inputShopNo')))
            }
          }
        }],
        shopName: [{
          required: true,
          trigger: 'blur',
          pattern: this.$utils.reg.name,
          message: this.$t('message.noEmpty')
        }],
        contact: [{
          required: true,
          trigger: 'change',
          message: this.$t('message.select')
        }],
        memberNumb: [{
          pattern: this.$utils.reg.number,
          trigger: 'blur',
          message: this.$t('message.inputNo')
        }],
        phonePrefix: [{
          required: true,
          trigger: 'change',
          message: this.$t('message.select'),
          validator: (rule, value, callback) => {
            var form = `${this.type}Form`
            // console.log(form)
            if (value) {
              if (this.$utils.reg.phoneNoA.test(this[form].phoneNumb)) {
                this.$refs[form].validateField('phoneNumb')
              }
              callback()
            } else {
              callback(new Error(this.$t('message.select')))
            }
          }
        }],
        phoneNumb: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            var form = `${this.type}Form`
            var phoneNORegA = this.$utils.reg.phoneNoA
            var phoneNORegC = this.$utils.reg.phoneNoC1
            var phoneNORegC1 = this.$utils.reg.phoneNoC2
            // 全部的手机号码验证
            if (!phoneNORegA.test(value)) {
              // 验证不通过
              callback(new Error(this.$t('message.inputRight')))
            } else {
              let reg = (this[form].phonePrefix === '86' && !phoneNORegC.test(value)) ||
                (this[form].phonePrefix === '886' && !phoneNORegC1.test(value))
              if (reg) {
                callback(new Error(this.$t('message.inputRight')))
              } else {
                callback()
              }
            }
          }
        }],
        openingTime: [{
          required: true,
          trigger: 'blur',
          message: this.$t('message.select')
        }],
        area1: [{
          required: true,
          trigger: 'change',
          validator: (rule, value, callback) => {
            // console.log(value)
            var form = this[`${this.type}Form`]
            if (form.area2 && !value) {
              callback(new Error(this.$t('message.select')))
            } else {
              callback()
            }
          }

        }],
        pointX: [{
          trigger: 'blur',
          pattern: this.$utils.reg.longitude,
          message: this.$t('message.tude')
        }],
        pointY: [{
          trigger: 'blur',
          pattern: this.$utils.reg.latitude,
          message: this.$t('message.tude')
        }],
        shortName: [{
          trigger: 'blur',
          pattern: this.$utils.reg.areaAbbr,
          message: this.$t('message.noSpecial3')
        }]
        // area2: [{
        //   required: true,
        //   trigger: 'change',
        //   validator: (rule, value, callback) => {
        //     console.log(value)
        //     var form = this[`${this.type}Form`]
        //     if (form.area1 && !value) {
        //       callback(new Error(this.$t('message.select')))
        //       // if (value) {
        //       //   callback()
        //       // } else {
        //       //   callback(new Error(this.$t('message.inputPassword')))
        //       // }
        //     } else {
        //       callback()
        //     }
        //   }

        // }]
      }
    }
  },
  watch: {
    language: {
      handler: function (newLang, oldLang) {
        if (newLang === 'cn') {
          this.prefixOptions = this.$utils.formatPrefixCN()
        } else if (newLang === 'en') {
          this.prefixOptions = this.$utils.formatPrefixEN()
        }
      },
      immediate: true
    },
    // 修改最后一页删除的bug
    shopTotal() {
      if (
        this.shopTotal ===
        (this.shopRealQuery.pageNumber - 1) * this.shopRealQuery.pageSize &&
        this.shopTotal !== 0
      ) {
        this.shopRealQuery.pageNumber -= 1
        this.getShopList() // 获取列表数据
      }
    },
    // 可能刚进页面请求还没有回来，同步
    busiOrgTree1: {
      handler(newVal, oldVal) {
        this.busiOrgTree = this.busiOrgTree1
        this.busiOrgTreeC = this.busiOrgTree1
      },
      deep: true
    }
  },
  created() {
    this.init()
    // this.$nextTick(() => {//不可，还是有点卡顿。现渲染变快了一点
    //   this.busiOrgTree = this.busiOrgTree1
    // })
  },
  mounted() { },
  methods: {
    // 进页面就发的请求
    init() {
      this.$utils.getButton(this.$route.path, 2).then(res => {
        this.button = res
      })// 获取按钮权限
      this.getShopList()// 获取数据列表
      this.$store.dispatch('getArea', { level: 1, areaId: '' })// 获取区域
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
    getShopList() {
      this.listLoading = true
      this.$http.posts('shopList', this.shopRealQuery)
        .then(res => {
          // console.log('getShopList_res')
          this.listLoading = false
          let data = res.data
          let list = data.list || []
          this.shopTotal = data.total || 0
          this.shopList = list.map((item, index) => {
            return {
              type: '业务账号',
              ...item,
              showPhone: item.phoneNumb,
              phoneNumb: item.phoneNumb && this.$utils.exchangePrefix(item.phoneNumb)
            }
          })
        })
        .catch(er => {
          // console.log(er)
          this.listLoading = false
          this.shopList = []
          this.shopTotal = 0
        })
    },
    // 获取联系人数据
    getContactList(isInitial) {
      // isInitial true 是否获取原始值,没有查询的
      if (isInitial) {
        this.contactRealQuery = {
          pageNumber: 1,
          pageSize: 10,
          onlySearch: 'userName',
          type: 2,
          moduleId: 1
        }
      }
      this.$store.dispatch('busiGetUserList', {
        params: this.contactRealQuery
      })
    },
    // 查询表单提交
    handleQuery(type = 'shop') {
      this.$refs[`${type}Query`].validate(valid => {
        if (valid) {
          this[`${type}RealQuery`] = { ...this[`${type}RealQuery`], ...this[`${type}Query`], pageNumber: 1, pageSize: 10 }
          var realQuery = this[`${type}RealQuery`]
          // 组织架构查询
          realQuery.orgId = realQuery.orgId.join()
          this[`get${this.$utils.firstUpper(type)}List`]()
        } else {
          // console.log('error 验证错误query!!')
          return false
        }
      })
    },
    // 多选选中
    handleSelectionChange(val) {
      this.shopSelection = val
    },
    // 排序
    handleSortChange(data) {
      // let sortValue, sortKey
      // console.log(data)
      if (data.order === 'ascending') {
        this.shopRealQuery.sortValue = 'asc'
      } else if (data.order === 'descending') {
        this.shopRealQuery.sortValue = 'desc'
      } else {
        this.shopRealQuery.sortValue = ''
        this.shopRealQuery.sortKey = ''
        this.getShopList()
        return false
      }
      this.shopRealQuery.sortKey = data.prop
      this.getShopList()
    },
    // 一页显示多少条
    handleSizeChange(val, type = 'shop') {
      this[`${type}RealQuery`].pageSize = val
      this[`get${this.$utils.firstUpper(type)}List`]()
    },
    // 当前第几页
    handleCurrentChange(val, type = 'shop') {
      this[`${type}RealQuery`].pageNumber = val
      this[`get${this.$utils.firstUpper(type)}List`]()
    },
    // 新增/修改/详情/删除对话框打开
    handleDialogOpen(type, row) {
      if (type === 'contact') {
        // blur是为了解决ie有个指针还在
        this.$refs[`${this.type}Contact`].blur()
        // this.busiOrgTreeC = this.busiOrgTree
        this.getContactList(true)
      } else {
        this.type = type
      }
      if (type === 'add') {
        this.addCascaderVisible = true
        this.$store.commit('AREA2_OPTIONS', [])// 二级区域初始化
      } else if (type === 'edit') {
        // console.log(row)
        this.editCascaderVisible = true
        this.$store.commit('AREA2_OPTIONS', [])// 二级区域初始化
        // this.getContactList(true)
        this.editForm = { ...row, area1: '', area2: '' }
        var phone = row.showPhone && this.$utils.splitPhone(row.showPhone)
        this.editForm.phoneNumb = phone && phone.phoneNumb
        this.$set(this.editForm, 'phonePrefix', (phone && phone.phonePrefix) || '86')
        if (this.editForm.area) {
          var areaArr = this.editForm.area.split('-')
          this.editForm.area1 = areaArr[0] || ''
          this.editForm.area2 = areaArr[1] || ''
          if (this.editForm.area1) {
            var areaId
            var areaItem = this.area1Options.find((item) => item.areaName === this.editForm.area1)
            if (areaItem) {
              areaId = areaItem.areaId
              this.$store.dispatch('getArea', { level: 2, areaId })
            }
          }
        }
        this.editForm.type = 2
        this.$nextTick(() => {
          // 应该放这里，在closed关闭时，上面form值改变，change的会触发验证，blur的不会
          this.$refs.editForm.clearValidate()
        })
      } else if (type === 'details') {
        this.detailsForm = { ...row }
        // 所属架构
        this.detailsTable1 = [{
          shopName: row.shopName,
          org: row.orgName
        }]
        // 门店资产
        this.assetsList = []
        this.assetsTotal = 0
      } else if (type === 'delete') {
      } else if (type === 'pause') {
        this.pauseShops = this.shopSelection.map(item => `[${item.shopId} ${item.shopName}]`).join()
      }
      this[`${type}DialogVisible`] = true
    },
    handleDialogOpened() {
      // 处理打开渲染迟钝。现渲染变快了
      this.busiOrgTreeC = this.busiOrgTree
    },
    // 所有图片上传之前
    handleBeforePhotoUpload(file) {
      // console.log(file)
      const isrightType =
        file.type === 'image/bmp' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      // console.log(isrightType)
      if (!isrightType) {
        this.$utils.$message({
          type: 'error',
          message: file.name + ',' + this.$t('message.photoTypeWrong')
        })
      }
      if (!isLt2M) {
        this.$utils.$message({
          type: 'error',
          message: file.name + ',' + this.$t('message.morePhotoSize')
        })
      }
      if (isrightType && isLt2M) {
        this[`${this.type}Form`].shopPic = URL.createObjectURL(file)
        this.photoFile = file
      }
      return false
    },
    // 联系人对话框点击高亮
    handleRowClick(row, column, event) {
      this.activeContactRow = { ...row }
    },
    // 联系人对话框确定
    handleContact(type) {
      this[`${this.type}Form`].contact = this.activeContactRow.userName
      this[`${this.type}Form`].contactId = this.activeContactRow.userId
      // console.log('this.$refs.contactTable', this.$refs.contactTable)
      this.contactDialogVisible = false
    },
    handleChangeArea1(val) {
      // console.log(this.area1Options)
      var areaId = this.area1Options.find(item => item.areaName === val).areaId
      this[`${this.type}Form`].area2 = ''
      this.$store.dispatch('getArea', { level: 2, areaId })
    },
    // 新增/编辑
    handleAddOrEdit(type) {
      // console.log(type)
      this.$refs[`${type}Form`].validate(async valid => {
        if (valid) {
          var form = { ...this[`${type}Form`], pageNumber: this.shopRealQuery.pageNumber }
          this[`${type}Disabled`] = true // 接口时间长，不用定时器了。对话框关闭了，也解禁。双控
          this.listLoading = true // 接口时间长，加个list的loading
          if (form.phoneNumb) form.phoneNumb = form.phonePrefix + '+' + form.phoneNumb
          form.area1 || form.area2 ? form.area = form.area1 + '-' + form.area2 : form.area = ''
          delete form.area1
          delete form.area2

          var formData
          if (form.shopPic && form.shopPic.startsWith('blob:')) {
            formData = new FormData()
            formData.append('file', this.photoFile)
            form.shopPic = ''
          } else {
            formData = ''
          }
          // delete form.shopPic

          // this.$utils.disabledButton(this)
          this.$http.posts('addOrUpdateShop', formData, form, true)
            .then(res => {
              // this[`${type}Disabled`] = false // 对话框关闭了，也解禁。双控，可注释掉
              // this.listLoading = false // getShopList中会再次用，可注释掉
              this[`${type}DialogVisible`] = false
              this.getShopList()
            })
            .catch(er => {
              this[`${type}Disabled`] = false
              this.listLoading = false
              this.handleError(er)
            })
        }
      })
    },
    // 删除/暂停营运
    handleDeleteAndStatus(type, status) {
      // console.log(status)
      // 1 开店 0闭店 2删除门店
      let ids = this.shopSelection.map(item => item.shopUuid).join()
      this.$http.posts('updateShopStatus', { ids, status }, '', true)
        .then(res => {
          this.getShopList()
        })
      if (type) this[`${type}DialogVisible`] = false
    },
    // 新增/修改/详情/删除对话框关闭,重置表单
    handleDialogClose(type) {
      if (type === 'add') {
        this.$refs.addForm.resetFields()
        this.addForm.userName = ''
        this.addCascaderVisible = false
        this.addDisabled = false
        // this.areaOptions = []
        // this.addForm.area = []
      } else if (type === 'edit') {
        this.editForm.userName = ''
        this.editCascaderVisible = false
        this.editDisabled = false
        // this.editForm.area = []
      } else if (type === 'details') {
        this.detailsDialogVisible = false
      } else if (type === 'contact') {
        this.$refs.contactQuery.resetFields()
        this.$refs.contactTable.setCurrentRow({})
        this.activeContactRow = {}
        this.busiOrgTreeC = []
      }
      // else if (type === 'import') {
      //   this.importFile = ''
      //   this.importDisabled = false
      // }
    },
    // // 模板下载
    // handleDownloadTemp() {
    //   window.location.href = this.$api.downloadUserTemp
    // },
    // // 文件导入前
    // handleBeforeUpload(file) {
    //   // console.log(file)
    //   const isExcel =
    //     file.type === '.csv' ||
    //     file.type ===
    //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    //     file.type === 'application/vnd.ms-excel'
    //   if (!isExcel) {
    //     this.$utils.$message({
    //       message: this.$t('message.excel'),
    //       type: 'error'
    //     })
    //   }
    //   if (isExcel) {
    //     this.importFile = file
    //   }
    //   return false
    // },
    // async handleImport() {
    //   if (!this.importFile) {
    //     this.$utils.$message({
    //       message: this.$t('message.selectImport'),
    //       type: 'warning'
    //     })
    //     return
    //   }
    //   this.importDisabled = true
    //   var formData = new FormData()
    //   formData.append('file', this.importFile)
    //   this.importDialogVisible = false
    //   try {
    //     const response = await this.$http.post('importShop', formData)
    //     const res = response.data
    //     // console.log(res)
    //     if (res.resCode === 0) {
    //       this.$utils.$message({
    //         message: this.$t('message.successUpload'),
    //         type: 'success'
    //       })
    //       this.getRoleList()
    //     } else {
    //       // console.log(123)
    //       this.$utils.$message({
    //         message: res.resMsg || res.errMsg,
    //         type: 'error'
    //       })
    //     }
    //     this.importDisabled = false
    //   } catch (e) {
    //     this.importDisabled = false
    //     this.$utils.$message({
    //       type: 'error',
    //       message: this.$t('message.errorUpload')
    //     })
    //     console.log(e)
    //   }
    // },
    // 导出按钮的处理
    handleDownload() {
      if (this.shopSelection.length === 0) {
        this.$utils.$message({
          message: this.$t('message.selectExport'),
          type: 'warning'
        })
        return
      }
      var length = this.shopSelection.length
      function getIds(arr) {
        var ids = arr.map(item => item.shopUuid).join()
        return ids
      }
      const loadObj = {
        ...this.shopRealQuery,
        ids: length === 0 ? '' : getIds(this.shopSelection) // 导出的具体数据
        // companyId: user.companyId
      }
      this.$utils.excelExport('exportShop', loadObj, '', 'saas_shopStore.xls')
      // window.location.href = this.$api.apiBase + `${this.$api.exportShop}?${this.$utils.obj2qs(
      //   loadObj
      // )}`
    }
  }
}
</script>

<style lang="less">
@import '../../../assets/color';
#userShopMange {
  .title {
    // padding: 0 0 15px 0px;
    line-height: 50px;
    i {
      margin-right: 5px;
      font-size: 20px;
      vertical-align: middle;
    }
  }
  .details {
    .basic {
      thead.is-group {
        tr:nth-child(1) th:nth-child(3),
        tr:nth-child(2) th:nth-child(2),
        tr:nth-child(3) th:nth-child(2),
        tr:nth-child(4) th:nth-child(2),
        tr:nth-child(5) th:nth-child(2),
        tr:nth-child(1) th:nth-child(5),
        tr:nth-child(2) th:nth-child(4),
        tr:nth-child(3) th:nth-child(4),
        tr:nth-child(4) th:nth-child(4),
        tr:nth-child(5) th:nth-child(4) {
          font-weight: 400;
          background-color: #fff;
        }
      }
    }
  }
  .el-dialog {
    .avatarItem {
      height: auto;
      // width: 100% !important;
      .el-form-item__error {
        left: 50%;
        transform: translateX(-50%);
        padding-top: 0;
      }
    }
  }
  .innerDialog {
    .el-dialog {
      .el-form-item {
        float: left;
        width: 150px;
        // max-width: 50%;
        min-width: 80px;
        margin-right: 10px;
        margin-bottom: 22px;
      }
      .el-form-item:last-child {
        width: 90px;
        margin-right: 0;
      }
    }
  }
}
</style>
