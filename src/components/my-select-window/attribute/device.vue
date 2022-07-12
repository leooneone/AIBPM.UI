<template>
  <my-container v-loading="pageLoading">
    <!--顶部操作-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="filter.name"
            placeholder="设备名称"
            clearable
            @keyup.enter.native="onSearch"
          >
            <template #prefix>
              <i class="el-input__icon el-icon-search" />
            </template>
          </el-input>
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

      @current-change="onCurrentChange"
      @select="onSelsChange"
    >
      <el-table-column prop="name" label="名称">
        <template #default="{ $index, row }">

          <el-tag v-if="row.groupType!==undefined" :type="colorGroupTypes[row.groupType]">  {{ groupTypes[row.groupType] }}
          </el-tag>
          <span v-if="row.groupType!==undefined"> {{ row.name }}</span>
          <span v-else>  {{ isDevice ?row.name :row.modelName }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column prop="code" label="编码" width />-->
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{row}">
          <el-tag :type="row.status==1 ? 'success' : 'info'" disable-transitions>
            {{ getStatus(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="modelName" label="型号" width />
      <el-table-column prop="locationName" label="位置" width />-->

    </el-table>

    <!--分页-->
    <template #footer>
      <my-pagination
        ref="pager"
        :total="total"
        :checked-count="sels.length"
        @get-page="getDevices"
      />
    </template>

  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import { getDeviceListPage } from '@/api/mcs/device'
import MyContainer from '@/components/my-container'

export default {
  name: 'Device',
  components: { MyContainer },

  props: {
    isDevice: { type: Boolean, default: true }},
  _sync: {
    disabled: false,
    title: '设备管理',
    desc: '',
    cache: true
  },
  data() {
    return {
      statusList: [
        { name: '激活', value: 1 },
        { name: '禁用', value: 0 }
      ],
      // 高级查询字段
      filter: {
        name: ''
      },
      groupTree: [],
      colorGroupTypes: ['success', 'danger', 'warning'],
      groupTypes: ['Attributes', 'Command', 'Comm Config'],
      configAttributes: [],
      searchWindowVisible: false,
      dynamicFilter: null,
      total: 0,
      sels: [], // 列表选中列
      listLoading: false,

      pageLoading: false
    }
  },
  async mounted() {
    await this.getDevices()
  },
  methods: {
    getStatus(sts) {
      for (let k = 0; k < this.statusList.length; k++) {
        const status = this.statusList[k]
        if (status.value === sts) { return status.name }
      }
      return ''
    },
    formatCreatedTime(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    // 查询
    onSearch(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getDevices()
    },
    // 获取设备列表
    async getDevices() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        dynamicFilter: this.dynamicFilter
      }
      this.listLoading = true
      const res = await getDeviceListPage(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      data.forEach(d => {
        d._loading = false
      })
      this.groupTree = data
    },
    getDevice(modelId) {
      for (let k = 0; k < this.groupTree.length; k++) {
        const item = this.groupTree[k]
        if (item.modelId === modelId) {
          return item
        }
      }
    },
    onCurrentChange(currentRow, oldCurrentRow) {
      var device = this.getDevice(currentRow.modelId)
      if (device !== null && device !== undefined) {
        currentRow.deviceId = device.id
        currentRow.deviceName = device.name
        currentRow.modelName = device.modelName
      }
      this.$emit('current-change', currentRow, oldCurrentRow)
    },
    // 选择
    onSelsChange(sels) {
      this.sels = sels
    }
  }
}
</script>

<style lang="scss" scoped>
.my-search ::v-deep .el-input-group__prepend {
  background-color: #fff;
}
.el-date-editor.el-input, .el-date-editor.el-input__inner{
  width:100%;
  margin-left: 0px;
}
</style>
