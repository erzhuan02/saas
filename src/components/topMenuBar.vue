<template>
  <span id="topMenuBar">
    <!-- 工单 -->
    <el-popover v-if="homeMenus.myWorkOrder || homeMenus.addWorkOrder" placement="bottom" trigger="hover">
      <div class="flex newOrder">
        <p v-if="homeMenus.myWorkOrder" class="pointer" @click="toPage('/comMyWorkOrder', { wkStatus: '2' })">{{ $t('OV.toConfirm') }}({{comWkConfirmTotal}})</p>
        <button class="pointer" v-if="homeMenus.addWorkOrder" @click="toPage('/comAddWorkOrder')">{{ $t('home.nav42') }}</button>
      </div>
      <el-divider></el-divider>
      <p v-if="homeMenus.myWorkOrder" class="seeAllOrders pointer" @click="toPage('/comMyWorkOrder')">{{ $t('common.all') }}</p>
      <i class="el-icon-s-order" slot="reference"></i>
    </el-popover>
    <!-- 消息 -->
    <el-popover v-if="homeMenus.allMessage" placement="bottom" trigger="hover">
      <div class="flex-hb newOrder">
        <p class="pointer" @click="toPage('/comAllMsgs', {isUnread: true })">{{ $t('OV.unread') }} ({{comMsgUnreadTotal > 99 ? '99+' : comMsgUnreadTotal}})</p>
        <p class="pointer" @click="toPage('/comAllMsgs')">{{ $t('OV.enterMes') }}</p>
      </div>
      <ul class="msg" @click="toPage('/comAllMsgs', {isUnread: true })">
        <li v-for="item in comMsgUnreadList" :key="item.msgId">
          <el-divider></el-divider>
          <p class="three-txt-cut title">{{item.title}}</p>
          <p>{{item.receiveTime}}</p>
        </li>
      </ul>
      <i class="el-icon-chat-dot-square" slot="reference"></i>
    </el-popover>
    <!-- 余额 -->
    <el-popover v-if="homeMenus.orderManager || homeMenus.renewManager" placement="bottom" trigger="hover">
      <ul class="flex amount">
        <li class="flex pointer" @click="toPage('/finOrderMange')" v-if="homeMenus.orderManager">
          <i class="el-icon-s-marketing"></i>
          <span>{{ $t('home.nav71') }}</span>
        </li>
        <li class="flex pointer" @click="toPage('/renewMange')" v-if="homeMenus.renewManager">
          <i class="el-icon-s-ticket"></i>
          <span>{{ $t('home.nav73') }}</span>
        </li>
      </ul>
      <i class="el-icon-money" slot="reference"></i>
    </el-popover>
    <i class="el-icon-question"></i>
    <!-- 基本信息 -->
    <el-popover v-if="homeMenus.basicInfo" placement="bottom" trigger="hover">
      <span class="pointer" @click="toPage('/bmBasicInfo')">{{ $t('home.nav11') }}</span>
      <i class="el-icon-more" style="transform:rotate(90deg)" slot="reference"></i>
    </el-popover>
    <i class="el-icon-user-solid"></i>
  </span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      menu: [], // 菜单
      // wdCount: 0, // 待确认工单数
      homeMenus: {}
    }
  },
  computed: {
    ...mapGetters(['comWkConfirmTotal', 'comMsgUnreadList', 'comMsgUnreadTotal'])
  },
  created() {
    let data = JSON.parse(sessionStorage.getItem('comInit'))
    this.$store.commit('COM_WK_CONFIRM_TOTAL', data.wdCount)
    this.menu = data.homeMenus
    // console.log()
    this.menu.forEach(item => {
      this.homeMenus[item] = true
    })
    this.$store.dispatch('comGetMsgList', {
      onlySearch: 'unread'
      // isUnread: true,
      // msgType: '',
      // pageNumber: 1, // 当前页
      // pageSize: 5// 一页显示多少条
    })
  },
  methods: {
    // 跳转页面
    toPage(path, data) {
      // console.log(path, data)
      // 判断是否是当前路由
      // console.log(path, this.$route.path, path === this.$route.path)
      if (path === this.$route.path) {
        this.$router.push({
          path,
          query: data
        })
        this.$emit('reload', path, data)
      } else {
        this.$router.push({
          path,
          query: data
        })
      }
      // this.$router.push({
      //   path,
      //   query: data
      // })
    }
  }
}
</script>

<style scoped lang="less">
@import '../assets/color';
i {
  font-size: 22px;
  margin: 0 5px;
}
.newOrder {
  p {
    line-height: 30px;
    &:first-child {
      margin-right: 20px;
    }
  }
  button {
    width: auto;
    height: 30px;
    color: #fff;
    background: @main;
    border-radius: 5px;
    padding: 0 10px;
  }
}
.seeAllOrders {
  text-align: center;
}
.msg {
  width: 280px;
  li {
    line-height: 22px;
    .el-divider--horizontal {
      margin: 6px 0;
    }
    p {
      padding: 0 8px;
      font-size: 12px;
    }
    .title {
      // font-size: 14px;
      font-weight: 700;
    }
  }
  // li:first-child {
  //   font-size: 14px;
  //   font-weight: bold;
  //   margin-bottom: 10px;
  //   border-bottom: none;
  // }
}
.amount {
  li {
    i {
      margin-right: 5px;
    }
    &:nth-child(2n-1) {
      margin-right: 50px;
    }
  }
}
.unreadIcon {
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: red;
}
</style>
