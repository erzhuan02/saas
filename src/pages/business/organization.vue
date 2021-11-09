<template>
  <div id="organization">
    <!-- query -->
    <div class="query clearfix">
      <el-button v-if="button.import" type="primary" icon="el-icon-upload2" @click="showImport = true">{{ $t('button.import') + $t('org.organ') }}</el-button>
      <el-tooltip effect="dark" placement="bottom-start">
        <div slot="content" style="width:500px">
          {{ $t('message.downloadExp1') }}
          <br />
          {{ $t('message.downloadExp2') }}
          <br />
          {{ $t('message.downloadExp3') }}
          <br />
          {{ $t('message.downloadExp4') }}
        </div>
        <el-button v-show="button.download" type="primary" icon="el-icon-download" @click="downloadTemp">{{ $t('button.download') + $t('org.temp') }}</el-button>
      </el-tooltip>
      <el-button v-if="button.move" type="primary" icon="el-icon-sort" @click="canMove ? showMoveList = true : ''" :disabled="canMove ? false : true">{{ $t('button.move') }}</el-button>
      <el-button v-if="button.remove" type="primary" icon="el-icon-remove-outline" @click="canMove ? showDetach = true : ''" :disabled="canMove ? false : true">{{ $t('button.detach') }}</el-button>
      <el-button v-if="button.clear" type="primary" icon="el-icon-delete" @click="showClear = true" :disabled="canClearOrg">{{ $t('button.clearOrg') }}</el-button>
    </div>
    <el-container>
      <!-- tree -->
      <el-aside style="width:300px;">
        <el-input class="filterTreeInput" :placeholder="$t('home.orgSearch')" v-model="filterText" suffix-icon="el-icon-search">
        </el-input>
        <div class="cutOrg">
          <img v-if="cutTreeList" src="@/assets/images/structure.png" alt="structure.png" @click="cutList('shop')">
          <img v-else src="@/assets/images/Framework.png" alt="Framework.png" @click="cutList('org')">
        </div>
        <!-- 组织架构列表 -->
        <el-tree class="filter-tree" v-loading="loadTree" v-if="cutTreeList" :filter-node-method="filterNode" :current-node-key="curNodeKey" :data="data" :props="defaultProps" draggable node-key="id" @node-click="nodeClick" @node-contextmenu="rightClick" @node-drop="handleDrop" @node-expand="nodeExpand" @node-collapse="nodeCollapse" :allow-drop="allowDrop" :highlight-current="highlightTree" :default-expanded-keys="defaultExpanded" ref="tree">
          <!-- 加图标 -->
          <span class="organBox" slot-scope="{ node, data }">
            <img v-if="data.isShop == 0" src="@/assets/images/organization.png" alt="organization" style="margin-top: 3px">
            <img v-else src="@/assets/images/store.png" alt="store" style="margin-top: 5px">
            <span class="one-txt-cut organName" :title="node.label">{{node.label}}</span>
          </span>
        </el-tree>
        <!-- 门店列表 -->
        <ul v-else class="shop-tree" v-loading="loadTree">
          <li class="flex" v-for="(shop, index) in allShops" :key="index" @click="clickShop(shop, index)" @contextmenu.prevent="shopRC($event, shop)">
            <img src="@/assets/images/store.png" alt="store.png">
            <span class="one-txt-cut" :title="shop.shopId + ' ' + shop.orgName">{{ shop.shopId + ' ' + shop.orgName }}</span>
          </li>
        </ul>
        <!-- 0 root card -->
        <el-card class="card" v-if="showRootCard" v-clickoutside="handleOpClickOutside">
          <div v-for="o in oprRoot" :key="o.id" class="item" @click="oprFunc(o, false)">
            {{ o.name }}
          </div>
        </el-card>
        <!-- 1 org card -->
        <el-card class="card" v-if="showOrgCard" v-clickoutside="handleOpClickOutside">
          <div v-for="o in oprOrgan" :key="o.id" class="item" @click="oprFunc(o, false)">
            {{ o.name }}
          </div>
        </el-card>
        <!-- 2 shop card -->
        <el-card class="card" v-if="showShopCard" v-clickoutside="handleOpClickOutside">
          <div v-for="o in oprShop" :key="o.id" class="item" @click="oprFunc(o, true)">
            {{ o.name }}
          </div>
        </el-card>
        <!-- 3 shopList card -->
        <el-card class="card" v-if="showShopList" v-clickoutside="handleOpClickOutside">
          <div v-for="o in oprShopList" :key="o.id" class="item" @click="oprFunc(o, true)">
            {{ o.name }}
          </div>
        </el-card>
        <!-- 添加同级架构 -->
        <el-dialog class="modeDia" :title="$t('button.addSameOrg')" :visible.sync="showAddSameOrg" :close-on-click-modal="dialogClose">
          <el-form :model="addSameOrg" label-width="150px" :rules="addSameOrgRules" ref="sameOrg" :validate-on-rule-change="false">
            <el-form-item :label="$t('org.orgName')" prop="orgName">
              <el-input :placeholder="$t('placeholder.input')" v-model.trim="addSameOrg.orgName" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item :label="$t('userShop.longitude')" prop="pointX">
              <el-input :placeholder="$t('placeholder.input')" v-model.trim="addSameOrg.pointX"></el-input>
            </el-form-item>
            <el-form-item :label="$t('userShop.latitude')" prop="pointY">
              <el-input :placeholder="$t('placeholder.input')" v-model.trim="addSameOrg.pointY"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.shortName')" prop="shortName">
              <el-input :placeholder="$t('placeholder.input')" v-model.trim="addSameOrg.shortName" maxlength="10"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showAddSameOrg = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="addSubOrg('sameOrg', 1)" :disabled="!clickflag">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
        <!-- 添加子架构/编辑 -->
        <el-dialog class="modeDia" :title="isAdd ? $t('org.addSubOrg') : $t('button.edit')" :visible.sync="showAddOrg" :close-on-click-modal="dialogClose">
          <el-form :model="addSubOrgForm" label-width="150px" :rules="addSubOrgRules" ref="subOrgName" :validate-on-rule-change="false">
            <el-form-item :label="isAdd ? $t('org.subOrgName') : $t('org.orgName')" prop="orgName">
              <el-input :placeholder="$t('placeholder.input')" v-model.trim="addSubOrgForm.orgName" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item :label="$t('userShop.longitude')" prop="pointX">
              <el-input :placeholder="$t('placeholder.input')" v-model.trim="addSubOrgForm.pointX"></el-input>
            </el-form-item>
            <el-form-item :label="$t('userShop.latitude')" prop="pointY">
              <el-input :placeholder="$t('placeholder.input')" v-model.trim="addSubOrgForm.pointY"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.shortName')" prop="shortName">
              <el-input :placeholder="$t('placeholder.input')" v-model.trim="addSubOrgForm.shortName" maxlength="10"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showAddOrg = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="addSubOrg('subOrgName', isAdd)" :disabled="!clickflag">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
        <!-- 添加门店 -->
        <el-dialog class="modeDia special" :title="$t('org.addShop')" :close-on-click-modal="dialogClose" :visible.sync="showAddShop" @closed="closeDialog('Stores')">
          <el-transfer ref="openStores" v-loading="addLoading" v-model="addedshopVal" :data="shopData" filterable :left-default-checked="checked" :titles="[this.$t('org.notAddShop'), this.$t('org.addedShop')]" class="transfer">
          </el-transfer>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showAddShop = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="addShop" :disabled="!clickflag">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
        <!-- 添加成员 -->
        <el-dialog class="modeDia special" :title="$t('org.addMem')" :close-on-click-modal="dialogClose" :visible.sync="showAddMem" @closed="closeDialog('Members')">
          <el-transfer ref="openMembers" v-loading="addLoading" v-model="addedMemVal" :data="memberData" filterable :left-default-checked="checked" :titles="[this.$t('org.notAddMember'), this.$t('org.addedMember')]" class="transfer">
          </el-transfer>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog('AddMem')">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="addMember" :disabled="!clickflag">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
        <!-- 添加成员 - 提示 -->
        <el-dialog class="modeDia" :title="$t('dialog.tips')" :visible.sync="showMemTips" :close-on-click-modal="dialogClose" @closed="closeDialog('tips')">
          <span>
            {{ addMemTips }}
            {{ $t('org.addMemTips1') }}
            <a href="javascript:;" style="color:#3699ff" @click="resQuery">{{ $t('common.more') }}</a>
            {{ $t('org.addMemTips2') }}
          </span>
        </el-dialog>
        <!-- 添加结果查询 -->
        <el-dialog class="modeDia special addResDia" :title="$t('org.addResCheck')" :close-on-click-modal="dialogClose" :visible.sync="showaddRes" @closed="closeDialog('tips')">
          <el-tabs v-model="activeAddRes" @tab-click="addResTips" class="result clearfix">
            <el-tab-pane :label="$t('org.addError')" name="addError"></el-tab-pane>
            <el-tab-pane :label="$t('org.addSuccess')" name="addSuccess"></el-tab-pane>
          </el-tabs>
          <el-table ref="resultTable" stripe border max-height="400" :data="resQData" tooltip-effect="dark" style="width: 100%;margin-bottom:30px;" highlight-current-row>
            <!-- <el-table-column type="index" :label="$t('common.no')" width="80" :index="1"></el-table-column> -->
            <el-table-column prop="no" :label="$t('common.no')"></el-table-column>
            <el-table-column prop="userName" :label="$t('common.userName')"></el-table-column>
            <el-table-column prop="realName" :label="$t('account.realName')"></el-table-column>
            <el-table-column v-if="curIsShop" prop="shopId" :label="$t('org.asstoreNum')"></el-table-column>
            <el-table-column v-if="curIsShop" prop="shopName" :label="$t('org.asstoreName')"></el-table-column>
            <el-table-column v-if="!addUserInfo && curIsShop" prop="currShopId" :label="$t('org.nowConnectedNo')"></el-table-column>
            <el-table-column v-if="!addUserInfo && curIsShop" prop="currShopName" :label="$t('org.nowConnectedName')"></el-table-column>
            <el-table-column v-if="!addUserInfo" prop="errorDetail" :label="$t('org.errReason1')"></el-table-column>
          </el-table>
          <!-- page -->
          <!-- <paging :data="importZ" :initPage="initPage" v-on:pageData="pageData"></paging> -->
          <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog('multImport')">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="sureToImport" v-loading.fullscreen.lock="fullscreenLoading">{{ $t('button.confirm') }}</el-button>
          </span> -->
        </el-dialog>
        <!-- 移动树 -->
        <el-dialog class="modeDia special" :title="$t('button.move')" :close-on-click-modal="dialogClose" :visible.sync="showMoveTree">
          <div class="boxLeft">
            <p>{{this.$t('org.moveTo') }}</p>
            <el-tree class="box-tree" v-loading="loadTree" :data="noShopData" :props="defaultProps" @node-click="nodeNoShop" :highlight-current="highlightTree" ref="treeIn">
            </el-tree>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showMoveTree = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="moveToTree">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
        <!-- 移动列表 -->
        <el-dialog class="modeDia special" :title="$t('button.move')" :close-on-click-modal="dialogClose" :visible.sync="showMoveList">
          <div class="moveBox flex">
            <!-- left -->
            <div class="boxLeft left">
              <p>{{this.$t('org.list') }}</p>
              <el-checkbox v-show="activeList == 'shopList'" v-model="checkedShop" disabled v-for="(item, index) in storesMultSelection" :key="index">{{ item.shopName }}</el-checkbox>
              <el-checkbox v-show="activeList == 'userList'" v-model="checkedShop" disabled v-for="(item, index) in userMultSelection" :key="index">{{ item.userName }}</el-checkbox>
            </div>
            <!-- right -->
            <div class="boxLeft">
              <p>{{this.$t('org.moveTo') }}</p>
              <el-tree class="box-tree" :data="activeList == 'userList' ? data : noShopData" :props="defaultProps" @node-click="boxNode" :highlight-current="highlightTree" ref="treeIn">
              </el-tree>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showMoveList = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="move2List">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
        <!-- 删除节点 -->
        <el-dialog class="modeDia" :title="$t('button.delete')" :visible.sync="showDeleteNode" :close-on-click-modal="dialogClose">
          <span>{{ isRoot ? $t('dialog.deleteRoot') : $t('dialog.deleteNode') }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showDeleteNode = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="deleteNode(isRoot ? 'root' : 'node')" :disabled="!clickflag">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
        <!-- 删除门店 -->
        <el-dialog class="modeDia" :title="$t('button.delete')" :visible.sync="showDeleteShop" :close-on-click-modal="dialogClose">
          <span>{{ $t('dialog.deleteShop') }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showDeleteShop = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="deleteNode('shop')">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
        <!-- 导入组织架构 -->
        <el-dialog class="modeDia" :title="$t('button.import') + $t('org.organ')" :visible.sync="showImport" :close-on-click-modal="dialogClose">
          <form class="flex-hc uploadBox" id="uploadForm">
            <span class="box1">{{ $t('org.selectFile') }}</span>
            <el-upload class="upload-demo" ref="avatarUploader" :action="checkOrgUrl" :headers="importHeaders" :before-upload="handleBeforeUploadImg" :on-remove="removeFile" :limit="1" :on-exceed="handleExceed" accept=".xls,.xlsx" :file-list="fileList">
              <!-- :auto-upload="false" -->
              <el-button size="small" type="primary">{{ $t('button.browse') }}</el-button>
            </el-upload>
          </form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog('Import')">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="checkImport" :disabled="notclick ? false : true">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
        <!-- 批量导入提示 -->
        <el-dialog class="modeDia special impTips" :title="batchOrSuccessImp ? $t('org.tit2') : $t('org.tit1')" :close-on-click-modal="dialogClose" @closed="batchOrSuccessImp ? closeDialog('impTipsSucess') : closeDialog('impTip')" :visible.sync="showImpTips">
          <el-tabs v-model="activeImpTips" class="result clearfix">
            <!-- 用户列表 -->
            <el-tab-pane :label="$t('org.newShop')" name="newShop"></el-tab-pane>
            <el-tab-pane :label="$t('org.hadShop')" name="hadShop"></el-tab-pane>
            <el-tab-pane :label="$t('org.errorShop')" name="errorShop" v-if="!batchOrSuccessImp"></el-tab-pane>
          </el-tabs>
          <el-table ref="resultTable" stripe border max-height="590" :data="importData" tooltip-effect="dark" style="width: 100%;" highlight-current-row>
            <el-table-column prop="shopId" :label="$t('org.shopNum')"></el-table-column>
            <el-table-column prop="shopName" :label="$t('org.storeName')"></el-table-column>
            <el-table-column prop="orgName" :label="$t('org.organ')"></el-table-column>
            <el-table-column v-if="errInfo" prop="errorDetail" :label="$t('org.errReason')"></el-table-column>
          </el-table>
          <!-- page -->
          <paging :data="importZ" :initPage="initPage" v-on:pageData="pageData"></paging>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog('ImpTips')">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="sureToImport" v-loading.fullscreen.lock="fullscreenLoading" :disabled="fullscreenLoading">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
        <!-- 移除门店、成员 -->
        <el-dialog class="modeDia" :title="$t('button.detach')" :visible.sync="showDetach" :close-on-click-modal="dialogClose">
          <span v-if="activeList == 'shopList'">{{ $t('dialog.deleteShop') }}</span>
          <span v-if="activeList == 'userList'">{{ $t('dialog.deleteUser') }}</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showDetach = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="toDetach">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
        <!-- 清除组织架构 -->
        <el-dialog :title="$t('dialog.clearOrgTips')" :visible.sync="showClear" :close-on-click-modal="dialogClose" @closed="closeDialog('clearOrg')">
          <div class="deleteInfo flex">
            <i class="el-icon-warning"></i>
            <span>
              {{ $t('message.isClearOrg') }}
              【
              <span class="pointer" style="color:#6cb6ff" @click="backup">{{ $t('button.backup') }}</span>
              】
            </span>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showClear = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" :disabled="showClearOrg" @click="clearNow">{{ $t('button.clearNow') }}</el-button>
          </span>
        </el-dialog>
        <!-- 账号验证 -->
        <el-dialog class="modeDia" :title="$t('dialog.accountVeri')" :visible.sync="showAcoVeri" :close-on-click-modal="dialogClose" @closed="closeDialog('acoVeri')">
          <p class="accountVeriTip">{{ $t('dialog.accountVeriTip') }}</p>
          <el-form ref="form" :model="acoVeriForm" label-width="120px" class="regForm">
            <el-form-item :label="$t('common.userName')" prop="userName">
              <el-input :placeholder="$t('placeholder.input') + $t('common.userName')" v-model.trim="acoVeriForm.userName" maxlength="128"></el-input>
            </el-form-item>
            <el-form-item :label="$t('common.password')" prop="password">
              <el-input :placeholder="$t('placeholder.input') + $t('common.password')" v-model.trim="acoVeriForm.password" maxlength="128" show-password class="paswordNoEye"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="showAcoVeri = false">{{ $t('button.cancel') }}</el-button>
            <el-button type="primary" @click="accountVeri">{{ $t('button.confirm') }}</el-button>
          </span>
        </el-dialog>
      </el-aside>
      <!-- main -->
      <el-main>
        <el-tabs v-model="activeList" class="result clearfix">
          <!-- 用户列表 -->
          <el-tab-pane :label="$t('org.userList')" name="userList">
            <el-table v-if="activeList == 'userList'" v-loading="loadTable" ref="resultTable" stripe border max-height="590" :data="userData" tooltip-effect="dark" style="width: 100%;" @selection-change="userSelectionChange" highlight-current-row>
              <el-table-column type="selection" width="60"></el-table-column>
              <el-table-column prop="userName" :label="$t('common.userName')"></el-table-column>
              <el-table-column prop="realName" :label="$t('regis.realName')"></el-table-column>
              <el-table-column prop="showPhone" :label="$t('org.phone')"></el-table-column>
              <el-table-column prop="emailAddr" :label="$t('org.eMail')"></el-table-column>
              <el-table-column prop="orgName" :label="$t('org.organization')"></el-table-column>
              <el-table-column prop="roleName" :label="$t('account.role')"></el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 门店列表 -->
          <el-tab-pane :label="$t('org.shopList')" name="shopList">
            <el-table v-if="activeList == 'shopList'" v-loading="loadTable" ref="resultTable" stripe border max-height="590" :data="storesData" tooltip-effect="dark" style="width: 100%;" @selection-change="storeSelectionChange" highlight-current-row>
              <el-table-column type="selection" width="60"></el-table-column>
              <el-table-column prop="shopName" :label="$t('org.storeName')"></el-table-column>
              <el-table-column prop="address" :label="$t('common.address')"></el-table-column>
              <el-table-column prop="contact" :label="$t('org.contectPersonName')"></el-table-column>
              <el-table-column prop="phoneNumb" :label="$t('org.phone')"></el-table-column>
              <el-table-column prop="email" :label="$t('org.eMail')"></el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- page -->
          <div class="currentTotal">{{ $t('common.currentPage') }} {{ listLength }} {{ $t('common.unit') }}</div>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="paging.pageNumber" :page-sizes="[10, 20, 50, 100]" :page-size="paging.pageSize" layout=" prev, pager, next,sizes,total" :total="total" background></el-pagination>
        </el-tabs>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import paging from '@/components/paging'
import { setTimeout } from 'timers'
import { mapGetters } from 'vuex'
import $utils from '@/utils'
import AES from '@/utils/aes'
import '../../../static/js/jquery'
export default {
  components: { paging },
  data() {
    return {
      clickflag: true,
      notclick: false,
      dialogClose: false, // 锁定dialog
      noShopData: [], // 树（不包含门店）
      data: [], // 树
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      activeList: 'userList',
      activeImpTips: 'newShop',
      activeAddRes: 'addError',
      cutTreeList: true, // 切换至组织架构或门店列表
      showRootCard: false, // 根节点卡片显隐
      showOrgCard: false, // 组织架构卡片显隐
      showShopCard: false, // 门店卡片显隐
      showShopList: false, // 门店列表卡片显隐
      showAddSameOrg: false, // 同级组织架构显隐
      showAddOrg: false, // 添加组织架构显隐
      showAddShop: false, // 添加门店显隐
      showAddMem: false, // 添加成员显隐
      showMemTips: false,
      showaddRes: false,
      showDeleteNode: false, // 删除节点显隐
      showDeleteShop: false, // 删除门店显隐
      showMoveList: false, // 移动列表显隐
      showImport: false, // 导入模板显隐
      showImpTips: false, // 批量导入提示显隐
      showMoveTree: false, // 移动树显隐
      errInfo: false, // 错误原因显隐
      showDetach: false, // 移除对话框显隐
      showClear: false, // 清除组织架构显隐
      showAcoVeri: false, // 账号验证显隐
      addMemData: {},
      addMemTips: '',
      resQData: [],
      addUserInfo: false,
      addSameOrg: {
        isSubOrg: 0, // 1.是子架构 0.是同级架构
        orgName: '', // 同级架构名称
        pointX: '', // 经度
        pointY: '', // 纬度
        shortName: '' // 简称
      },
      addSubOrgForm: {
        isSubOrg: 1, // 1.是子架构 0.是同级架构
        orgName: '', // 子架构名称
        pointX: '', // 经度
        pointY: '', // 纬度
        shortName: '' // 简称
      },
      pointX: '',
      pointY: '',
      shopData: [],
      memberData: [],
      addedshopVal: [],
      addedMemVal: [],
      userData: [],
      storesData: [],
      importData: [], // 检查导入数据
      importZ: [],
      impDataBox: {}, // 暂时存放导入数据
      initPage: true, // 分页组件是否初始化
      addShopPageLength: 0,
      addUserPageLength: 0,
      listLength: 0, // 列表页数
      total: 0, // 总条数
      addShopTotal: 0,
      addUserTotal: 0,
      // params: {}, // 接口参数
      paging: {
        pageNumber: 1, // 当前页
        pageSize: 10 // 一页显示多少条
      },
      userMultSelection: [], // 用户多选
      storesMultSelection: [], // 门店多选
      canMove: false, // 能否移动
      canImport: false, // 能否导入
      fileList: [],
      fileRaw: '', // FormData
      allShops: [], // 所有门店
      allShops2: [], // =allShops
      // currentNode: {}, // 右键当前树结构数据
      singleOrgId: '', // 已选择单个orgId
      highlightTree: true, // 选中树高亮
      moveNodeTree: '', // 移动后的组织数据（对话框中）
      moveToNode: '', // 移动后的组织数据（对话框中）
      checkedShop: true, // 已选门店
      defaultExpanded: [], // 默认展开节点
      button: {},
      checked: [],
      filterText: '',
      // allFaterId: '', // 某节点以上所有的父id(右键时)
      // selectedAllFatherId: '', // 某节点以上所有的父id(对话框中的树选中时)
      loadTree: false, // loading tree
      loadTable: false, // loading table
      isCurrentOrg: true, // 当前是否组织架构
      addLoading: false, // 添加门店和成员的loading
      curNodeKey: '', // 当前选中的节点(为了拖拽完成后该节点高亮显示)
      moveTreeFatherId: '',
      fullscreenLoading: false, // 全屏loading,用于导入完成时
      isRoot: false, // 是否第一级组织架构
      isAdd: true, // 添加编辑？
      curIsShop: false, // 当前点击节点是否门店
      showClearOrg: true, // 立即清除按钮,默认不可点
      canClearOrg: true,
      acoVeriForm: {
        userName: '',
        password: ''
      },
      checkOrgUrl: '',
      importHeaders: {
        Authorization: sessionStorage.getItem('authorization')
      },
      batchOrSuccessImp: false // 批量导入false 成功导入true
    }
  },
  created() {
    this.getOrgTree(2)
  },
  mounted() {
    // 不加action会报错，展示的file-list会一闪而过(暂时这么处理)
    this.checkOrgUrl = this.$api.apiBase + this.$api.checkOrg
    this.$nextTick(() => {
      this.$utils.getButton(this.$route.path, 2).then(res => {
        this.button = res
      })
    })
  },
  watch: {
    activeList(val) {
      this.canMove = false
      this.paging.pageNumber = 1
      this.paging.pageSize = 10
      if (this.singleOrgId !== '') {
        let params = { ...this.paging, assoStatus: 1, orgId: this.singleOrgId }
        this.userOrShop(params)
      } else {
        if (val === 'userList') {
          this.$utils.$message({
            message: this.$t('message.noOrgId'),
            type: 'error',
            duration: 1000
          })
        } else {
          this.$utils.$message({
            message: this.$t('message.noShopId'),
            type: 'error',
            duration: 1000
          })
        }
      }
    },
    showImport(val) {
      if (!val && this.$refs.avatarUploader) {
        this.$refs.avatarUploader.clearFiles()
        this.notclick = false
      }
    },
    /**
     * 监听showImpTips是因为分页
     * 如果为false则让分页组件初始化
     */
    showImpTips(val) {
      this.initPage = !val
    },
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
            if (e.orgName.indexOf(val) != -1 || e.shopId.indexOf(val) != -1) {
              this.allShops.push(e)
            }
          })
        }
      }
    },
    showMoveTree(val) {
      if (!val) {
        this.moveNodeTree = ''
      }
    },
    // 监听移动对话框 显示时获取树(不包含门店)数据
    showMoveList(val) {
      if (val) this.getOrgTree(1)
    },
    activeImpTips(val) {
      switch (val) {
        case 'newShop':
          this.errInfo = false
          this.importZ = this.impDataBox.addOrg
          break
        case 'hadShop':
          this.errInfo = false
          this.importZ = this.impDataBox.updateOrg
          break
        case 'errorShop':
          this.errInfo = true
          this.importZ = this.impDataBox.errorOrg
          break
      }
    }
  },
  computed: {
    ...mapGetters(['language']),
    oprRoot() {
      const root = [
        { name: this.$t('button.addSameOrg'), id: 9 },
        { name: this.$t('button.addSubOrg'), id: 1 },
        { name: this.$t('button.addShop'), id: 2 },
        { name: this.$t('button.addMember'), id: 3 },
        { name: this.$t('button.edit'), id: 4 }
        // { name: this.$t('button.move'), id: 8 }
      ]
      if (this.data.length > 1) {
        root.push({
          name: this.$t('button.deleteNode'),
          id: 5
        })
      }
      return root
    },
    oprOrgan() {
      const organ = [
        { name: this.$t('button.addSameOrg'), id: 9 },
        { name: this.$t('button.addSubOrg'), id: 1 },
        { name: this.$t('button.addShop'), id: 2 },
        { name: this.$t('button.addMember'), id: 3 },
        { name: this.$t('button.edit'), id: 4 },
        { name: this.$t('button.deleteNode'), id: 5 },
        { name: this.$t('button.move'), id: 8 }
      ]
      return organ
    },
    oprShop() {
      const shop = [
        { name: this.$t('button.addMember'), id: 6 },
        { name: this.$t('button.removeShop'), id: 7 },
        { name: this.$t('button.move'), id: 8 }
      ]
      return shop
    },
    oprShopList() {
      const shop = [
        { name: this.$t('button.addMember'), id: 6 },
        { name: this.$t('button.removeShop'), id: 7 }
      ]
      return shop
    },
    addSameOrgRules() {
      return {
        orgName: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error(this.$t('placeholder.input') + this.$t('org.orgName')))
            } else {
              // 不能包含特殊字符
              var specialKey = '[`~!#@%$^&*()=|{}\':;,，。.\'\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“\']‘\''
              for (var i = 0; i < this.addSameOrg.orgName.length; i++) {
                if (specialKey.indexOf(this.addSameOrg.orgName.substr(i, 1)) !== -1) {
                  callback(new Error(this.$t('placeholder.specialCode')))
                }
              }
            }
            callback()
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
      }
    },
    addSubOrgRules() {
      return {
        orgName: [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error(this.$t('placeholder.input') + this.$t('org.subOrgName')))
            } else {
              // 不能包含特殊字符
              var specialKey = '[`~!#@%$^&*()=|{}\':;,，。.\'\\[\\]<>/?~！#￥……&*（）——|{}【】‘；：”“\']‘\''
              for (var i = 0; i < this.addSubOrgForm.orgName.length; i++) {
                if (specialKey.indexOf(this.addSubOrgForm.orgName.substr(i, 1)) !== -1) {
                  callback(new Error(this.$t('placeholder.specialCode')))
                }
              }
              // 不能和已存在的名称重复
              // let data = this.cycleData(this.data, this.addSubOrgForm.orgName)
              // if (data) {
              //   callback(new Error(this.$t('common.exist')))
              // }
            }
            callback()
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
      }
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 渲染树节点内容区
    renderContent(h, { node, data, store }) {
      if (data.isShop === 0) {
        return (
          <span class="organBox flex" slot-scope="{ node, data }">
            <img src={require('@/assets/images/organization.png')} />
            <span class="one-txt-cut organName" title={node.label}>{node.label}</span>
            <span class="redPoint"></span>
          </span>
        )
      } else {
        return (
          <span class="organBox flex" slot-scope="{ node, data }">
            <img src={require('@/assets/images/store.png')} />
            <span class="one-txt-cut organName" title={node.label}>{node.label}</span>
            <span class="redPoint"></span>
          </span>
        )
      }
    },
    // 操作区域外隐藏
    handleOpClickOutside() {
      if (this.showRootCard || this.showOrgCard || this.showShopCard || this.showShopList) {
        this.isShowCard(false, false, false, false)
      }
    },
    // 切换树列表
    cutList(to) {
      this.cutTreeList = !this.cutTreeList
      this.filterText = ''
      this.singleOrgId = ''
      if (to == 'shop') {
        this.getShops()
        this.isCurrentOrg = false
        // this.allShops = []
      } else {
        this.getOrgTree(2)
        this.isCurrentOrg = true
        // this.data = []
      }
      this.paging.pageNumber = 1
      this.paging.pageSize = 10
      this.total = 0
      this.listLength = 0
      this.userData = []
      this.storesData = []
      this.curNodeKey = ''
      this.$nextTick(() => {
        if (this.$refs.tree) {
          this.$refs.tree.setCurrentKey(this.curNodeKey)
        }
      })
    },
    // 点击门店列表
    clickShop(shop, index) {
      $('.shop-tree li').eq(index).css('background-color', '#ffe9cf').siblings().css('background-color', '')
      this.singleOrgId = shop.orgId
      let params = { ...this.paging, assoStatus: 1, orgId: this.singleOrgId }
      this.userOrShop(params)
    },
    userOrShop(params) {
      if (this.activeList == 'userList') {
        this.getUserList(params, 1)
      } else {
        this.getShopList(params, 1)
      }
    },
    // 点击右键(树)
    rightClick(event, obj, node, data) {
      // console.log(event, obj, node, data)
      /**
       *  event、传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身
       *  isShop 2空 1门店 0组织架构
      **/
      // this.currentNode = obj
      this.curIsShop = obj.isShop !== 0
      this.singleOrgId = obj.id
      // this.allFaterId = this.$utils.getAllFatherId(node, [{ orgId: obj.id, isShop: obj.isShop }])
      if (this.button.rightClickMenu) { // 若有右键菜单功能，则右键时显示
        if (obj.isShop == 0) {
          if (obj.level == 1) {
            this.isShowCard(true, false, false, false)
            this.isRoot = true
          } else {
            this.isShowCard(false, true, false, false)
            this.isRoot = false
          }
        } else {
          this.isShowCard(false, false, true, false)
          this.isRoot = false
        }
      }
      // 控制card的位置
      this.$nextTick(() => {
        // console.log(event.pageY)
        if (event.pageY < 370) {
          document.getElementsByClassName('card')[0].style.top = (event.pageY - 140) + 'px'
        } else {
          if (node.data.isShop == 1) {
            document.getElementsByClassName('card')[0].style.top = (event.pageY - 250) + 'px'
          } else {
            document.getElementsByClassName('card')[0].style.top = (event.pageY - 365) + 'px'
          }
        }
        if (event.layerX > 150) {
          document.getElementsByClassName('card')[0].style.left = (event.layerX - 90) + 'px'
        } else {
          document.getElementsByClassName('card')[0].style.left = (event.layerX + 50) + 'px'
        }
      })
    },
    // 点击右键(门店)
    shopRC(event, shop) {
      this.curIsShop = shop.isShop !== 0
      this.singleOrgId = shop.orgId
      if (this.button.rightClickMenu) {
        this.isShowCard(false, false, false, true)
      }
      // 控制card的位置
      this.$nextTick(() => {
        if (event.pageY < 370) {
          document.getElementsByClassName('card')[0].style.top = (event.pageY - 140) + 'px'
        } else {
          document.getElementsByClassName('card')[0].style.top = (event.pageY - 200) + 'px'
        }
        if (event.layerX > 150) {
          document.getElementsByClassName('card')[0].style.left = (event.layerX - 70) + 'px'
        } else {
          document.getElementsByClassName('card')[0].style.left = (event.layerX + 50) + 'px'
        }
      })
    },
    // 选择右键弹出菜单
    oprFunc(item, isShop) {
      // console.log(item, isShop)
      this.isShowCard(false, false, false, false)
      if (isShop) { // 是门店
        if (item.id == 7) {
          this.showDeleteShop = !this.showDeleteShop
        }
        if (item.id == 6) {
          this.addLoading = true
          this.showAddMem = !this.showAddMem
          let params = { assoStatus: 2, orgId: this.singleOrgId }
          this.getUserList(params, 2)
        }
        if (item.id == 8) { // 移动树
          this.getOrgTree(1)
          this.showMoveTree = !this.showMoveTree
        }
      } else { // 不是门店
        if (item.id == 1) { // 添加子架构
          this.isAdd = true
          this.clickflag = true
          // 上面是 如果网速过慢，请求第二次时让按钮可点击
          this.showAddOrg = !this.showAddOrg
          if (this.$refs['subOrgName'] !== undefined) {
            this.$refs['subOrgName'].resetFields()
          }
        }
        if (item.id == 4) { // 编辑
          this.isAdd = false
          this.clickflag = true
          // 上面是 如果网速过慢，请求第二次时让按钮可点击
          this.showAddOrg = !this.showAddOrg
          this.$http.posts('getDataByOrgId', '', { orgId: this.singleOrgId })
            .then(res => {
              let data = res.data
              this.addSubOrgForm = {
                isSubOrg: 1,
                orgName: data.orgName,
                pointX: data.pointX,
                pointY: data.pointY,
                shortName: data.shortName
              }
            })
        }
        if (item.id == 2) { // 添加门店
          this.addLoading = true
          this.addedshopVal = []
          this.shopData = []
          this.showAddShop = !this.showAddShop
          let params2 = { assoStatus: 2, orgId: this.singleOrgId }
          this.getShopList(params2, 2)
        }
        if (item.id == 3) { // 添加成员
          this.addLoading = true
          this.addedMemVal = []
          this.memberData = []
          // 上面两行为了初始化之前选中的值及筛选条件
          this.showAddMem = !this.showAddMem
          let params = { assoStatus: 2, orgId: this.singleOrgId }
          this.getUserList(params, 2)
        }
        if (item.id == 5) { // 删除节点
          this.showDeleteNode = !this.showDeleteNode
        }
        if (item.id == 8) { // 移动树
          this.getOrgTree(1)
          this.showMoveTree = !this.showMoveTree
        }
        if (item.id == 9) { // 同级架构
          if (this.$refs['sameOrg'] !== undefined) {
            this.$refs['sameOrg'].clearValidate()
          }
          this.addSameOrg.orgName = ''
          this.addSameOrg.pointX = ''
          this.addSameOrg.pointY = ''
          this.addSameOrg.shortName = ''
          this.showAddSameOrg = true
        }
      }
    },
    // card的显隐
    isShowCard(showRoot, showOrg, showShop, showShopList) {
      this.showRootCard = showRoot
      this.showOrgCard = showOrg
      this.showShopCard = showShop
      this.showShopList = showShopList
    },
    // 树节点被点击
    nodeClick(data, node, current) {
      this.curIsShop = data.isShop !== 0
      this.isShowCard(false, false, false, false)
      this.singleOrgId = data.id
      this.curNodeKey = data.id
      let params = { ...this.paging, assoStatus: 1, orgId: this.singleOrgId }
      this.userOrShop(params)
    },
    // 节点展开
    nodeExpand(obj, node, data) {
      this.defaultExpanded.push(node.data.id)
    },
    // 节点关闭
    nodeCollapse(obj, node, data) {
      this.defaultExpanded = []
      this.defaultExpanded.forEach((item, index) => {
        if (item !== node.data.id) {
          this.defaultExpanded.push(item)
        }
      })
    },
    // 添加同级架构/子架构/编辑
    addSubOrg: $utils.debounce(function (formName, isAdd) {
      // 类型:1.添加 2.编辑
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.clickflag = false
          let params = { type: isAdd ? 1 : 2, orgId: this.singleOrgId }
          if (formName === 'sameOrg') {
            params = { ...this.addSameOrg, ...params }
          } else {
            params = { ...this.addSubOrgForm, ...params }
          }
          this.$http.posts('addOrUpOrgName', params, '', true)
            .then((res) => {
              this.getOrgTree(2)
              setTimeout(() => {
                this.clickflag = true
              }, 200)
              formName === 'sameOrg' ? this.showAddSameOrg = false : this.showAddOrg = false
            }).catch((er) => {
              setTimeout(() => {
                this.clickflag = true
              }, 200)
            })
        }
      })
    }),
    // 循环树数据-验证子架构名称是否已存在
    cycleData(data, name) {
      let flag = false
      data.forEach((item, index) => {
        if (item.label == name) {
          flag = true
        }
        var ele = item.children
        ele.forEach((i, index) => {
          if (i.label == name) {
            flag = true
          }
        })
        if (ele.length > 0) {
          this.cycleData(ele, name)
        }
      })
      return flag
    },
    // 添加门店
    addShop() {
      if (this.addedshopVal.length == 0) {
        this.$utils.$message({
          message: this.$t('placeholder.select') + this.$t('org.shop'),
          type: 'error',
          duration: 1000
        })
        return false
      } else {
        let shopIds = this.addedshopVal.join(',')
        this.associatedShop(this.singleOrgId, shopIds)
      }
    },
    // 添加成员
    addMember() {
      if (this.addedMemVal.length == 0) {
        this.$utils.$message({
          message: this.$t('placeholder.select') + this.$t('org.member'),
          type: 'error',
          duration: 1000
        })
        return false
      } else {
        let userIds = this.addedMemVal.join(',')
        this.associatedUser(this.singleOrgId, userIds)
      }
    },
    addResTips(tab, event) {
      let name = tab.name
      switch (name) {
        case 'addError':
          this.addUserInfo = false
          this.resQData = this.addMemData.failedUser
          break
        case 'addSuccess':
          this.addUserInfo = true
          this.resQData = this.addMemData.successUser
          break
      }
    },
    // 打开dialog
    // openDialog(type) {
    //   this[`show${type}`] = true
    // },
    // 关闭dialog
    closeDialog(type) {
      if (
        type === 'Import' ||
        type === 'ImpTips' ||
        type === 'AddMem' ||
        type === 'clearOrg'
      ) {
        this.showClearOrg = true
        this[`show${type}`] = false
      }
      if (type === 'Stores' || type === 'Members') {
        this.$refs[`open${type}`].clearQuery('left')
        this.$refs[`open${type}`].clearQuery('right')
      }
      if (type === 'tips') {
        this.paging.pageNumber = 1
        let params = { ...this.paging, assoStatus: 1, orgId: this.singleOrgId }
        this.userOrShop(params)
      }
      if (type === 'Import' || type === 'impTip') {
        this.errInfo = false
        this.activeImpTips = 'newShop'
      }
      if (type === 'impTipsSucess') {
        this.batchOrSuccessImp = false
        this.activeImpTips = 'newShop'
        this.$utils.$message({
          message: this.$t('org.mes5'),
          type: 'info',
          duration: 2500
        })
      }
      if (type === 'acoVeri') {
        this.acoVeriForm.userName = ''
        this.acoVeriForm.password = ''
      }
    },
    // 添加结果查询
    resQuery() {
      this.showMemTips = false
      this.activeAddRes = 'addError'
      this.resQData = this.addMemData.failedUser
      this.addUserInfo = false
      this.showaddRes = true
    },
    // 删除节点
    deleteNode(type) {
      setTimeout(() => {
        this.clickflag = true
      }, 1000)
      if (type === 'node' || type === 'root') {
        this.showDeleteNode = false
      } else {
        this.showDeleteShop = false
      }
      this.deleteOrgId(this.singleOrgId, type)
    },
    // 接收分页传过来的数据
    pageData(val) {
      this.importData = val
    },
    // user多选选中
    userSelectionChange(val) {
      this.userMultSelection = val
      if (this.userMultSelection.length !== 0) {
        this.canMove = true
      } else {
        this.canMove = false
      }
    },
    // store多选选中
    storeSelectionChange(val) {
      this.storesMultSelection = val
      if (this.storesMultSelection.length !== 0) {
        this.canMove = true
      } else {
        this.canMove = false
      }
    },
    // 一页显示多少条
    handleSizeChange(val) {
      this.paging.pageNumber = 1
      this.paging.pageSize = val
      let params = { ...this.paging, assoStatus: 1, orgId: this.singleOrgId }
      this.userOrShop(params)
    },
    // 当前第几页
    handleCurrentChange(val) {
      this.paging.pageNumber = val
      let params = { ...this.paging, assoStatus: 1, orgId: this.singleOrgId }
      this.userOrShop(params)
    },
    // 下载
    downloadTemp() {
      window.location.href = this.$api[`downloadOrgTemp_${this.language}`]
    },
    // 检查导入
    checkImport() {
      console.log('检查导入')
      // this.$refs.avatarUploader.submit()
      this.showImport = !this.showImport
      this.showImpTips = !this.showImpTips
    },
    // 确认导入
    sureToImport() {
      if (!this.batchOrSuccessImp) {
        console.log('批量导入')
        if (this.impDataBox.errorOrg.length !== 0) {
          this.$utils.$message({
            message: this.$t('org.mes4'),
            type: 'error'
          })
        } else {
          var formData = new FormData()
          if (this.fileRaw) {
            formData.append('file', this.fileRaw)
          }
          this.fullscreenLoading = true
          this.$http.posts('importOrg', formData, { timeout: 0 }, true)
            .then((res) => {
              this.fullscreenLoading = false
              this.batchOrSuccessImp = true
              this.activeImpTips = 'newShop'
              if (this.isCurrentOrg) {
                this.getOrgTree(2)
              } else {
                this.getShops()
              }
            })
            .catch(er => {
              this.fullscreenLoading = false
            })
        }
      } else {
        console.log('成功导入')
        this.showImpTips = false
      }
    },
    // upload 移除文件
    removeFile(file, fileList) {
      document.getElementById('uploadForm') && document.getElementById('uploadForm').reset()
      if (fileList.length == 0) {
        this.$utils.$message({
          message: this.$t('org.mes3'),
          type: 'success',
          duration: 1000
        })
        this.notclick = false
      }
    },
    // 文件上传之前
    handleBeforeUploadImg(file) {
      let formData = new FormData()
      formData.append('file', file)
      this.$http.posts('checkOrg', formData, '', true)
        .then(res => {
          this.fileRaw = file
          this.notclick = true
          this.impDataBox = res.data
          this.importZ = this.impDataBox.addOrg
        })
        .catch(er => {
          this.loading.close()
        })
    },
    // upload 文件超出个数限制
    handleExceed(files, fileList) {
      this.$utils.$message({
        message: this.$t('org.mes1'),
        type: 'warning',
        duration: 1000
      })
    },
    // 拖拽完成时
    handleDrop(draggingNode, dropNode, dropType, ev) {
      this.curNodeKey = draggingNode.data.id
      // console.log(dropNode.data.label)
      // console.log('tree drop: ',draggingNode, dropNode, dropType)
      let fatherId
      let dragId = dropNode.data.id
      if (dropType == 'inner') {
        fatherId = dragId
      } else {
        let arrId = this.$utils.getFatherId(this.data, dragId, [])
        if (arrId.length == 0) { // 和一级平行
          fatherId = 1
        } else {
          fatherId = arrId.join()
        }
      }
      this.moveTree(draggingNode.data.id, fatherId)
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.isShop == 1) { // 不能成为门店的下级
        this.$utils.$message({
          message: this.$t('org.notBeShopChild'),
          type: 'error'
        })
        return type !== 'inner'
      } else {
        return true
      }
    },
    // 点击移动对话框树
    boxNode(data, node, current) {
      this.moveToNode = data
      // this.selectedAllFatherId = this.$utils.getAllFatherId(node, [{ orgId: data.id, isShop: data.isShop }])
    },
    // 点击移动树无门店
    nodeNoShop(data, node, current) {
      this.moveNodeTree = data
    },
    // 移动树
    moveToTree() {
      if (this.moveNodeTree.id == '' || this.moveNodeTree.id == undefined) {
        this.$utils.$message({
          message: this.$t('org.mes2'),
          type: 'error',
          duration: 1000
        })
        return false
      } else {
        this.moveTree(this.singleOrgId, this.moveNodeTree.id)
        this.showMoveTree = !this.showMoveTree
      }
    },
    // 确定移动列表
    move2List() {
      if (this.moveToNode.id == '') {
        this.$utils.$message({
          message: this.$t('org.mes2'),
          type: 'error',
          duration: 1000
        })
        return false
      } else {
        let ids = []
        let type // 1用户 2门店
        if (this.activeList == 'userList') {
          type = 1
          this.userMultSelection.forEach((e, i) => {
            ids.push(e.userId)
          })
          ids = ids.join(',')
          this.moveList(this.singleOrgId, this.moveToNode.id, ids, type)
        } else {
          type = 2
          this.storesMultSelection.forEach((e, i) => {
            ids.push(e.shopUuid)
          })
          ids = ids.join(',')
          this.moveList(this.singleOrgId, this.moveToNode.id, ids, type)
        }
        this.showMoveList = !this.showMoveList
        // let params = { ...this.paging, assoStatus: 1, orgId: this.singleOrgId }
        // this.userOrShop(params)
      }
    },
    // 移除
    toDetach: $utils.debounce(function () {
      let ids = []
      if (this.activeList == 'userList') {
        this.userMultSelection.forEach((e, i) => {
          ids.push(e.userId)
        })
      } else {
        this.storesMultSelection.forEach((e, i) => {
          ids.push(e.shopUuid)
        })
      }
      ids = ids.join(',')
      if (ids) {
        let params = {
          orgId: this.singleOrgId,
          moveStatue: this.activeList == 'userList' ? 1 : 2,
          ids: ids,
          assoStatus: 1
        }
        this.$http.posts('removeOrgUserData', params, '', true)
          .then(res => {
            this.showDetach = false
            if (this.isCurrentOrg) {
              this.getOrgTree(2)
            } else {
              this.getShops()
            }
            if (this.userData.length === 1) {
              this.paging.pageNumber = 1
            }
            let params = { ...this.paging, assoStatus: 1, orgId: this.singleOrgId }
            this.userOrShop(params)
            // 当前点击的是门店节点,移除门店后要让用户清空,当前选中的节点也清空
            if (this.curIsShop) {
              // this.singleOrgId = ''
              this.userData = []
            }
          })
          .catch(er => {
            this.showDetach = false
          })
      }
    }),
    // 删除最后一位>
    delLastX(str) {
      if (str.indexOf('>') !== -1) {
        let data = str.split('>')
        if (data[data.length - 1] === '') {
          str = str.substring(0, str.length - 1)
        }
      }
      return str
    },
    // 立即备份
    backup() {
      let fileName = 'Organizational backup' + this.$utils.formatDate(new Date(), 'YYYYMMDD') + '.xls'
      this.$utils.excelExport('exportOrg', '', '', fileName)
        .then((res) => {
          if (res.status === 200) {
            this.showClearOrg = false
            this.$utils.$message({
              message: this.$t('code.S00121'),
              type: 'success',
              duration: 4000
            })
          }
        })
    },
    // 立即清除
    clearNow() {
      this.showClear = false
      this.showAcoVeri = true
    },
    // 账号验证
    accountVeri() {
      if (this.acoVeriForm.userName === '') {
        this.$utils.$message({
          message: this.$t('common.userName') + this.$t('common.noEmpty'),
          type: 'error'
        })
        return
      }
      if (this.acoVeriForm.password === '') {
        this.$utils.$message({
          message: this.$t('common.password') + this.$t('common.noEmpty'),
          type: 'error'
        })
        return
      }
      let params = { ...this.acoVeriForm }
      params.password = AES.encrypt(params.userName + params.password, this.$api.AES_KEY)
      this.$http.posts('verifyUserPwd', params, '', true)
        .then((res) => {
          this.showAcoVeri = false
          this.paging.pageNumber = 1
          this.paging.pageSize = 10
          this.total = 0
          this.listLength = 0
          this.storesData = []
          this.userData = []
          this.singleOrgId = ''
          this.data = []
          this.allShops = []
          if (this.isCurrentOrg) {
            this.getOrgTree(2)
          } else {
            this.getShops()
          }
        })
    },
    /* ** 调接口方法 ***/
    // 获取组织架构
    getOrgTree(orgType) {
      this.loadTree = true
      this.canClearOrg = true
      // 1.排除门店 2.查询所有
      this.$http.posts('getOrgTree', '', { orgType: orgType, timeout: 0 })
        .then((res) => {
          this.loadTree = false
          this.canClearOrg = false
          if (res.data.length !== 0) {
            if (orgType == 2) {
              this.data = res.data
            } else {
              this.noShopData = res.data
            }
          } else {
            this.data = []
          }
          // 为了让拖拽完成后该拖拽的节点高亮
          // this.curNodeKey为当前拖拽节点
          this.$nextTick(() => {
            if (this.$refs.tree) {
              this.$refs.tree.setCurrentKey(this.curNodeKey)
            }
          })
        }).catch((er) => {
          setTimeout(() => {
            this.loadTree = false
            this.canClearOrg = false
          }, 3000)
        })
    },
    // 获取所有门店
    getShops() {
      this.loadTree = true
      this.canClearOrg = true
      this.$http.posts('getShops', '', '')
        .then((res) => {
          this.loadTree = false
          this.canClearOrg = false
          this.allShops = res.data
          this.allShops2 = this.allShops
        }).catch((er) => {
          setTimeout(() => {
            this.loadTree = false
            this.canClearOrg = false
          }, 3000)
        })
    },
    // 关联门店列表
    getShopList(params, type) {
      // type: 1列表 2树关联 3树未关联
      this.loadTable = true
      this.$http.posts('releShopList', params, '')
        .then((res) => {
          this.loadTable = false
          this.addLoading = false
          if (type == 1) {
            if (res.data.list !== null) {
              this.total = res.data.total
              res.data.list.forEach((e, i) => {
                if (e.phoneNumb && e.phoneNumb.indexOf('+') !== -1) {
                  e.phoneNumb = this.$utils.exchangePrefix(e.phoneNumb)
                }
              })
              this.storesData = res.data.list
              this.listLength = this.storesData.length
            } else {
              this.total = 0
              this.storesData = []
              this.listLength = 0
            }
          }
          if (type == 2) { // 未添加的门店
            if (res.data.list !== null) {
              this.shopData = []
              this.addedshopVal = []
              this.addShopTotal = res.data.total
              this.addShopPageLength = res.data.list.length
              res.data.list.forEach((e, idx) => {
                this.shopData.push({
                  key: e.shopUuid,
                  label: e.shopId + '-' + e.shopName
                })
              })
            } else {
              this.addShopTotal = 0
              this.addShopPageLength = 0
              this.shopData = []
            }
          }
        }).catch((er) => {
          setTimeout(() => {
            this.loadTable = false
            this.addLoading = false
          }, 3000)
        })
    },
    // 关联用户列表
    getUserList(params, type) {
      this.loadTable = true
      // 1关联 2未关联
      this.$http.posts('releUserList', params, '')
        .then((res) => {
          this.loadTable = false
          this.addLoading = false
          if (type == 1) {
            if (res.data.list !== null) {
              this.total = res.data.total
              res.data.list.forEach((e, i) => {
                if (e.showPhone && e.showPhone.indexOf('+') !== -1) {
                  e.showPhone = this.$utils.exchangePrefix(e.showPhone)
                  e.orgName = this.delLastX(e.orgName)
                }
              })
              this.userData = res.data.list
              this.listLength = this.userData.length
            } else {
              this.total = 0
              this.userData = []
              this.listLength = 0
            }
          }
          if (type == 2) { // 未添加的用户
            if (res.data.list !== null) {
              this.memberData = []
              this.addedMemVal = []
              this.addUserTotal = res.data.total
              this.addUserPageLength = res.data.list.length
              res.data.list.forEach((e, idx) => {
                this.memberData.push({
                  key: e.userId,
                  label: e.userName
                })
              })
            } else {
              this.addUserTotal = 0
              this.addUserPageLength = 0
              this.memberData = []
            }
          }
        }).catch((er) => {
          console.log(er)
          setTimeout(() => {
            this.loadTable = false
            this.addLoading = false
          }, 3000)
        })
    },
    // 删除节点
    deleteOrgId(orgId, type) {
      let params = { orgId: orgId }
      if (type === 'root') {
        params = {
          ...params, delOneLevel: true
        }
      }
      const loading = this.$loading({
        lock: true,
        text: this.$t('message.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
      this.clickflag = false
      this.$http.posts('deleteOrgId', '', params, true)
        .then((res) => {
          loading.close()
          let params = { ...this.paging, assoStatus: 1, orgId: this.singleOrgId }
          if (!this.isCurrentOrg) {
            this.getShops()
            $('.shop-tree li').css('background-color', '')
          } else {
            this.getOrgTree(2)
          }
          this.userOrShop(params)
          setTimeout(() => {
            this.clickflag = true
          }, 1000)
        }).catch(er => {
          setTimeout(() => {
            loading.close()
            this.clickflag = true
          }, 1000)
        })
    },
    // 关联门店
    associatedShop(orgId, shopUuids) {
      this.clickflag = false
      let params = {
        orgId,
        shopUuids,
        timeout: 0
      }
      this.$http.posts('associatedShop', params, '', true)
        .then((res) => {
          this.showAddShop = !this.showAddShop
          this.addedshopVal = []
          this.getOrgTree(2)
          let params = { ...this.paging, assoStatus: 1, orgId: this.singleOrgId }
          this.userOrShop(params)
          setTimeout(() => {
            this.clickflag = true
          }, 1000)
        }).catch((er) => {
          setTimeout(() => {
            this.clickflag = true
          }, 1000)
        })
    },
    // 关联用户
    associatedUser(beforeOrgId, userIds) {
      this.clickflag = false
      let params = {
        beforeOrgId,
        userIds,
        timeout: 0
      }
      this.$http.posts('associatedUser', params, '', { showSuccessMsg: false, showErrorMsg: true })
        .then((res) => {
          var successMsg
          this.clickflag = true
          if (res.resMsg) {
            var i18nCode0 = this.$t(`code.${res.resMsg}`)
            i18nCode0.startsWith('code.')
              ? (successMsg = res.resMsg)
              : (successMsg = i18nCode0)
            if (res.resMsg === 'S00115') {
              let box = res.data
              this.addMemData.failedUser = box.failedUser.map((item, index) => {
                return {
                  no: index + 1,
                  ...item
                }
              }) || []
              this.addMemData.successUser = box.successUser.map((item, index) => {
                return {
                  no: index + 1,
                  ...item
                }
              }) || []
              this.resQData = this.addMemData.failedUser
              let num = res.extMsg.split(',')
              num.forEach((item, index) => {
                i18nCode0 = i18nCode0.replace(`xx${index}`, item)
              })
              this.addMemTips = i18nCode0
              this.showAddMem = false
              this.showMemTips = true
              return
            }
          } else {
            successMsg = this.$t('message.submitSuccess')
          }
          this.addedMemVal = []
          this.showAddMem = !this.showAddMem
          // assoStatus 1关联 2未关联
          let params = { ...this.paging, assoStatus: 1, orgId: this.singleOrgId }
          if (this.cutTreeList) {
            this.getOrgTree(2)
          } else {
            this.getShops()
          }
          this.userOrShop(params)
          this.$utils.$message({
            message: successMsg,
            type: 'success'
          })
        }).catch((er) => {
          setTimeout(() => {
            this.clickflag = true
          }, 1000)
        })
    },
    // 移动树
    moveTree(orgId, fatherId) {
      let params = { orgId, fatherId }
      // orgId 移动前组织Id, fatherId 移动后的父组织Id
      this.$http.posts('moveOrgId', '', params, true)
        .then((res) => {
          this.getOrgTree(2)
        })
        .catch((er) => {
          this.getOrgTree(2)
        })
    },
    // 移动列表
    moveList(orgId, fatherId, ids, moveStatue) {
      let params = { afterOrgId: fatherId, orgId, ids, moveStatue }
      // orgId 移动前组织Id, afterOrgId 移动后组织Id, ids 移动id集合id逗号分隔, moveStatue 1.用户 2.门店
      this.$http.posts('moveToOrgId', params, '', true)
        .then((res) => {
          let params = { ...this.paging, assoStatus: 1, orgId: this.singleOrgId }
          this.userOrShop(params)
          setTimeout(() => {
            this.getOrgTree(2)
          }, 500)
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/color';
#organization {
  height: 100%;
  .disappear {
    display: none;
  }
  .query {
    width: 100%;
    height: auto;
    padding: 20px 10px 0;
  }
  section {
    height: calc(100% - 60px);
    aside {
      padding: 20px 2px 10px;
      height: 100%;
      border-right: solid 1px @border1;
      overflow: hidden;
      position: relative;
      .cutOrg {
        margin-top: 15px;
        padding-left: 5px;
        img {
          cursor: pointer;
          width: 24px;
          height: 24px;
          margin-top: 3px;
        }
        i {
          cursor: pointer;
          font-size: 30px;
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
          img {
            width: 14px;
            height: 14px;
            margin: 6px 5px 0 0;
          }
          span {
            display: block;
            width: 270px;
            font-size: 16px;
            line-height: 26px;
          }
          &:hover {
            cursor: pointer;
            background: @background;
          }
        }
      }
      .card {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9;
        .item {
          font-size: 14px;
          padding: 8px 15px;
          &:hover {
            cursor: pointer;
            background: @background;
          }
        }
      }
      // 对话框
      .modeDia {
        p.accountVeriTip {
          text-align: center;
          padding-bottom: 20px;
          color: @text4;
        }
        .uploadBox.flex-hc {
          span.box1 {
            line-height: 34px;
            padding-right: 20px;
            font-size: 16px;
            @media screen and (min-width: 1024px) and (max-width: 1100px) {
              padding-right: 10px;
            }
          }
        }
        .flex {
          span {
            display: inline-block;
            min-width: 100px;
            line-height: 40px;
          }
        }
        .moveBox {
          width: 100%;
          height: auto;
          .boxLeft {
            min-width: 50%;
            padding-left: 20px;
            overflow-x: scroll;
            p {
              padding-bottom: 10px;
            }
          }
          .left {
            border-right: solid 1px @border1;
          }
        }
      }
    }
    // main {
    //   overflow: hidden;
    // }
  }
  .el-main {
    padding: 0 0 0 8px;
  }
}
</style>
