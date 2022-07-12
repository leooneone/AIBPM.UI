<template>
  <my-container v-loading="pageLoading">
    <!--顶部操作-->
    <template #header>
      <el-form class="ad-form-query" :inline="true" @submit.native.prevent>
        <el-form-item>
          <my-search :fields="fields" @click="onSearch" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onsearchWindowVisible">高级查询</el-button>
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:bpm:workItem:add'])">
          <el-button type="primary" @click="onAdd">新增</el-button>
        </el-form-item>
        <el-form-item v-if="checkPermission(['api:bpm:workItem:batchsoftdelete'])">
          <my-confirm-button
            :disabled="sels.length === 0"
            :type="'delete'"
            :placement="'bottom-end'"
            :loading="deleteLoading"
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
      :data="Task"
      highlight-current-row
      height="'100%'"
      style="width: 100%;height:100%;"
      @selection-change="onSelsChange"
    >
    <el-table-column
      label="序号"
      align="center"
      type="index"
      width="50">
    </el-table-column>
     
      <el-table-column
        prop="referenceNo"
        label="流程参考号"
        align="center"
        width="120">
         <template #default="{ row}">

       <a :href="'/detail?instanceId='+row.id" target="_blank">   {{row.referenceNo}}</a>
        </template>
      </el-table-column>
      
      <el-table-column
        prop="name"
        label="流程名称">
      </el-table-column> 
      
      <el-table-column
        prop="initiator"
        label="发起人"
        align="center"
        width="120">
      </el-table-column>

      
      <el-table-column
        prop="departmentName"
        label="发起部门"
        align="center"
        width="120">
      </el-table-column>
     
      
  <el-table-column
        prop="startTime"
        label="接收时间"
        :formatter="formatCreatedTime"
        align="center"
        width="180">
      </el-table-column>
      
    
      <el-table-column v-if="checkPermission(['api:bpm:workItem:update','api:bpm:workItem:softdelete'])" label="操作" width="180">
        <template #default="{ $index, row }">
          <el-button v-if="checkPermission(['api:bpm:workItem:update'])" @click="onEdit($index, row)">编辑</el-button>
          <my-confirm-button
            v-if="checkPermission(['api:bpm:workItem:softdelete'])"
            type="delete"
            :loading="row._loading"
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
        @get-page="getTask"
      />
    </template>

    <!--高级查询窗口-->
    <my-search-window
      :visible.sync="searchWindowVisible"
      :fields="fields"
      :modal="false"
      @click="onSearchFilter"
    />
 

    

    <my-select-position :visible.sync="positionVisible" :form="positionForm" @click="onSelectPosition" />
    <my-select-organization :visible.sync="organizationVisible" :form="organizationForm" @click="onSelectOrganization" />
  </my-container>
</template>

<script>
import { formatTime } from '@/utils'
import { getEmployeeListPage, removeEmployee, batchRemoveEmployee, editEmployee, addEmployee, getEmployee } from '@/api/personnel/employee'
import MyContainer from '@/components/my-container'
import MyConfirmButton from '@/components/my-confirm-button'
import MySearch from '@/components/my-search'
import MySearchWindow from '@/components/my-search-window'
import MyWindow from '@/components/my-window'
import MySelectPosition from '@/components/my-select-window/position'
import MySelectOrganization from '@/components/my-select-window/organization'

import * as instance from '@/api/bpm/instance'
export default {
  name: 'Employee',
  _sync: {
    disabled: false,
    title: '待办事项管理',
    desc: '',
    cache: true
  },
  components: { MyContainer, MyConfirmButton, MySearch, MySearchWindow, MyWindow, MySelectPosition, MySelectOrganization },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback()
      }
      const reg = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号码!'))
      } else {
        callback()
      }
    }

    return {
      // 高级查询字段
      fields: [
        { value: 'name', label: '姓名', default: true },
        { value: 'nickName', label: '昵称', type: 'string' },
        { value: 'entryTime', label: '入职时间', type: 'date', operator: 'daterange',
          config: { type: 'daterange', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd' }
        },
        { value: 'createdTime', label: '创建时间', type: 'date', operator: 'daterange',
          config: { type: 'daterange', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd' }
        }
      ],
      searchWindowVisible: false,
      dynamicFilter: null,

      positionForm: null,
      positionVisible: false,
      organizationForm: null,
      organizationVisible: false,

      Task: [],
      total: 0,
      sels: [], // 列表选中列
      listLoading: false,

      pageLoading: false,
      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [
          { validator: validatePhone, trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      // 编辑界面数据
      editForm: {
        id: 0,
        name: '',
        nickName: ''
      },

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        phone: [
          { validator: validatePhone, trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      // 新增界面数据
      addForm: {
        name: '',
        nickName: ''
      },
      deleteLoading: false,
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  async mounted() {
    await this.getTask()
  },
  methods: {
    formatCreatedTime(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    // 查询
    onSearch(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getTask()
    },

    // 高级查询显示
    onsearchWindowVisible() {
      this.searchWindowVisible = true
    },
    // 高级查询
    onSearchFilter(dynamicFilter) {
      this.$refs.pager.setPage(1)
      this.dynamicFilter = dynamicFilter
      this.getTask()
      this.searchWindowVisible = false
    },

    // 获取待办事项列表
    async getTask() {
      var pager = this.$refs.pager.getPager()
      const params = {
        ...pager,
        dynamicFilter: this.dynamicFilter
      }

      this.listLoading = true
      const res = await instance.getRunning(params)
      this.listLoading = false

      if (!res?.success) {
        return
      }

      this.total = res.data.total
      const data = res.data.list
      data.forEach(d => {
        d._loading = false
      })
      this.Task = data
    },
    // 显示新增界面
    async onAdd() {
      this.addForm = {}
      this.addFormVisible = true
    },
    onCloseAddForm() {
      this.$refs.addForm.resetFields()
    },
    // 新增验证
    addFormvalidate() {
      let isValid = false
      this.$refs.addForm.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    // 新增
    async onAddSubmit() {
      this.addLoading = true
      const para = _.cloneDeep(this.addForm)

      const res = await addEmployee(para)
      this.addLoading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.addOk'),
        type: 'success'
      })
      this.$refs['addForm'].resetFields()
      this.addFormVisible = false
      this.getTask()
    },
    // 显示编辑界面
    async onEdit(index, row) {
      this.pageLoading = true
      const res = await getEmployee({ id: row.id })
      this.pageLoading = false
      if (res && res.success) {
        const data = res.data
        this.editForm = data
        this.editFormVisible = true
      }
    },
    onCloseEditForm() {
      this.$refs.editForm.resetFields()
    },
    // 编辑验证
    editFormvalidate() {
      let isValid = false
      this.$refs.editForm.validate(valid => {
        isValid = valid
      })
      return isValid
    },
    // 编辑
    async onEditSubmit() {
      this.editLoading = true
      const para = _.cloneDeep(this.editForm)

      const res = await editEmployee(para)
      this.editLoading = false

      if (!res?.success) {
        return
      }

      this.$message({
        message: this.$t('admin.updateOk'),
        type: 'success'
      })
      this.$refs['editForm'].resetFields()
      this.editFormVisible = false
      this.getTask()
    },
    // 删除
    async onDelete(index, row) {
      row._loading = true
      const para = { id: row.id }
      const res = await removeEmployee(para)
      row._loading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.deleteOk'),
        type: 'success'
      })
      this.getTask()
    },
    // 批量删除
    async onBatchDelete() {
      const para = { ids: [] }
      para.ids = this.sels.map(s => {
        return s.id
      })

      this.deleteLoading = true
      const res = await batchRemoveEmployee(para.ids)
      this.deleteLoading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.batchDeleteOk'),
        type: 'success'
      })

      this.getTask()
    },
    // 选择
    onSelsChange(sels) {
      this.sels = sels
    },
    onOpenPosition(form) {
      this.positionVisible = true
      this.positionForm = form
    },
    onSelectPosition(form, selectData) {
      if (selectData) {
        this[form].positionName = selectData.name
        this[form].positionId = selectData.id
      }

      this.positionVisible = false
    },
    onOpenOrganization(form) {
      this.organizationVisible = true
      this.organizationForm = form
    },
    onSelectOrganization(form, selectData) {
      if (selectData) {
        this[form].organizationName = selectData.name
        this[form].organizationId = selectData.id
      }

      this.organizationVisible = false
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
