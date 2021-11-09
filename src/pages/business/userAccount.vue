<template>
  <div id="userAccount">
    <div v-show="!detailsDialogVisible">
      <!-- 查询 -->
      <div class="queryForm">
        <el-form ref="userQuery" :model="userQuery" :rules="userQueryRules" inline label-width="auto">
          <el-form-item prop="orgId" :label="$t('account.organization')">
            <input-tree ref="orgTree" v-model="userQuery.orgId" :show-checkbox="true" :data="busiOrgTree"></input-tree>
          </el-form-item>
          <!-- <el-form-item prop="orgId" :label="$t('account.organization')">
            <el-cascader ref="userCascader" v-model="userQuery.orgId" :options="busiOrgTree" :props="{value: 'id',multiple: true}" :placeholder="$t('placeholder.select')" clearable collapse-tags></el-cascader>
          </el-form-item> -->
          <el-form-item prop="searchName" :label="$t('account.query')">
            <el-input v-model="userQuery.searchName" @keydown.enter.native="handleQuery('user')" :placeholder="$t('placeholder.userName')" clearable></el-input>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" icon="el-icon-search" @click="handleQuery('user')">{{ $t('button.query') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 操作 -->
      <div class="CRUD">
        <el-button v-if="button.add" type="primary" icon="el-icon-plus" @click="handleDialogOpen('add')">{{ $t('button.add') }}</el-button>
        <el-button v-if="button.delete" type="primary" icon="el-icon-delete" @click="deleteDialogVisible = true" :disabled="userSelection.length === 0">{{ $t('button.delete') }}</el-button>
        <el-button v-if="button.download" type="primary" icon="el-icon-download" @click="handleDownloadTemp">{{ $t('button.template') }}</el-button>
        <el-button v-if="button.import" type="primary" icon="el-icon-upload2" @click="handleDialogOpen('import')">{{ $t('button.import') }}</el-button>
        <!-- <el-upload v-if="button.import" class="uploadExcel" :show-file-list="false" :headers="importHeaders" :before-upload="handleBeforeUpload" :on-success="handleSuccessUpload" :on-error="handleErrorUpload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" :action="importUrl">
          <el-button type="primary" icon="el-icon-upload2">{{
            $t('button.import')
          }}</el-button>
        </el-upload> -->
        <el-button v-if="button.export" type="primary" icon="el-icon-download" @click="handleDownload" :disabled="userList.length === 0">{{ $t('button.export') }}</el-button>
      </div>
      <!-- 表格 -->
      <div class="result clearfix" v-loading="listLoading">
        <div class="caption">{{ $t('account.userList') }}</div>
        <el-table ref="resultTable" stripe border max-height="590" :data="userList" row-key="userId" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" @sort-change="handleSortChange" highlight-current-row>
          <el-table-column type="selection" width="60"></el-table-column>
          <el-table-column type="index" :label="$t('common.no')" width="70" :index="userRealQuery.pageSize * (userRealQuery.pageNumber - 1) + 1"></el-table-column>
          <el-table-column sortable="custom" prop="userName" :label="$t('account.userName')"></el-table-column>
          <el-table-column prop="realName" :label="$t('account.realName')"></el-table-column>
          <el-table-column prop="phoneNumb" :label="$t('account.phoneNo')" width="145"></el-table-column>
          <el-table-column prop="userPic" :label="$t('account.photoPath')">
            <template slot-scope="scope">
              <img class="imgContain" :src="scope.row.userPic" alt />
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="createTime" :label="$t('account.registrationTime')" width="171"></el-table-column>
          <template v-if="button.unlock">
            <el-table-column prop="status" :label="$t('account.lock')" width="90">
              <template slot-scope="scope">
                <i v-if="scope.row.status == 0" class="dangerText el-icon-lock" style="font-size:30px;" @click="handleDeleteAndStatus(1,scope.row)"></i>
                <i v-else class="successText el-icon-unlock" style="font-size:30px;" @click="handleDeleteAndStatus(0,scope.row)"></i>
              </template>
            </el-table-column>
          </template>
          <el-table-column sortable="custom" prop="userType" :label="$t('account.accountType')">
            <span slot-scope="scope">{{ $t(`account.userType${scope.row.userType}`) }}</span>
          </el-table-column>
          <el-table-column sortable="custom" prop="roleName" :label="$t('account.role')"></el-table-column>
          <el-table-column sortable="custom" prop="lastLoginTime" :label="$t('account.latestLoginTime')" width="171"></el-table-column>
          <el-table-column :label="$t('common.operation')" width="180">
            <template slot-scope="scope">
              <el-button v-if="button.edit" size="mini" type="primary" icon="el-icon-edit" @click="handleDialogOpen('edit', scope.row)" plain>{{ $t('button.edit') }}</el-button>
              <el-button v-if="button.details" size="mini" type="primary" @click="handleDialogOpen('details', scope.row)" plain>{{ $t('button.details') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="currentTotal">
          {{ $t('common.currentPage') }} {{ userList.length }}
          {{ $t('common.unit') }}
        </div>
        <el-pagination @size-change="handleSizeChange($event, 'user')" @current-change="handleCurrentChange($event, 'user')" :current-page="userRealQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="userRealQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="userTotal" background></el-pagination>
      </div>
    </div>
    <!-- 新增对话框 -->
    <el-dialog :title="$t('button.add')" :visible.sync="addDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('add')">
      <el-form :model="addForm" label-width="7.5rem" :rules="addOrEditFormRules" ref="addForm" :validate-on-rule-change="false">
        <div class="dialogTitle">{{ $t('role.basic') }}</div>
        <!-- <el-form-item prop="userPic" label-width="0" class="avatarItem">
          <el-upload class="avatar-uploader" action="string" :show-file-list="false" :before-upload="handleBeforePhotoUpload" accept="image/bmp, image/jpeg, image/png">
            <el-image v-if="addForm.userPic" :src="addForm.userPic" class="avatar" fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="tip">{{ $t('message.photoMessage') }}</div>
          </el-upload>
          <el-input v-model="addForm.userPic" :placeholder="$t('placeholder.input')" type="hidden" style="display:none"></el-input>
        </el-form-item> -->
        <el-form-item :label="$t('account.userName')" prop="userName">
          <el-input v-model.trim="addForm.userName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('account.realName')" prop="realName">
          <el-input v-model.trim="addForm.realName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('account.entryTime')" prop="entryTime">
          <el-date-picker v-model="addForm.entryTime" :placeholder="$t('placeholder.select')" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item> -->
        <el-form-item :label="$t('account.newPassword')" prop="password">
          <el-input v-model.trim="addForm.password" :placeholder="$t('placeholder.input')" type="password" maxlength="30" autocomplete="new-password"></el-input>
          <!-- autocomplete="new-password" 解决默认记住密码，打开覆盖的问题-->
        </el-form-item>
        <el-form-item :label="$t('account.newPasswordAgain')" prop="passwordAgain">
          <el-input v-model.trim="addForm.passwordAgain" :placeholder="$t('placeholder.input')" type="password" maxlength="30" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.position')" prop="positionId">
          <el-select v-model="addForm.positionId" :placeholder="$t('placeholder.select')">
            <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('account.leader')" prop="leaderName">
          <!-- <el-select v-model="addForm.leader" :placeholder="$t('placeholder.select')">
            <el-option label="督导" :value="1">
            </el-option>
            <el-option label="店长" :value="2">
            </el-option>
          </el-select> ref='editLeader'为了让ie没有光标 -->
          <el-input ref='addLeader' v-model="addForm.leaderName" readonly :placeholder="$t('placeholder.input')" @focus="handleDialogOpen('leader')"></el-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('account.phoneNo')" required>
          <el-col :span="9">
            <el-form-item prop="phonePrefix" style="width: 100%;min-width:auto">
              <el-select v-model="addForm.phonePrefix" filterable :placeholder="$t('placeholder.select')" style="width: 100%;">
                <el-option v-for="(item, index) in prefixOptions" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="1" style="text-align:center">-</el-col>
          <el-col :span="14">
            <el-form-item prop="phoneNumb" style="width: 100%;min-width:auto">
              <el-input v-model.trim="addForm.phoneNumb" :placeholder="$t('placeholder.input')" maxlength="30" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('account.email')" prop="emailAddr">
          <el-input v-model.trim="addForm.emailAddr" :placeholder="$t('placeholder.input')" maxlength="50"></el-input>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('account.dingAccount')" prop="dingdingUserId">
          <el-select v-model="addForm.dingdingUserId" :placeholder="$t('placeholder.select')">
            <el-option label="钉钉账号1" :value="1"></el-option>
            <el-option label="钉钉账号2" :value="2"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('account.accountType')" prop="userType" class="mb12">
          <el-radio-group v-model="addForm.userType">
            <el-radio :label="1">{{ $t('account.accountType1') }}</el-radio>
            <el-radio :label="0">{{ $t('account.accountType0') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('account.loginMode')" prop="loginMethod" class="mb12">
          <el-radio-group v-model="addForm.loginMethod">
            <el-radio :label="1">{{ $t('account.loginMode1') }}</el-radio>
            <el-radio :label="2">{{ $t('account.loginMode2') }}</el-radio>
          </el-radio-group>
          <!-- <el-input v-model="addForm.loginMode" :placeholder="$t('placeholder.input')"></el-input> -->
        </el-form-item>
        <div class="dialogTitle">{{ $t('role.rolePermissions') }}</div>
        <el-form-item :label="$t('account.roleAndPermissions')" prop="roleId">
          <el-select v-model="addForm.roleId" multiple collapse-tags @change="handleRoleChange('add')" :placeholder="$t('placeholder.select')">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
          <!-- <el-select v-model="addForm.roleId" :placeholder="$t('placeholder.select')">
            <el-option v-for="(item, index) in roleOptions" :key="index" :label="item.text" :value="item.value"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item class="checkbox" style="margin-bottom:0">
          <div class="rightsList" v-for="level1 in addRightsOptions" :key="level1.id">
            <p><span></span>{{level1.label}}</p>
            <template v-for="level2 in level1.children">
              <el-checkbox disabled checked :key="level2.id">{{level2.label}}</el-checkbox>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('add')" :disabled="addDisabled">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog :title="$t('button.edit')" :visible.sync="editDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('edit')">
      <el-form :model="editForm" label-width="7.5rem" :rules="addOrEditFormRules" ref="editForm" :validate-on-rule-change="false">
        <div class="dialogTitle">{{ $t('role.basic') }}</div>
        <!-- <el-form-item prop="userPic" label-width="0" class="avatarItem">
          <el-upload class="avatar-uploader" action="string" :show-file-list="false" :before-upload="handleBeforePhotoUpload" accept="image/bmp, image/jpeg, image/png">
            <el-image v-if="editForm.userPic" :src="editForm.userPic" class="avatar" fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="tip">{{ $t('message.photoMessage') }}</div>
          </el-upload>
          <el-input v-model="editForm.userPic" :placeholder="$t('placeholder.input')" type="hidden" style="display:none"></el-input>
        </el-form-item> -->
        <el-form-item :label="$t('account.userName')" prop="userName">
          <el-input v-model.trim="editForm.userName" :placeholder="$t('placeholder.input')" disabled></el-input>
        </el-form-item>
        <!-- <el-form-item :label="$t('account.realName')" prop="realName">
          <el-input v-model.trim="editForm.realName" :placeholder="$t('placeholder.input')"></el-input>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('account.entryTime')" prop="entryTime">
          <el-date-picker v-model="editForm.entryTime" :placeholder="$t('placeholder.select')" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item> -->
        <el-form-item :label="$t('account.newPassword')" prop="password">
          <el-input v-model.trim="editForm.password" :placeholder="$t('placeholder.input')" type="password" maxlength="30" autocomplete="new-password"></el-input>
          <!-- autocomplete="new-password" 解决默认记住密码，打开覆盖的问题-->
        </el-form-item>
        <el-form-item :label="$t('account.newPasswordAgain')" prop="passwordAgain">
          <el-input v-model.trim="editForm.passwordAgain" :placeholder="$t('placeholder.input')" type="password" maxlength="30" autocomplete="new-password"></el-input>
        </el-form-item>
        <el-form-item :label="$t('account.position')" prop="positionId">
          <el-select v-model="editForm.positionId" :placeholder="$t('placeholder.select')">
            <el-option v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('account.leader')" prop="leaderName">
          <el-input ref='editLeader' v-model="editForm.leaderName" readonly :placeholder="$t('placeholder.input')" @focus="handleDialogOpen('leader')"></el-input>
          <!-- <el-input v-model="editForm.leader" :placeholder="$t('placeholder.input')"></el-input> -->
        </el-form-item>
        <!-- <el-form-item :label="$t('account.phoneNo')" required>
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
              <el-input v-model.trim="editForm.phoneNumb" :placeholder="$t('placeholder.input')" maxlength="30" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('account.email')" prop="emailAddr">
          <el-input v-model.trim="editForm.emailAddr" :placeholder="$t('placeholder.input')" maxlength="50"></el-input>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('account.dingAccount')" prop="dingdingUserId">
          <el-select v-model="editForm.dingdingUserId" :placeholder="$t('placeholder.select')">
            <el-option label="钉钉账号1" :value="1"></el-option>
            <el-option label="钉钉账号2" :value="2"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('account.accountType')" prop="userType" class="mb12">
          <el-radio-group v-model="editForm.userType">
            <el-radio :label="1">{{ $t('account.accountType1') }}</el-radio>
            <el-radio :label="0">{{ $t('account.accountType0') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('account.loginMode')" prop="loginMethod" class="mb12">
          <el-radio-group v-model="editForm.loginMethod">
            <el-radio :label="1">{{ $t('account.loginMode1') }}</el-radio>
            <el-radio :label="2">{{ $t('account.loginMode2') }}</el-radio>
          </el-radio-group>
          <!-- <el-input v-model="editForm.loginMethod" :placeholder="$t('placeholder.input')"></el-input> -->
        </el-form-item>
        <div class="dialogTitle">{{ $t('role.rolePermissions') }}</div>
        <el-form-item :label="$t('account.roleAndPermissions')" prop="roleId">
          <el-select v-model="editForm.roleId" multiple collapse-tags @change="handleRoleChange('edit')" :placeholder="$t('placeholder.select')">
            <el-option v-for="item in roleOptions" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
          <!-- <el-select v-model="addForm.roleId" :placeholder="$t('placeholder.select')">
            <el-option v-for="(item, index) in roleOptions" :key="index" :label="item.text" :value="item.value"></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item class="checkbox" style="margin-bottom:0">
          <div class="rightsList" v-for="level1 in editRightsOptions" :key="level1.id">
            <p><span></span>{{level1.label}}</p>
            <template v-for="level2 in level1.children">
              <el-checkbox disabled checked :key="level2.id">{{level2.label}}</el-checkbox>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleAddOrEdit('edit')" :disabled="editDisabled">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 删除对话框 -->
    <el-dialog :title="$t('button.delete')" :visible.sync="deleteDialogVisible" :close-on-click-modal="false">
      <div class="deleteInfo">
        <i class="el-icon-warning"></i><span>{{ $t('message.isDeleteUser') }}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleDeleteAndStatus(2)">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 详情 v-if="detailsDialogVisible"-->
    <div class="details" v-show="detailsDialogVisible">
      <div class="queryForm">
        <el-button type="primary" icon="el-icon-arrow-left" @click="handleDialogClose('details')">{{ $t('button.back') }}</el-button>
      </div>
      <!-- 基本信息 -->
      <div class="result basic">
        <div class="title">
          <i class="el-icon-collection-tag"></i>{{ $t('role.basic') }}
        </div>
        <!-- v-if="detailsDialogVisible" -->
        <el-table>
          <el-table-column width="160">
            <template slot="header">
              <div style="line-height:1">
                <!-- v-if="detailsForm.userPic"  -->
                <el-image v-if="detailsForm.userPic" :src="detailsForm.userPic" fit="contain">
                  <div slot="error" class="image-slot">
                    <!-- <i class="el-icon-user-solid" style="font-size:70px"></i> -->
                    <!-- <i class="el-icon-picture-outline"></i> -->
                  </div>
                </el-image>
                <i v-else class="el-icon-user-solid" style="font-size:80px"></i>
              </div>
              <p style="line-height:1.8;width:100%;margin-bottom:5px">{{ detailsForm.userName }}</p>
              <div style="line-height:1.8;min-width:60%;padding:0 15px;border-radius:100px;background-color:#ffcc00">{{ detailsForm.type }}</div>
            </template>
          </el-table-column>
          <el-table-column label="ID" width="150">
            <el-table-column :label="$t('account.realName')" width="150">
              <el-table-column :label="$t('account.userName')" width="150">
                <el-table-column :label="$t('account.phoneNo')" width="150">
                  <el-table-column :label="$t('account.leader')" width="150">
                    <el-table-column :label="$t('account.wechat')" width="150">
                      <el-table-column :label="$t('account.remark')" width="150">
                      </el-table-column>
                    </el-table-column>
                  </el-table-column>
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column>
            <template slot="header">
              {{ detailsForm.userId }}
            </template>
            <el-table-column label="">
              <template slot="header">
                {{ detailsForm.realName }}
              </template>
              <el-table-column label="">
                <template slot="header">
                  {{ detailsForm.userName }}
                </template>
                <el-table-column label="">
                  <template slot="header">
                    {{ detailsForm.phoneNumb }}
                  </template>
                  <el-table-column label="">
                    <template slot="header">
                      {{ detailsForm.leaderName }}
                    </template>
                    <el-table-column label="">
                      <template slot="header">
                        {{ detailsForm.wechat }}
                      </template>
                      <el-table-column label="">
                        <template slot="header">
                          {{ detailsForm.remark }}
                        </template>
                      </el-table-column>
                    </el-table-column>
                  </el-table-column>
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="$t('account.registrationTime')" width="150">
            <el-table-column :label="$t('account.email')" width="150">
              <el-table-column :label="$t('account.managedShops')" width="150">
                <el-table-column :label="$t('account.entryTime')" width="150">
                  <el-table-column :label="$t('account.dingAccount')" width="150">
                    <el-table-column :label="$t('account.loginMode')" width="150">
                      <el-table-column label="" width="150">
                      </el-table-column>
                    </el-table-column>
                  </el-table-column>
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table-column>
          <el-table-column>
            <template slot="header">
              {{ detailsForm.createTime }}
            </template>
            <el-table-column label="">
              <template slot="header">
                {{ detailsForm.emailAddr }}
              </template>
              <el-table-column label="">
                <template slot="header">
                  {{ detailsForm.shopCount }}
                </template>
                <el-table-column label="">
                  <template slot="header">
                    {{ detailsForm.entryTime }}
                  </template>
                  <el-table-column label="">
                    <template slot="header" slot-scope="scope">
                      {{ detailsForm.dingdingUserName}}
                    </template>
                    <el-table-column label="">
                      <h3 class="detailsRadio" slot="header" slot-scope="scope">
                        <el-radio-group :value="detailsForm.loginMethod" style="height:20px;line-height:30px" class="detailsRadio">
                          <el-radio :label="1">{{ $t('account.loginMode1') }}</el-radio>
                          <el-radio :label="2">{{ $t('account.loginMode2') }}</el-radio>
                        </el-radio-group>
                        <p class="mask"></p>
                      </h3>
                      <el-table-column label="">
                        <template slot="header">
                        </template>
                      </el-table-column>
                    </el-table-column>
                  </el-table-column>
                </el-table-column>
              </el-table-column>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <!-- 所属角色 -->
      <div class="result clearfix">
        <div class="title">
          <i class="el-icon-collection-tag"></i>{{ $t('account.subordinateRole') }}
        </div>
        <el-table ref="resultTable" stripe border :data="detailsTable1" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" highlight-current-row>
          <el-table-column prop="userName" :label="$t('account.userName')" width="160"></el-table-column>
          <el-table-column prop="roleName" :label="$t('account.role')"></el-table-column>
        </el-table>
      </div>
      <!-- 所属组织架构 -->
      <div class="result clearfix">
        <div class="title">
          <i class="el-icon-collection-tag"></i>{{ $t('account.subordinateOrg') }}
        </div>
        <el-table ref="resultTable" v-loading="orgLoading" stripe border :data="detailsTable2" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" highlight-current-row>
          <el-table-column prop="userName" :label="$t('account.userName')" width="160"></el-table-column>
          <el-table-column prop="orgName" :label="$t('org.organ')"></el-table-column>
        </el-table>
      </div>
      <!-- 权限列表 -->
      <div class="result clearfix">
        <div class="title">
          <i class="el-icon-collection-tag"></i>{{ $t('role.permissions') }}
        </div>
        <el-table ref="resultTable" stripe border max-height="590" :data="detailsTable3" tooltip-effect="dark" style="width: 100%;" @sort-change="handleSortChange" highlight-current-row>
          <el-table-column prop="name" :label="$t('account.name')" width="160"></el-table-column>
          <el-table-column prop="roleDesc" :label="$t('role.juris')"></el-table-column>
        </el-table>
      </div>
      <!-- 登录日志 -->
      <div class="result clearfix" style="padding-bottom: 20px">
        <div class="title">
          <i class="el-icon-collection-tag"></i>{{ $t('tabs.loginLog') }}
        </div>
        <el-table ref="resultTable" stripe border max-height="630" :data="logList" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
          <el-table-column prop="logTime" :label="$t('log.loginHour')"></el-table-column>
          <el-table-column prop="loginIp" label="IP"></el-table-column>
          <!-- <el-table-column prop="loginLocation" :label="$t('log.location')"></el-table-column> -->
          <el-table-column prop="loginDevice" :label="$t('account.logTerminal')"></el-table-column>
          <el-table-column prop="content" :label="$t('log.operContent')"></el-table-column>
        </el-table>
        <div class="currentTotal">
          {{ $t('common.currentPage') }} {{ logList.length }}
          {{ $t('common.unit') }}
        </div>
        <el-pagination @size-change="handleSizeChange($event, 'log')" @current-change="handleCurrentChange($event, 'log')" :current-page="logRealQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="logRealQuery.pageSize" layout=" prev, pager, next,sizes,total" :total="logTotal" background></el-pagination>
      </div>
    </div>
    <!-- 直属上级 -->
    <el-dialog class="innerDialog" :title="$t('account.leaderSelect')" :visible.sync="leaderDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('leader')">
      <div>
        <el-form ref="leaderQuery" :model="leaderQuery" class="clearfix" :rules="userQueryRules">
          <el-form-item prop="searchName">
            <el-input :placeholder="$t('placeholder.userName1')" v-model="leaderQuery.searchName">
              <el-button slot="append" icon="el-icon-search" @click="handleQuery('leader')"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="result clearfix">
        <el-table ref="leaderTable" max-height="500" :data="leaderList" @row-click="handleRowClick" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
          <el-table-column prop="userName" :label="$t('account.userList')"></el-table-column>
        </el-table>
        <el-pagination @size-change="handleSizeChange($event, 'leader')" @current-change="handleCurrentChange($event, 'leader')" :current-page.sync="leaderRealQuery.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="leaderRealQuery.pageSize" layout=" prev, pager, next,sizes" :pager-count="5" :total="leaderTotal" background></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="leaderDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleLeader">{{ $t('button.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog class="importDialog" :title="$t('button.import') + $t('account.user')" :visible.sync="importDialogVisible" :close-on-click-modal="false" @closed="handleDialogClose('import')">
      <div class="flex-hc importBox">
        <span>{{ $t('org.selectFile') }}</span>
        <div class="importFileInfo">
          <a class="el-upload-list__item-name" v-if="this.importFile">
            <i class="el-icon-document"></i>{{this.importFile.name}}
          </a>
        </div>
        <!-- :show-file-list="false" -->
        <el-upload class="importUpload" :show-file-list="false" :before-upload="handleBeforeUpload" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" action="string">
          <el-button size="small" type="primary">{{ $t('button.browse') }}</el-button>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">{{ $t('button.cancel') }}</el-button>
        <el-button type="primary" @click="handleImport">{{ $t('button.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import $utils from '@/utils'
import AES from '@/utils/aes'
export default {
  data() {
    return {
      busiOrgTree: [],
      // 查询表单数据
      userQuery: {
        orgId: [],
        searchName: '' // 名称
      },
      userRealQuery: {
        sortKey: '',
        sortValue: '',

        pageNumber: 1, // 当前页
        pageSize: 10, // 一页显示多少条
        type: 2, // 1.企业用户 2.业务用户
        moduleId: 1
      }, // 当前表格的查询条件
      userList: [],
      userTotal: 0,
      userSelection: [],
      listLoading: false,
      currentRow: {},

      // photoFile: '', // 图片文件
      roleOptions: [], // 编辑或者新增的角色列表
      // prefixOptions: [], // 号码前缀
      type: '', // 操作类型，如add/edit

      addDialogVisible: false,
      addForm: {
        // userPic: '',
        userName: '',
        // realName: '',
        // entryTime: '',
        password: '',
        passwordAgain: '',
        positionId: '',
        leader: '',
        leaderName: '',
        // phonePrefix: '86',
        // phoneNumb: '',
        // emailAddr: '',
        // dingdingUserId: '', // 下拉框选择项？
        userType: 1,
        loginMethod: 2, // 单点2和复用1代表数字
        roleId: [],
        status: 1
      },
      addRightsOptions: [],
      addDisabled: false,

      editDialogVisible: false,
      editForm: {},
      editRightsOptions: [],
      editDisabled: false,

      detailsDialogVisible: false,
      detailsForm: {}, // 高亮的数据
      detailsTable1: [],
      detailsTable2: [],
      orgLoading: false,
      detailsTable3: [],

      // 登录日志
      logList: [],
      logTotal: 0,
      logRealQuery: {
        pageNumber: 1,
        pageSize: 10
      },

      detailsRightsOptions: [],

      deleteDialogVisible: false,

      leaderDialogVisible: false, // 直属上级
      leaderQuery: {
        searchName: '' // 名称
      },
      leaderRealQuery: {
        pageNumber: 1, // 当前页
        pageSize: 10, // 一页显示多少条

        onlySearch: 'userName', // 只查询用户名
        type: 2,
        moduleId: 1
      },
      leaderList: [],
      leaderTotal: 0,

      activeLeaderRow: {},

      importDialogVisible: false,
      importFile: '',
      // importDisabled: false,
      // importUrl: this.$api.apiBase + this.$api.importUser, // 导入的地址
      // importHeaders: { Authorization: sessionStorage.getItem('authorization') }, // 导入的请求头
      userId: JSON.parse(sessionStorage.getItem('user')).userId, // 是否是当前用户
      timeoutId: null, // 3秒跳登录，离开页面清延时器
      moduleId: 1, // 基础模块
      button: {},
      options: []
    }
  },
  computed: {
    ...mapGetters(['language']),
    // 查询验证规则
    userQueryRules() {
      return {
        // org: [
        //   {
        //     required: true,
        //     trigger: 'change',
        //     message: this.$t('message.select')
        //   }
        // ],
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
        // userPic: [
        //   {
        //     required: true,
        //     trigger: 'change',
        //     message: this.$t('message.choosePhoto')
        //     // pattern: this.$utils.reg.name
        //   }
        // ],
        userName: [{
          required: true,
          trigger: 'blur',
          // pattern: this.$utils.reg.userName,
          // message: this.$t('message.userName'),
          validator: (rule, value, callback) => {
            // console.log(this.$utils.reg.userName, value, this.$utils.reg.userName.test(value))
            if (this.$utils.reg.userName.test(value)) {
              // 验证成功后
              // 发送请求看是否重复
              if (this.type === 'edit') {
                callback()
              } else {
                this.$store.dispatch('isValueRepeat', { moduleVal: 'busiUser', value, callback })
              }
            } else {
              callback(new Error(this.$t('message.userName')))
            }
          }
        }],
        // realName: [
        //   {
        //     required: true,
        //     trigger: 'blur',
        //     pattern: this.$utils.reg.name,
        //     message: this.$t('message.noEmpty')
        //   }
        // ],
        // entryTime: [
        //   {
        //     required: true,
        //     trigger: 'blur',
        //     message: this.$t('message.select')
        //   }
        // ],
        password: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            var form = `${this.type}Form`
            var psdReg = this.$utils.reg.password
            if (this.type === 'edit') {
              if (value === this.currentRow.password) {
                callback()
                this.$refs[form].validateField('passwordAgain')
              }
            }
            // console.log(value)
            // console.log(psdReg.test(value))
            if (!psdReg.test(value)) {
              callback(new Error(this.$t('message.inputPassword')))
            } else {
              if (this[form].passwordAgain !== '') {
                this.$refs[form].validateField('passwordAgain')
              }
              callback()
            }
          }
        }],
        passwordAgain: [{
          required: true,
          trigger: 'blur',
          // pattern: this.$utils.reg.password,
          validator: (rule, value, callback) => {
            var form = `${this.type}Form`
            var psdReg = this.$utils.reg.password
            if (this.type === 'edit') {
              if (value === this[form].password && value === this.currentRow.password) {
                callback()
              }
            }
            if (!psdReg.test(value)) {
              callback(new Error(this.$t('message.inputPassword')))
            } else if (value !== this[form].password) {
              callback(new Error(this.$t('message.psdNotSame')))
            } else {
              callback()
            }
          }
        }],
        // positionId: [{
        //   trigger: 'blur',
        //   validator: (rule, value, callback) => {
        //     if (value === '') {
        //       callback(new Error(this.$t('common.noEmpty')))
        //     }
        //     callback()
        //   }
        // }],
        // leaderName: [
        //   {
        //     required: true,
        //     trigger: 'change',
        //     message: this.$t('message.select')
        //   }
        // ],
        // phonePrefix: [{
        //   required: true,
        //   trigger: 'change',
        //   message: this.$t('message.select'),
        //   validator: (rule, value, callback) => {
        //     var form = `${this.type}Form`
        //     // if (this[form].phoneNumb) {
        //     // console.log(form)
        //     if (value) {
        //       if (this.$utils.reg.phoneNoA.test(this[form].phoneNumb)) {
        //         this.$refs[form].validateField('phoneNumb')
        //       }
        //       callback()
        //     } else {
        //       callback(new Error(this.$t('message.select')))
        //     }
        //     // } else {
        //     // callback(new Error(this.$t('message.select')))
        //     // }
        //   }
        // }],
        // phoneNumb: [{
        //   required: true,
        //   trigger: 'blur',
        //   // pattern: this.$utils.reg.phoneNoA,
        //   // message: this.$t('message.inputRight'),
        //   validator: (rule, value, callback) => {
        //     var form = `${this.type}Form`
        //     var phoneNORegA = this.$utils.reg.phoneNoA
        //     var phoneNORegC = this.$utils.reg.phoneNoC1
        //     var phoneNORegC1 = this.$utils.reg.phoneNoC2
        //     // 全部的手机号码验证
        //     if (!phoneNORegA.test(value)) {
        //       // 验证不通过
        //       callback(new Error(this.$t('message.inputRight')))
        //     } else {
        //       // this.$refs[form].validateField('phonePrefix')
        //       // 验证通过
        //       // if (this[form].phonePrefix === '86' && !phoneNORegC.test(value)) {
        //       //   // 是中国的且验证不通过
        //       //   callback(new Error(this.$t('message.inputPhoneC')))
        //       // } else {
        //       //   // 不是/是且验证通过
        //       //   callback()
        //       // }
        //       let reg = (this[form].phonePrefix === '86' && !phoneNORegC.test(value)) ||
        //         (this[form].phonePrefix === '886' && !phoneNORegC1.test(value))
        //       if (reg) {
        //         callback(new Error(this.$t('message.inputRight')))
        //       } else {
        //         callback()
        //       }
        //     }
        //     // else {
        //     //   // callback()
        //     //   callback(new Error(this.$t('message.input')))
        //     // }
        //   }
        // }],
        // emailAddr: [
        //   {
        //     trigger: 'blur',
        //     pattern: this.$utils.reg.email,
        //     message: this.$t('message.inputRight')
        //   }
        // ],
        userType: [{
          required: true,
          trigger: 'change',
          message: this.$t('message.select')
        }],
        loginMethod: [{
          required: true,
          trigger: 'change',
          message: this.$t('message.select')
        }],
        roleId: [{
          required: true,
          trigger: 'change',
          message: this.$t('message.select')
        }]
      }
    }
  },
  watch: {
    // language: {
    //   handler: function (newLang, oldLang) {
    //     // console.log(newLang, oldLang, this)
    //     // 获取button权限
    //     if (newLang === 'cn') {
    //       this.prefixOptions = this.$utils.formatPrefixCN()
    //     } else if (newLang === 'en') {
    //       this.prefixOptions = this.$utils.formatPrefixEN()
    //     }
    //   },
    //   immediate: true
    // },
    // 修改最后一页删除的bug
    userTotal() {
      if (
        this.userTotal ===
        (this.userRealQuery.pageNumber - 1) * this.userRealQuery.pageSize &&
        this.userTotal !== 0
      ) {
        this.userRealQuery.pageNumber -= 1
        this.getUserList() // 获取列表数据
      }
    }
  },
  created() { this.init() },
  mounted() { },
  methods: {
    // 进页面就发的请求
    init() {
      this.$utils.getButton(this.$route.path, 2).then(res => {
        this.button = res
      })// 获取按钮权限
      this.getUserList()// 获取列表数据
      this.getRoleList()// 获取角色列表
      this.$store.dispatch('busiGetOrgTree', { url: 'getOrgTree', orgType: 2 }).then(res => {
        this.busiOrgTree = res
      }) // 获取查询的组织架构
    },
    // 获取列表数据
    getUserList(type = 'user', isInitial) {
      var options
      if (type === 'leader') {
        if (isInitial) {
          this.leaderRealQuery = {
            pageNumber: 1,
            pageSize: 10,
            onlySearch: 'userName',
            type: 2,
            moduleId: 1
          }
        }
        options = this.leaderRealQuery
      } else {
        this.listLoading = true
        options = this.userRealQuery
      }
      this.$http.posts('userList', options)
        .then(res => {
          let data = res.data
          if (type === 'leader') {
            this.leaderList = data.list || []
            this.leaderTotal = data.total || 0
          } else {
            this.listLoading = false
            let list = data.list || []
            this.userTotal = data.total || 0
            this.userList = list.map((item, index) => {
              // todo
              var dingdingUserName
              if (item.dingdingUserId == 1) {
                dingdingUserName = '钉钉账号1'
              } else if (item.dingdingUserId == 2) {
                dingdingUserName = '钉钉账号2'
              } else {
                dingdingUserName = ''
              }
              return {
                ...item,
                phoneNumb: item.showPhone && this.$utils.exchangePrefix(item.showPhone),
                roleId: item.roleId && item.roleId.split(','),
                dingdingUserId: item.dingdingUserId && Number(item.dingdingUserId),
                dingdingUserName: dingdingUserName
              }
            })
          }
        })
        .catch(er => {
          console.log(er)
          if (type === 'leader') {
            this.leaderList = []
            this.leaderTotal = 0
          } else {
            this.listLoading = false
            this.userList = []
            this.userTotal = 0
          }
        })
    },
    // 获取角色下拉框
    getRoleList() {
      this.$http.posts('selectRole')
        .then(res => {
          this.roleOptions = res.data
        })
    },
    // 根据角色ids获取到权限
    getRoleMenuTree(type, ids) {
      this.$http.posts('getRoleMenuTree', '', { ...ids, moduleId: this.moduleId })
        .then(res => {
          // this[`${type}RightsOptions`] = this.$utils.rightsLevel(res.data.data)
          this[`${type}RightsOptions`] = this.$utils.rightsLevel(res.data)
          if (type === 'details') {
            var rightsOptions = this.$utils.rightsLevel(this.detailsRightsOptions)
            var detailsRightsOptions = rightsOptions.map(item => {
              return {
                name: item.label,
                roleDesc: item.children.map(citem => citem.label).join() || item.label
              }
            })
            // console.log(rightsOptions, this.detailsRightsOptions)
            this.detailsTable3 = detailsRightsOptions
          }
        })
    },
    // 根据用户id获取组织架构
    getUserOrg(row) {
      this.orgLoading = true
      this.$http.posts('userOrg', '', { userId: row.userId })
        .then(res => {
          this.orgLoading = false
          // console.log(res)
          var data = res.data
          // 所属架构
          this.detailsTable2 = [{
            userName: row.userName,
            orgName: data.name
          }]
        })
        .catch(er => {
          this.orgLoading = false
          // 所属架构
          this.detailsTable2 = [{
            userName: row.userName,
            orgName: ''
          }]
        })
    },
    // 获取用户登录日志
    getLogList(isInitial) {
      if (isInitial) this.logRealQuery = { pageNumber: 1, pageSize: 10 }
      this.$http.posts('userLogList', { ...this.logRealQuery, userId: this.detailsForm.userId }, '')
        .then(res => {
          let data = res.data
          this.logList = data.list || []
          this.logTotal = data.total || 0
        })
    },
    // 查询数据
    handleQuery(type = 'user') {
      this.$refs[`${type}Query`].validate(valid => {
        if (valid) {
          this[`${type}RealQuery`] = { ...this[`${type}RealQuery`], ...this[`${type}Query`], pageNumber: 1, pageSize: 10 }
          var realQuery = this[`${type}RealQuery`]
          if (type !== 'leader') realQuery.orgId = realQuery.orgId.join()
          this.getUserList(type)
        } else {
          // console.log('error 验证错误query!!')
          return false
        }
      })
    },
    // 多选选中
    handleSelectionChange(val) {
      this.userSelection = val
    },
    // 一页显示多少条
    handleSizeChange(val, type = 'user') {
      this[`${type}RealQuery`].pageSize = val
      type === 'log' ? this.getLogList() : this.getUserList(type)
    },
    // 当前第几页
    handleCurrentChange(val, type = 'user') {
      this[`${type}RealQuery`].pageNumber = val
      type === 'log' ? this.getLogList() : this.getUserList(type)
    },
    // 排序
    handleSortChange(data) {
      // let sortValue, sortKey
      // console.log(data)
      if (data.order === 'ascending') {
        this.userRealQuery.sortValue = 'asc'
      } else if (data.order === 'descending') {
        this.userRealQuery.sortValue = 'desc'
      } else {
        this.userRealQuery.sortValue = ''
        this.userRealQuery.sortKey = ''
        // this.listParams = { ...this.paging, type: 2 }
        this.getUserList()
        return false
      }
      // console.log(data, data.prop)
      this.userRealQuery.sortKey = data.prop
      if (data.prop === 'type') this.userRealQuery.sortKey = ''
      this.getUserList()
    },
    // 获取所有职位
    getAllPostion() {
      this.$http.posts('acPositionList')
        .then(res => {
          let data = res.data
          this.options = []
          data.forEach(item => {
            this.options.push({
              label: item.positionName,
              value: item.positionId
            })
          })
        })
    },
    // 新增/修改/详情/删除对话框打开
    handleDialogOpen(type, row) {
      if (type === 'leader') {
        this.$refs[`${this.type}Leader`].blur()// ie下去掉光标
        this.getUserList('leader', true)
      } else {
        this.type = type
      }
      if (type === 'add') {
        this.getAllPostion()
        // this.getUserList('leader', true)
        this.$store.dispatch('isHasRole', 2).then(res => {
          this[`${type}DialogVisible`] = res
        })
      } else if (type === 'edit') {
        this.getAllPostion()
        // console.log(row)
        // this.getUserList('leader', true)
        // 是为了暂存回显的初始密码，验证用
        var password = +new Date() + parseInt(Math.random() * (9999999999 + 1)).toString()
        var { userId, userName, positionId, leader, leaderName, userType, loginMethod, roleId } = row
        this.editForm = {
          userId,
          userName,
          password,
          passwordAgain: password,
          positionId,
          leader,
          leaderName,
          userType,
          loginMethod, // 单点2和复用1代表数字
          roleId,
          status: 2,
          isChangePsd: false // 是否修改密码
        }
        this.currentRow = { ...this.editForm }
        this.handleRoleChange('edit')
        this.$nextTick(() => {
          // 应该放这里，在closed关闭时，上面form值改变，change的会触发验证，blur的不会
          this.$refs.editForm.clearValidate()
        })
      } else if (type === 'details') {
        this.detailsForm = { ...row }
        this.getUserOrg(row)
        this.getLogList(true)
        // 所属角色
        // console.log('details', this.detailsForm)
        this.detailsTable1 = [{
          userName: row.userName,
          roleName: row.roleName
        }]
        this.handleRoleChange(type)
      }
      if (type !== 'add') {
        this[`${type}DialogVisible`] = true
      }
    },
    // // 所有图片上传之前
    // handleBeforePhotoUpload(file) {
    //   // console.log(file)
    //   const isrightType =
    //     file.type === 'image/bmp' ||
    //     file.type === 'image/jpeg' ||
    //     file.type === 'image/png'
    //   const isLt2M = file.size / 1024 / 1024 < 2
    //   // console.log(isrightType)
    //   if (!isrightType) {
    //     this.$utils.$message({
    //       type: 'error',
    //       message: file.name + ',' + this.$t('message.photoTypeWrong')
    //     })
    //   }
    //   if (!isLt2M) {
    //     this.$utils.$message({
    //       type: 'error',
    //       message: file.name + ',' + this.$t('message.morePhotoSize')
    //     })
    //   }
    //   if (isrightType && isLt2M) {
    //     this[`${this.type}Form`].userPic = URL.createObjectURL(file)
    //     this.photoFile = file
    //   }
    //   return false
    // },
    // 上级对话框点击高亮
    handleRowClick(row, column, event) {
      // console.log(row)
      this.activeLeaderRow = { ...row }
    },
    // 上级对话框确定
    handleLeader() {
      this[`${this.type}Form`].leaderName = this.activeLeaderRow.userName
      this[`${this.type}Form`].leader = this.activeLeaderRow.userId
      this.leaderDialogVisible = false
    },
    // 角色权限角色改变
    handleRoleChange(type) {
      // var ids = this[`${type}Form`].roleId.join()
      var ids = String(this[`${type}Form`].roleId)
      this.getRoleMenuTree(type, {
        ids
      })
    },
    // 新增/编辑
    handleAddOrEdit(type) {
      // console.log(type)
      this.$refs[`${type}Form`].validate(valid => {
        if (valid) {
          var form = { ...this[`${type}Form`] }
          this[`${type}Disabled`] = true // 接口时间长，不用定时器了。对话框关闭了，也解禁。双控
          this.listLoading = true // 接口时间长，加个list的loading
          // 防止重复提交
          // 1.也可在请求回来后解禁，写这里的话，注意不要有语法错误，否则代码不执行，一直禁止，
          // 2.也可在closed中直接写，双重保障
          // 3.定时器简单粗暴
          // setTimeout(() => {
          //   this[`${type}Disabled`] = false
          // }, 1000)
          // const addOrUpdate = (params) => {
          // if (form.phoneNumb) form.phoneNumb = form.phonePrefix + '+' + form.phoneNumb
          if (type !== 'edit' || form.password !== this.currentRow.password) {
            if (type === 'edit') { form.isChangePsd = true }
            form.password = AES.encrypt(form.userName + form.password, this.$api.AES_KEY)
            form.passwordAgain = AES.encrypt(form.userName + form.passwordAgain, this.$api.AES_KEY)
          }
          form.roleId = form.roleId.join()
          // delete form.phonePrefix
          // var formData = ''
          // if (form.userPic && form.userPic.startsWith('blob:')) {
          //   // 本地预览上传了图片先调用图片接口
          //   formData = new FormData()
          //   formData.append('file', this.photoFile)
          // } else {
          //   formData = ''
          // }
          // delete form.userPic
          this.$http.posts('newAddOrUpdate', '', form, { showSuccessMsg: false, showErrorMsg: false })
            .then(res => {
              // this[`${type}Disabled`] = false // 对话框关闭了，也解禁。双控，可注释掉
              // this.listLoading = false // getUserList中会再次用，可注释掉
              this[`${type}DialogVisible`] = false
              var curUserChangePsd = type === 'edit' && form.userId === this.userId && form.isChangePsd // 是否是当前用户修改密码
              var curUserChangeRole = type === 'edit' && form.userId === this.userId && form.roleId !== String(this.currentRow.roleId) // 是否是当前用户修改角色
              var message, duration; message = this.$t(`code.${res.resMsg}`); duration = 1500
              if (curUserChangePsd) { // 当前用户修改密码
                message = this.$t('basicInfo.successPsd')
                duration = 3000
                this.timeoutId = setTimeout(() => {
                  this.$router.push('/login')
                }, 3000)
              } else {
                if (curUserChangeRole) { // 当前用户修改角色
                  message = this.$t('message.curUserEditRole')
                  duration = 2500
                }
                this.getUserList()
              }
              this.$utils.$message({
                message: message,
                type: 'success',
                duration: duration
              })
            })
            .catch(er => {
              this[`${type}Disabled`] = false
              this.listLoading = false
              this.handleError(er)
            })
        }
      })
    },
    // 删除和改变状态
    handleDeleteAndStatus: $utils.debounce(function (status, row) {
      // 0 禁用  1解禁 2删除
      this.listLoading = true
      var params = { status }
      if (status === 2) {
        let ids = this.userSelection.map(item => item.userId).join()
        params.userId = ids
      } else {
        params.userId = row.userId
      }
      this.$http.posts('updateUserStatus', '', params, true)
        .then(res => {
          this.getUserList()
        })
        .catch(er => {
          this.listLoading = false
          // console.log(er)
        })
      if (status === 2) this.deleteDialogVisible = false
    }),
    // 点击新增/修改/详情/删除对话框关闭,重置表单
    handleDialogClose(type) {
      if (type === 'add') {
        this.$refs.addForm.resetFields()
        this.addForm.contactName = ''
        // this.photoFile = ''
        this.addRightsOptions = []
        this.addDisabled = false
      } else if (type === 'edit') {
        // this.photoFile = ''
        this.detailsForm = {}
        this.editRightsOptions = []
        this.editDisabled = false
      } else if (type === 'details') {
        this.detailsForm = {}
        this.userOrg = ''
        this.detailsDialogVisible = false
        this.detailsTable2 = []
      } else if (type === 'leader') {
        this.$refs.leaderQuery.resetFields()
        this.$refs.leaderTable.setCurrentRow({})
        this.activeLeaderRow = {}
        // this.leaderList = []
      } else if (type === 'import') {
        this.importFile = ''
        // this.importDisabled = false
      }
    },
    // 模板下载
    handleDownloadTemp() {
      // console.log(this.$api.downloadRoleTemp)
      window.location.href = this.language === 'cn'
        ? this.$api.downloadUserTemp
        : this.$api.downloadUserTempEn
    },
    // 文件导入前
    handleBeforeUpload(file) {
      // console.log(file)
      const isExcel =
        file.type === '.csv' ||
        file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      if (!isExcel) {
        this.$utils.$message({
          message: this.$t('message.excel'),
          type: 'error'
        })
      }
      if (isExcel) {
        this.importFile = file
      }
      return false
    },
    // 新增和导入用到，主要是为了，超过数量错误提示语
    handleError(er) {
      if (typeof er === 'object') {
        var errorMsg
        if (er.resMsg) { // errMsg运行时错误会遇到，后台改了就去掉
          var i18nCode = this.$t(`code.${er.resMsg}`)
          if (er.resMsg === 'S00061') {
            i18nCode = i18nCode.replace(/xxx/gi, er.extMsg)
          }
          i18nCode.startsWith('code.')
            ? (errorMsg = er.resMsg)
            : (errorMsg = i18nCode)
        } else {
          errorMsg = this.$t('message.submitError')
        }
        // else if (er.errMsg) { // 运行时错误会遇到，后台改了就去掉
        //   var i18nCode1 = this.$t(`code.${er.errMsg}`)
        //   i18nCode1.startsWith('code.')
        //     ? (errorMsg = er.errMsg)
        //     : (errorMsg = i18nCode1)
        // }
        this.$utils.$message({
          message: errorMsg,
          type: 'error'
        })
      }
    },
    handleImport: $utils.debounce(async function () {
      if (!this.importFile) {
        this.$utils.$message({
          message: this.$t('message.selectImport'),
          type: 'warning'
        })
        return
      }
      // this.importDisabled = true
      var formData = new FormData()
      formData.append('file', this.importFile)
      this.importDialogVisible = false
      this.listLoading = true
      try {
        // const response = await this.$http.post('importUser', formData)
        await this.$http.posts('importUser', formData, { timeout: 0 }, { showSuccessMsg: false, showErrorMsg: false })
        // const res = response.data
        // const res = response
        // if (res.resCode === 0) {
        this.$utils.$message({
          message: this.$t('message.successUpload'),
          type: 'success'
        })
        this.getUserList()
        // this.listLoading = false // 这个getUserList会处理的
        // } else {
        //   this.listLoading = false
        //   this.$utils.$message({
        //     message: res.resMsg || res.errMsg,
        //     type: 'error'
        //   })
        // }
        // this.importDisabled = false
      } catch (er) {
        // this.importDisabled = false
        this.listLoading = false
        this.handleError(er)
      }
    }),
    // // 文件导入成功
    // handleSuccessUpload (response, file, fileList) {
    //   // console.log(response)
    //   if (response.resCode === 0) {
    //     this.$utils.$message({
    //       message: this.$t('message.successUpload'),
    //       type: 'success'
    //     })
    //     this.getUserList()
    //   } else {
    //     // console.log(123)
    //     this.$utils.$message({
    //       type: 'error',
    //       message: response.resMsg
    //     })
    //   }
    // },
    // // 文件导入失败
    // handleErrorUpload (er, file, fileList) {
    //   // console.log(err)
    //   this.$utils.$message({
    //     type: 'error',
    //     message: this.$t('message.errorUpload')
    //   })
    // },
    // 导出按钮的处理
    handleDownload() {
      if (this.userSelection.length === 0) {
        this.$utils.$message({
          message: this.$t('message.selectExport'),
          type: 'warning'
        })
        return
      }
      var length = this.userSelection.length
      function getIds(arr) {
        var ids = arr.map(item => item.userId).join()
        return ids
      }
      // var user = JSON.parse(sessionStorage.getItem('user'))
      const loadObj = {
        ...this.userRealQuery,
        ids: length === 0 ? '' : getIds(this.userSelection) // 导出的具体数据
        // companyId: user.companyId
      }
      this.$utils.excelExport('exportUser', loadObj, '', 'saas_userStore.xls')
      // window.location.href = this.$api.apiBase + `${this.$api.exportUser}?${this.$utils.obj2qs(
      //   loadObj
      // )}`
    }
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  }
}
</script>

<style lang="less">
@import '../../assets/color';
#userAccount {
  .queryForm {
    .el-form-item:not(:last-child) .el-form-item__content {
      width: 245px;
    }
  }
  .result {
    .el-table td {
      padding: 5px 0;
    }
  }
  // .uploadExcel {
  //   display: inline-block;
  //   margin: 0 10px;
  // }
  .title {
    // padding: 0 0 15px 0px;
    line-height: 50px;
    i {
      margin-right: 5px;
      font-size: 20px;
      vertical-align: middle;
    }
  }
  .dialogTitle {
    line-height: 35px;
    font-weight: 700;
    // margin-left: -3px;
    width: 100% !important;
  }
  .details {
    .basic {
      thead.is-group {
        tr:nth-child(1) th:nth-child(3),
        tr:nth-child(2) th:nth-child(2),
        tr:nth-child(3) th:nth-child(2),
        tr:nth-child(4) th:nth-child(2),
        tr:nth-child(5) th:nth-child(2),
        tr:nth-child(6) th:nth-child(2),
        tr:nth-child(7) th:nth-child(2),
        tr:nth-child(1) th:nth-child(5),
        tr:nth-child(2) th:nth-child(4),
        tr:nth-child(3) th:nth-child(4),
        tr:nth-child(4) th:nth-child(4),
        tr:nth-child(5) th:nth-child(4),
        tr:nth-child(6) th:nth-child(4),
        tr:nth-child(7) th:nth-child(4) {
          font-weight: 400;
          background-color: #fff;
        }
      }
      .detailsRadio {
        position: relative;
        line-height: 20px;
        .mask {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
        }
      }
    }
  }
  .el-dialog {
    .avatarItem {
      height: auto;
      width: 100% !important;
      .el-form-item__error {
        left: 50%;
        transform: translateX(-50%);
        padding-top: 0;
      }
    }
    .checkbox {
      max-height: 125px;
      overflow: auto;
      height: auto;
      font-size: 12px;
      .el-form-item__content {
        line-height: 25px;
      }
      .rightsList {
        margin-bottom: 5px;
        p {
          position: relative;
          padding-left: 10px;
          span {
            height: 14px;
            border-left: 4px solid @border;
            position: absolute;
            left: 0;
            top: 5.5px;
          }
        }
        .el-checkbox__input.is-disabled + span.el-checkbox__label {
          color: @text;
        }
      }
    }
    .el-radio {
      line-height: 1.5;
    }
  }
  .innerDialog {
    .el-dialog {
      .el-form-item {
        width: 100%;
      }
    }
  }
}
</style>
