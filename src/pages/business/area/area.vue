<template>
  <div id="area">
    <el-tabs v-model="tab1Active">
      <el-tab-pane :label="$t('tabs.ShopArea')" name="shop">
        <area-shop v-if="tab1Active === 'shop'" :button="button"></area-shop>
      </el-tab-pane>
      <el-tab-pane :label="$t('tabs.areaCamera')" name="camera">
        <area-camera v-if="tab1Active === 'camera'" :button="button"></area-camera>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AreaShop from '@/pages/business/area/areaShop'
import AreaCamera from '@/pages/business/area/areaCamera'
export default {
  name: 'Area',
  data() {
    return {
      tab1Active: 'shop',
      button: []
    }
  },
  watch: {},
  mounted() {
    this.$utils.getButton(this.$route.path, 2).then(res => {
      this.button = res
    })
  },
  methods: {},
  components: {
    AreaShop,
    AreaCamera
  }
}
</script>
