<template>
  <div id="area">
    <el-tabs v-model="tab1Active">
      <el-tab-pane :label="$t('home.nav103')" name="hours">
        <hours v-if="tab1Active === 'hours'"></hours>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Hours from '@/pages/business/hoursSetting/hours'
export default {
  name: 'HourSetting',
  data() {
    return {
      tab1Active: 'hours'
    }
  },
  watch: {},
  mounted() { },
  methods: {},
  components: {
    Hours
  }
}
</script>
