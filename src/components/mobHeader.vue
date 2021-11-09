<template>
  <div class="mobHeader">
    <div class="goback" @click="goback"><i class="el-icon-arrow-left"></i></div>
    <div class="title">{{ $t(headerText) }}</div>
    <img class="drawer" v-if="showDrawer" :src="require('../assets/images/mob/Open.png')" @click="showList" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      showDrawer: false
    }
  },
  computed: {
    ...mapGetters(['headerText'])
  },
  watch: {
    headerText(val) {
      // console.log(val)
    },
    '$route'(to, from) {
      this.showDrawer = to.name === 'GenernalAgreement' || false
    }
  },
  created() { },
  mounted() { },
  methods: {
    goback() {
      this.$router.back()
    },
    showList() {
      this.$eventBus.$emit('showList', true)
    }
  }
}
</script>

<style lang="less">
@import '../assets/color.less';
.mobHeader {
  height: 4.2rem;
  padding: 0 1.5rem;
  color: #fff;
  background: @main1;
  line-height: 4.2rem;
  text-align: center;
  position: relative;
  font-size: 1.5rem;
  .goback {
    position: absolute;
    left: 1.2rem;
    top: 1.4rem;
    width: 1.25rem;
    height: 1.75rem;
    line-height: 1.75rem;
    .el-icon-arrow-left {
      font-size: 1.5rem;
      color: #fff !important;
    }
  }
  .drawer {
    position: absolute;
    right: 1.5rem;
    top: 1.35rem;
    width: 2.2rem;
    height: 1.7rem;
  }
}
</style>
