<template>
  <el-container class="container" style="height: 100%;">
    <el-aside width="45%" style="border-right: 1px solid #e6e6e6;position: relative;overflow:unset;">

      <my-container v-loading="pageLoading">
        <!--顶部操作-->
        <template #header>
          <el-form class="ad-form-query" :inline="true" @submit.native.prevent>
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
              <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
        </template>

        <!--列表-->
        <el-table
          ref="attributeTable"
          v-loading="listLoading"
          :data="Attributes"
          highlight-current-row
          :row-key="getRowKeys"
          height="'100%'"
          style="width: 100%;height:100%;"
          @current-change="onCurrentChange"
          @row-dblclick="onSure"
          @selection-change="onSelectionChange"
        >
          <el-table-column v-if="multiple" type="selection" width="50" :reserve-selection="true" />
          <el-table-column prop="name" label="名称" width />
          <el-table-column prop="code" label="编码" width />
          <el-table-column prop="groupName" label="模块" width />
          <el-table-column prop="unit" label="单位" width />

        </el-table>

        <!--分页-->
        <template #footer>
          <my-pagination
            ref="pager"
            :total="total"
            :checked-count="sels.length"
            @get-page="getAttributes"
          />
        </template>

      </my-container>

    </el-aside>
    <el-main style="height:100%;">
      <el-tag v-for="item in sels" closable @close="handleClose(item)">{{ item.deviceName }}. {{ item.name }}</el-tag>
    </el-main>
  </el-container>
</template>

<script>
import { getAttributeListPage } from '@/api/mcs/attribute'
import MyContainer from '@/components/my-container'
import MyConfirmButton from '@/components/my-confirm-button'

export default {
  name: 'Attribute',
  components: { MyContainer, MyConfirmButton },
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    parentRow: {
      type: Object,
      default: function() { return { groupId: null } }
    }
  },
  data() {
    return {
      sels: [],
      filter: {
        name: '',
        groupId: this.parentRow.id
      },
      activeName: 'basic',
      constraints: '',
      attributeTypes: [{ label: 'Model', value: 0 }, { label: 'Command', value: 1 }, { label: 'Communication', value: 2 }],

      Attributes: [],
      total: 0,

      listLoading: false,

      pageLoading: false,

      currentRow: null
    }
  },

  watch: {
    parentRow(val) {
      this.filter.groupId = val.id
      this.getAttributes()
    }
  },
  async mounted() {
    // await this.getAttributes()
  },
  methods: {
    handleClose(item) {
    //   this.sels.splice(this.sels.indexOf(item), 1);
      item.checked = false
      this.$refs.attributeTable.toggleRowSelection(item)
    //  this.$refs.attributeTable.clearSelection();
    }, toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.attributeTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.attributeTable.clearSelection()
      }
    },

    getRowKeys(row) {
      return this.deviceId + '' + row.id
    },
    // 查询
    onSearch(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getAttributes()
    },

    // 获取属性列表
    async getAttributes() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        filter: this.filter
      }

      this.listLoading = true

      const res = await getAttributeListPage(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      data.forEach(d => {
        d.deviceId = this.parentRow.deviceId
        d.deviceName = this.parentRow.deviceName
        d.modelId = this.parentRow.modelId
        d.modelName = this.parentRow.modelName
        d._loading = false
      })
      this.Attributes = data
    },
    // 确定
    onSure() {
      if (this.multiple) {

      } else { this.$emit('click', this.form, this.multiple ? this.sels : this.currentRow) }
    },
    onCurrentChange(row) {
      this.currentRow = row
    },
    onSelectionChange(sels) {
      this.sels = sels
      this.$emit('change', sels)
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
::v-deep .el-tabs .el-tabs__content{
  height: calc(100% - 2px);
}
</style>
