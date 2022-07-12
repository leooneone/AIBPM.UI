<template>
  <my-container v-loading="pageLoading">
    <!--查询-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="filter.name"
            placeholder="模板名称"
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
        <el-form-item v-if="checkPermission(['api:bpm:workflowtemplate:add'])">
          <el-button type="primary" @click="onAdd">新增</el-button>
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:bpm:workflowtemplate:batchsoftdelete'])">
          <my-confirm-button
            :disabled="sels.length === 0"
            :type="'delete'"
            :placement="'bottom-end'"
            :loading="deleteLoading"
            :validate="batchDeleteValidate"
            style="margin-left: 0px;"
            @click="onBatchDelete"
          >
            <template #content>
              <p>确定要批量删除吗？</p>
            </template>
            批量删除
          </my-confirm-button>
        </el-form-item>
      </el-form>
    </template>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="workflowtemplates"
      highlight-current-row
      height="'100%'"
      style="width: 100%;height:100%;"
      @selection-change="selsChange"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="name" label="模板名称" width />
      <el-table-column prop="version" label="版本" width />
      <el-table-column prop="description" label="说明" width />
      <el-table-column prop="createdTime" label="创建时间" :formatter="formatCreatedTime" width />
      <el-table-column prop="state" label="状态" width="200">
        <template #default="{row}">
          <el-tag
            :type="row.state ? 'success' : 'danger'"
            disable-transitions
          >{{ row.state ? '正常' : '禁用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="checkPermission(['api:bpm:workflowtemplate:update','api:bpm:workflowtemplate:softdelete'])" label="操作" width="180">
        <template #default="{ $index, row }">
          <el-button v-if="checkPermission(['api:bpm:workflowtemplate:update'])" @click="onEdit($index, row)">编辑</el-button>
          <my-confirm-button
            v-if="checkPermission(['api:bpm:workflowtemplate:softdelete'])"
            type="delete"
            :loading="row._loading"
            :validate="deleteValidate"
            :validate-data="row"
            @click="onDelete($index, row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <template #footer>
      <my-pagination
        ref="pager"
        :total="total"
        :checked-count="sels.length"
        @get-page="getworkflowtemplates"
      />
    </template>

      
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import { getPage, removeworkflowtemplate, edit, add, batchRemoveworkflowtemplate, get } from '@/api/bpm/template'
import MyContainer from '@/components/my-container'
import MyConfirmButton from '@/components/my-confirm-button'
import MyWindow from '@/components/my-window'
export default {
  name: 'workflowtemplate',
  _sync: {
    disabled: false,
    title: '模板管理',
    desc: '',
    cache: true
  },
  components: { MyContainer, MyConfirmButton, MyWindow },
  data() {
    return {
      filter: {
        name: ''
      },
      workflowtemplates: [],
      total: 0,
      sels: [], // 列表选中列
      statusList: [
        { name: '激活', value: true },
        { name: '禁用', value: false }
      ],
      listLoading: false,

      pageLoading: false,     
    
      deleteLoading: false,

      selectPermissionVisible: false,
      currentRow: null
    }
  },
  computed: {
    workflowtemplateId() {
      return this.currentRow?.id
    },
    title() {
      return `设置${this.currentRow?.name}（${this.currentRow?.code}）权限`
    }
  },
  mounted() {
    this.getworkflowtemplates()
  },
  beforeUpdate() {
    // console.log('update')
  },
  methods: {
    formatCreatedTime: function(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    onSearch() {
      this.$refs.pager.setPage(1)
      this.getworkflowtemplates()
    },
    // 获取模板列表
    async getworkflowtemplates() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        filter: this.filter
      }
      this.listLoading = true
      const res = await getPage(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      data.forEach(d => {
        d._loading = false
      })
      this.workflowtemplates = data
    },
    // 显示编辑界面
    async onEdit(index, row) {
      
      window.open('/bpm?id='+row.id) 
    }, 
    // 显示新增界面
    onAdd() {
      window.open('/bpm') 
    }, 
    // 删除验证
    deleteValidate(row) {
      const isValid = true

      return isValid
    },
    // 删除
    async onDelete(index, row) {
      row._loading = true
      const para = { id: row.id }
      const res = await removeworkflowtemplate(para)
      row._loading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })

      this.getworkflowtemplates()
    },
    // 批量删除验证
    batchDeleteValidate() {
      const isValid = true

      return isValid
    },
    // 批量删除
    async onBatchDelete() {
      const para = { ids: [] }
      para.ids = this.sels.map(s => {
        return s.id
      })

      this.deleteLoading = true
      const res = await batchRemoveworkflowtemplate(para.ids)
      this.deleteLoading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.batchDeleteOk'),
        type: 'success'
      })

      this.getworkflowtemplates()
    },
    selsChange: function(sels) {
      this.sels = sels
    }
  }
}
</script>
