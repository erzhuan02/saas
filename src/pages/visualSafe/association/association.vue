<template>
  <div id="association">
    <el-tabs v-model="tabActive">
      <el-tab-pane :label="$t('association.tabs1')" name="first">
        <asso-first v-if="tabActive === 'first'"></asso-first>
      </el-tab-pane>
      <el-tab-pane :label="$t('association.tabs2')" name="second">
        <asso-second v-if="tabActive === 'second'"></asso-second>
      </el-tab-pane>
      <el-tab-pane :label="$t('association.tabs3')" name="third">
        <asso-third v-if="tabActive === 'third'"></asso-third>
      </el-tab-pane>
      <el-tab-pane :label="$t('association.tabs4')" name="fourth">
        <asso-fourth v-if="tabActive === 'fourth'"></asso-fourth>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AssoFirst from '@/pages/visualSafe/association/assoFirst'
import AssoSecond from '@/pages/visualSafe/association/assoSecond'
import AssoThird from '@/pages/visualSafe/association/assoThird'
import AssoFourth from '@/pages/visualSafe/association/assoFourth'
export default {
  components: { AssoFirst, AssoSecond, AssoThird, AssoFourth },
  data() {
    return {
      tabActive: 'first'
    }
  },
  mounted() { },
  methods: {}
}
</script>
