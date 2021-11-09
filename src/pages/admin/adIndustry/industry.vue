<template>
  <div id="adIndustry">
    <el-tabs v-model="tab1Active">
      <el-tab-pane :label="$t('industry.tabs1')" name="classification">
        <classification v-if="tab1Active === 'classification'"></classification>
      </el-tab-pane>
      <el-tab-pane :label="$t('industry.tabs2')" name="species">
        <species v-if="tab1Active === 'species'"></species>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Classification from '@/pages/admin/adIndustry/classification'
import Species from '@/pages/admin/adIndustry/species'
export default {
  components: { Classification, Species },
  data() {
    return {
      tab1Active: 'classification'
    }
  },
  mounted() { },
  methods: {}
}
</script>
