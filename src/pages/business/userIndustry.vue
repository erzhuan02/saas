<template>
  <div id="userIndustry">
    <h3>{{ $t('home.nav104_1') }}</h3>
    <el-form class="form" label-width="120px">
      <el-form-item :label="$t('industry.industrySelected')" prop="industry">
        <el-select v-model="industry" :placeholder="$t('placeholder.select')" clearable>
          <el-option v-for="item in options" :key="item.id" :label="item.categoryName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button class="btnClr save" type="primary" @click="save">{{ $t('button.save') }}</el-button>
    </el-form>
  </div>
</template>

<script>
import $utils from '@/utils'
export default {
  data() {
    return {
      industry: '',
      options: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$http.posts('companyCategoryList').then(res => {
        this.options = res.data
        this.options.forEach(item => {
          if (item.isCheck) this.industry = item.id
        })
      })
    },
    save() {
      if (this.industry === '') {
        this.$utils.$message({
          type: 'error',
          message: this.$t('industry.selectIndustry')
        })
        return
      }
      this.$http.posts('updateCategoryConfig', '', { id: this.industry }, true).then(res => { })
    }
  }
}
</script>

<style lang="less">
@import '../../assets/color';
#userIndustry {
  h3 {
    padding: 30px 10px;
  }
  .form {
    width: 50%;
    padding-left: 5%;
    .save {
      display: block;
      margin: 30px auto;
    }
  }
}
</style>
