<template>
  <div class="inputTree">
    <el-popover placement="bottom-start" popper-class="treePopover">
      <el-input class="filterInput" v-if="filter" :placeholder="$t('placeholder.filter')" v-model="filterText"></el-input>
      <el-tree class="tree" ref="tree" :data="data" node-key="id" :show-checkbox="showCheckbox" :props="props" :filter-node-method="handleFilterNode" @node-click="handleNodeClick" @check="handleCheck" :highlight-current="highlightCurrent"></el-tree>
      <div slot="reference" class="input" @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">
        <el-input v-model="inputTreeText" readonly :placeholder="$t('placeholder.select')"></el-input>
        <i v-show="showCloseIcon" class="el-icon-circle-close close" @click.stop="handleClearInputTree"></i>
      </div>
    </el-popover>
  </div>
  <!-- <el-input slot="reference" ref="inputTree" v-model="inputTreeText" clearable :placeholder="$t('placeholder.select')" @clear="handleClearInputTree"></el-input> -->
</template>

<script>
// 使用方法 父组件上写
// 如<input-tree ref="orgTree" v-model="queryForm.orgId" :show-checkbox="true" :data="busiOrgTree" @node-click="handleNodeClick"></input-tree>

// 属性Attributes 与el-tree用法相同
// data 展示数据 // props 配置选项 // show-checkbox 节点是否可被选择
// + value/v-model 绑定的key数组 自己新增的 // + filter 是否可以筛选 自己新增的

// 方法 与el-tree用法相同 如this.$refs.orgTree.getCheckedNodes()
// getCheckedNodes // getCheckedKeys // setCheckedKeys // getCurrentKey // getCurrentNode // setCurrentKey
// 以下方法注释掉了，有需要放开
// setCheckedNodes // setChecked // getHalfCheckedNodes // getHalfCheckedKeys // setCurrentNode // getNode

// 事件Events 与el-tree用法相同
// node-click // check
// 以下事件注释掉了，有需要放开
// check-change // current-change // node-expand // node-collapse
export default {
  name: 'InputTree',
  data() {
    return {
      filterText: '',
      inputTreeText: '',
      watchValue: true, // 为了父组件如果传了value。是否执行watchValue，父组件改变value才执行，子组件不用，优化。否则复选框选中延迟
      showCloseIcon: false, // 如用原el-input的,需写了clearable
      // 1.再写readonly属性,x就不出现了 2.而且点击会冒泡，闪一下，再关闭掉。可用popover的:disabled解
      highlightCurrent: false// 单选为true，多选为false
    }
  },
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    props: {
      type: Object,
      default: function () {
        return {
          children: 'children',
          label: 'label'
        }
      }
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: function () {
        return []
      }
    },
    filter: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    showCheckbox: {
      handler(newVal, oldVal) {
        newVal ? this.highlightCurrent = false : this.highlightCurrent = true
      },
      immediate: true
    },
    // 父组件value如果不是空数组
    value: {
      handler(newVal, oldVal) {
        // console.log('value', newVal, oldVal)
        this.handleValueAndDataChange()
      },
      deep: true,
      immediate: true
    },
    // 父组件value如果不是空数组
    data: {
      handler(newVal, oldVal) {
        // console.log('data', newVal, oldVal)
        this.handleValueAndDataChange()
      },
      deep: true
      // immediate: true
    }
  },
  created() { },
  mounted() { },
  methods: {
    // 过滤
    handleFilterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // value和data改变的时候，在watch中调用 为了父组件如果value如果不是空数组
    handleValueAndDataChange(type) {
      // console.log(type, this.value, this.data.length)
      if (this.watchValue) {
        this.$nextTick(() => {
          var tree = this.$refs.tree
          // console.log(this.$refs.tree)
          if (this.showCheckbox) {
            tree.setCheckedKeys(this.value)
            this.handleInputTreeText(tree.getCheckedNodes())
          } else {
            tree.setCurrentKey(this.value[0])
            // console.log('getCurrentNode', this.$refs.tree.getCurrentNode())
            var getNodes = tree.getCurrentNode()
            var nodes = getNodes ? [getNodes] : []
            this.handleInputTreeText(nodes)
          }
        })
      } else {
        this.watchValue = true
      }
    },
    // 在node-click和check中调用
    handleInputTreeText(nodes) {
      // console.log(' handleInputTreeText', nodes)
      var inputTreeText = nodes.map((item) => {
        return item[this.props.label]
      }).join()
      this.inputTreeText = inputTreeText
    },
    // 控制x的显示与隐藏
    handleMouseenter() {
      this.inputTreeText ? this.showCloseIcon = true : this.showCloseIcon = false
    },
    // 控制x的显示与隐藏
    handleMouseleave() {
      this.showCloseIcon = false
    },
    // 点击x图标
    handleClearInputTree() {
      // 以下注释的在watch value改变时会执行
      // this.$refs.tree.setCheckedKeys([])
      // this.inputTreeText = ''
      // this.showCloseIcon = false
      this.highlightCurrent = false
      this.$emit('input', [])
    },
    // 节点被点击时的回调，节点触发，三角不触发
    handleNodeClick(data, node, component) {
      // console.log('handleNodeClick', data, node, component)
      if (!this.showCheckbox) {
        this.highlightCurrent = true
        this.handleInputTreeText([data])
        this.watchValue = false
        this.$emit('input', [data.id])
      }
      this.$emit('node-click', data, node, component)
    },
    // 当复选框被点击的时候触发，复选框触发
    handleCheck(data, currentTree) {
      // console.log('handleCheck', data, currentTree)
      if (this.showCheckbox) {
        this.handleInputTreeText(currentTree.checkedNodes)
        this.watchValue = false
        this.$emit('input', this.$refs.tree.getCheckedKeys(true))
      }
      this.$emit('check', data, currentTree)
    },
    // 若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点所组成的数组
    // 参数(leafOnly, includeHalfChecked) ：两个 boolean 类型的参数，
    // 1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
    getCheckedNodes(leafOnly, includeHalfChecked) {
      return this.$refs.tree.getCheckedNodes(leafOnly, includeHalfChecked)
    },
    // 若节点可被选择（即 show- checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
    // 参数(leafOnly)：接收一个 boolean 类型的参数，若为 true 则仅返回被选中的叶子节点的 keys，默认值为 false
    getCheckedKeys(leafOnly) {
      return this.$refs.tree.getCheckedKeys(leafOnly)
    },
    // 通过 keys 设置目前勾选的节点，使用此方法必须设置 node- key 属性
    // 参数(keys, leafOnly)：
    // 1. 勾选节点的 key 的数组 2. boolean 类型的参数，若为 true 则仅设置叶子节点的选中状态，默认值为 false
    setCheckedKeys(keys, leafOnly) {
      this.$refs.tree.setCheckedNodes(keys, leafOnly)
    },
    // 获取当前被选中节点的 key，使用此方法必须设置 node - key 属性，若没有节点被选中则返回 null
    getCurrentKey() {
      return this.$refs.tree.getCurrentKey()
    },
    // 获取当前被选中节点的 data，若没有节点被选中则返回 null
    getCurrentNode() {
      return this.$refs.tree.getCurrentNode()
    },
    // 通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node - key 属性
    // 参数(key)：待被选节点的 key，若为 null 则取消当前高亮的节点
    setCurrentKey(key) {
      this.$refs.tree.setCurrentKey(key)
    }
    // // 节点选中状态发生变化时的回调，复选框触发
    // handleCheckChange(data, checked, subChecked) {
    //   // console.log('handleCheckChange', data, checked, subChecked)
    //   this.$emit('check-change', data, checked, subChecked)
    // },
    // // 当前选中节点变化时触发的事件，节点触发
    // handleCurrentChange(data, node) {
    //   // console.log('handleCurrentChange', data, node)
    //   this.$emit('current-change', data, node)
    // },
    // // 节点被展开时触发的事件，三角/节点
    // handleNodeExpand(data, node, component) {
    //   // console.log('handleNodeExpand', data, node, component)
    //   this.$emit('node-expand', data, node, component)
    // },
    // // 节点被关闭时触发的事件，三角/节点
    // handleNodeCollapse(data, node, component) {
    //   // console.log('handleNodeCollapse', data, node, component)
    //   this.$emit('node-collapse', data, node, component)
    // },
    // // 设置目前勾选的节点，使用此方法必须设置 node-key 属性
    // // 参数(nodes)：接收勾选节点数据的数组
    // setCheckedNodes(nodes) {
    //   this.$refs.tree.setCheckedNodes(nodes)
    // },
    // // 通过 key / data 设置某个节点的勾选状态，使用此方法必须设置 node - key 属性
    // // 参数(key / data, checked, deep)：
    // // 1. 勾选节点的 key 或者 data 2. boolean 类型，节点是否选中 3. boolean 类型，是否设置子节点 ，默认为 false
    // setChecked(data, checked, deep) {
    //   this.$refs.tree.setChecked(data, checked, deep)
    // },
    // // 若节点可被选择（即 show - checkbox 为 true），则返回目前半选中的节点所组成的数组
    // getHalfCheckedNodes() {
    //   return this.$refs.tree.getHalfCheckedNodes()
    // },
    // // 若节点可被选择（即 show - checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
    // getHalfCheckedKeys() {
    //   return this.$refs.tree.getHalfCheckedKeys()
    // },
    // // 通过 node 设置某个节点的当前选中状态，使用此方法必须设置 node - key 属性
    // // 参数(node)：待被选节点的 node
    // setCurrentNode(node) {
    //   this.$refs.tree.setCurrentNode(node)
    // },
    // // 根据 data 或者 key 拿到 Tree 组件中的 node(data)
    // // 参数(data)：要获得 node 的 key 或者 data
    // getNode(data) {
    //   return this.$refs.tree.getNode(data)
    // },
  }
}
</script>

<style lang="less">
.inputTree {
  .input {
    position: relative;
    .el-input {
      .el-input__inner {
        padding-right: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .close {
      position: absolute;
      top: 50%;
      right: 10px;
      margin-top: -7px;
      color: #c0c4cc;
      font-size: 14px;
      cursor: pointer;
      background-color: #fff;
    }
  }
}
// 滚动条美化了，样式在style.css
div.treePopover {
  min-width: 255px;
  min-height: 100px;
  max-height: 650px;
  padding: 0 2px 0 0;
  position: relative;
  .filterInput {
    padding: 15px 22px 0 22px;
  }
  .tree {
    padding: 12px 10px 12px 12px;
    max-height: 580px;
    overflow: auto;
  }
}
.el-popover.treePopover {
  padding: 0 0 \0;
  .tree {
    padding: 12px 18px 12px \0;
  }
}
</style>
