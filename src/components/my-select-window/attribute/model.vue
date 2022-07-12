<template>
  <my-container>
    <!--查询-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="filter.name"
            placeholder="名称"
            clearable
            @keyup.enter.native="onSearch"
          >
            <template #prefix>
              <i class="el-input__icon el-icon-search" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </template>

    <!--列表-->
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="groupTree"
      row-key="id"
      :default-expand-all="true"
      highlight-current-row
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      height="'100%'"
      style="width: 100%;height:100%;"
      @select="onSelect"

      @current-change="onCurrentChange"
    >
      <!-- <el-table-column type="selection" width="50" /> -->
      <el-table-column prop="name" label="型号名称">
        <template #default="{ $index, row }">

          <el-tag v-if="row.groupType!==undefined" :type="colorGroupTypes[row.groupType]">  {{ groupTypes[row.groupType] }}
          </el-tag> {{ row.name }}
        </template>
      </el-table-column>
    </el-table>
  </my-container>
</template>

<script>
import { formatTime, treeToList, listToTree } from '@/utils'
import { getList } from '@/api/mcs/model'
import MyContainer from '@/components/my-container'

export default {
  name: 'Model',
  _sync: {
    disabled: false,
    title: '管理',
    desc: '',
    cache: true
  },
  components: { MyContainer },
  data() {
    return {
      filter: {
        name: ''
      },
      groupTree: [],
      colorGroupTypes: ['success', 'danger', 'warning'],
      groupTypes: ['Attributes', 'Command', 'Comm Config'],
      statusList: [
        { name: '激活', value: true },
        { name: '禁用', value: false }
      ],
      sels: [],
      listLoading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    onSearch() {
      this.getList()
    },

    getModel(modelId) {
      for (let k = 0; k < this.groupTree.length; k++) {
        const item = this.groupTree[k]
        if (item.id === modelId) {
          return item
        }
      }
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      // if (row.groupType !== undefined)
      var model = this.getModel(currentRow.modelId)
      if (model !== null && model !== undefined) { currentRow.modelName = model.name }
      this.$emit('current-change', currentRow, oldCurrentRow)
    },
    // 获取列表
    async getList() {
      const para = {
        key: this.filter.name
      }
      this.listLoading = true
      const res = await getList(para)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      const list = _.cloneDeep(res.data)
      list.forEach(d => {
        d._loading = false
      })
      const tree = listToTree(list)
      this.groupTree = tree
    },
    onSelect: function(selection, row) {
      const checked = selection.some(s => s.id === row.id)
      if (row.children && row.children.length > 0) {
        const rows = treeToList(row.children)
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row, checked)
        })
      }
      this.sels = this.$refs.multipleTable.selection
    }
  }
}
</script>
