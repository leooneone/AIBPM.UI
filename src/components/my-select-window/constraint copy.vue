<template>
  <my-window
    :title="title"
    :modal="modal"
    :wrapper-closable="true"
    :modal-append-to-body="modalAppendToBody"
    :visible.sync="visible"
    destroy-on-close
    embed
    drawer
    size="100%"
    drawer-body-style="padding:0px;height: calc(100% - 61px);"
    :before-close="onCancel"
    @opened="onSearch"
  >
    <my-container v-loading="pageLoading" style="height: 100%;">
      <!--查询-->
      <template #header>
        <el-form class="ad-form-query" :inline="true" :attribute="filter" @submit.native.prevent>
         <!-- <el-form-item>
            <el-input
              v-model="filter.name"
              placeholder="属性名称"
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
          </el-form-item>-->
          <el-form-item >
            <el-button type="primary" @click="onAdd">新增</el-button>
          </el-form-item>
        
        </el-form>
      </template>

      <!--列表-->
      <el-table
        v-loading="listLoading"
        :data="constraints"
        highlight-current-row
        height="'100%'"
        style="width: 100%;height:100%;"
        @selection-change="onSelsChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="name" label="名称" width />
        <el-table-column prop="condition" label="条件" width />
        <el-table-column prop="description" label="提示" width />
        <el-table-column prop="level" label="级别" width />
        <el-table-column label="操作" width="180">
          <template #default="{ $index, row }">
            <el-button @click="onEdit($index, row)">编辑</el-button>
            <my-confirm-button
              type="delete"
              :loading="row._loading"
              :validate-data="row"
              @click="onDelete($index, row)"
            />
          </template>
        </el-table-column>
      </el-table>
 
     

      <!--新增窗口-->
      <my-window
        v-if="checkPermission(['api:mcs:rule:add'])"
        title="新增约束"
        embed
        drawer
        :visible.sync="addFormVisible"
        @close="onCloseAddForm"
      >
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="addFormConstraints"
          label-width="80px"
          :inline="false"
        >
          <el-row>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="名称" prop="name">
                {{ addForm.name }}
                <el-input v-model="addForm.name" autocomplete="off" />
              </el-form-item>
            </el-col>
            <el-col :xs="24">
              <el-form-item label="级别" prop="level">
                <el-input-number v-model="addForm.level" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>

            <el-col :xs="24">
              <el-form-item label="条件" prop="condition">
                <el-input v-model="addForm.condition" autocomplete="off" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>

            <el-col :xs="24">
              <el-form-item label="提示" prop="description">
                <el-input v-model="addForm.condition" autocomplete="off" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <my-confirm-button type="submit" :validate="addFormvalidate" :loading="addLoading" @click="onAddSubmit" />
        </template>
      </my-window>

      <!--编辑窗口-->
      <my-window
        v-if="checkPermission(['api:mcs:rule:update'])"
        title="编辑约束"
        embed
        drawer
        :visible.sync="editFormVisible"
        @close="onCloseEditForm"
      >
      
        <el-form
          ref="editForm"
          :model="editForm"
          :rules="editFormConstraints"
          label-width="80px"
          :inline="false"
        >
          <el-row>
            <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="6">
              <el-form-item label="名称" prop="name">
                <el-input v-model="editForm.name" autocomplete="off" />
              </el-form-item>
            </el-col>

            <el-col :xs="24">
              <el-form-item label="级别" prop="level">
                <el-input-number v-model="editForm.level" autocomplete="off" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :xs="24">
              <el-form-item label="条件" prop="condition">
                <el-input v-model="editForm.condition" autocomplete="off" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
           <el-row>

            <el-col :xs="24">
              <el-form-item label="提示" prop="description">
                <el-input v-model="addForm.condition" autocomplete="off" type="textarea" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer>
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <my-confirm-button type="submit" :validate="editFormvalidate" :loading="editLoading" @click="onEditSubmit" />
        </template>
      </my-window>

    
    </my-container>
    <template #footer>
      <el-button @click.native="onCancel">取消</el-button>
      <el-button type="primary" @click="onSure">确定</el-button>
    </template>
  </my-window>
</template>

<script>
import { formatTime } from '@/utils'
import { getAttributeListPage } from '@/api/mcs/attribute'
import MyContainer from '@/components/my-container'
import MyWindow from '@/components/my-window'
import MyConditionWindow from '@/components/my-condition-window'

import MyConfirmButton from '@/components/my-confirm-button'
export default {
  name: 'MySelectModel',
  components: { MyContainer, MyWindow, MyConfirmButton, MyConditionWindow },
  props: {
    value: String,
    title: {
      type: String,
      default: '约束条件管理'
    },
    visible: {
      type: Boolean,
      default: false
    },
    form: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: false
    },
    modalAppendToBody: {
      type: Boolean,
      default: false
    }

  },
  data() {
    return {
      fields: [
        { value: 'name', label: '名称', default: true },
        { value: '属性', label: 'attribute', type: 'string' },
        { value: 'entryTime', label: '入职时间', type: 'date', operator: 'daterange',
          config: { type: 'daterange', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd' }
        },
        { value: 'createdTime', label: '创建时间', type: 'date', operator: 'daterange',
          config: { type: 'daterange', format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd' }
        }
      ],
      constraints: [],
      searchWindowVisible: false,
      conditionForm: null,
      conditionWindowVisible: false,
      dynamicFilter: null,

      attributeForm: null,
      attributeVisible: false,
      deviceForm: null,
      deviceVisible: false,
      total: 0,
      sels: [], // 列表选中列
      listLoading: false,

      pageLoading: false,
      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormConstraints: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],

        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ]
      },
      // 编辑界面数据
      editForm: {
        id: 0,
        name: ''
      },

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormConstraints: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      // 新增界面数据
      addForm: {
        name: ''
      },
      deleteLoading: false,
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      filter: {
        name: ''
      }, 
      currentRow: null, 
    }
  },
  computed: {

  },
  methods: {
    formatCreatedTime(row, column, time) {
      return formatTime(time, 'YYYY-MM-DD HH:mm')
    },
    // 查询
    onSearch(dynamicFilter) {
      
      this.dynamicFilter = dynamicFilter
      this.getConstraints()
    },
 

    // 获取约束列表
     getConstraints() {
      if (this.constraints != null&&this.constraints.length==0) 
      { 
        console.log(this.value)
        if(this.value!=null)
        this.constraints = JSON.parse(this.value) 
      }
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
      this.constraints.push(para)
      this.addLoading = false
 
      this.$refs['addForm'].resetFields()
      this.addFormVisible = false
      this.getConstraints()
    },
    // 显示编辑界面
      onEdit(index, row) {
      this.pageLoading = true 
      this.pageLoading = false
      
        const data = row
        this.editForm = data
        this.editForm.index=index
        this.editFormVisible = true
       
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
     const pos = this.editForm.index
      this.constraints.splice(pos,1,para )
      this.editLoading = false
 
      this.$refs['editForm'].resetFields()
      this.editFormVisible = false
      this.getConstraints()
    },
    // 删除
    async onDelete(index, row) {
      row._loading = true 
      const pos = index
      if (index >= 0) {
        this.constraints.splice(pos,1)
      }  
      row._loading = false
 
      this.getConstraints()
    },
    // 批量删除
    async onBatchDelete() {
      const para = { ids: [] }
      para.ids = this.sels.map(s => {
        return s.id
      })

      this.deleteLoading = true
      const res = await batchRemoveConstraint(para.ids)
      this.deleteLoading = false

      if (!res?.success) {
        return
      }
      this.$message({
        message: this.$t('admin.batchDeleteOk'),
        type: 'success'
      })

      this.getConstraints()
    },
    // 选择
    onSelsChange(sels) {
      this.sels = sels
    },
    onOpenAttribute(form) {
      this.attributeVisible = true
      this.attributeForm = form
    },
    onSelectAttribute(form, selectData) {
      if (selectData) {
        this[form].attributeName = selectData.name
        this[form].attributeId = selectData.id
      }
      this.attributeVisible = false
    },
    onOpenConstraint(form) {
      this.deviceVisible = true
      this.deviceForm = form
    },
    onSelectConstraint(form, selectData) {
      if (selectData) {
        this[form].deviceName = selectData.name
        this[form].deviceId = selectData.id
      }

      this.deviceVisible = false
    },
    // 取消
    onCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    // 确定
    onSure() {
      
      this.$emit('input', JSON.stringify(this.constraints))
      //this.$emit('click', this.form, JSON.stringify(this.constraints))
    },
    onCurrentChange(row) {
      this.currentRow = row
    },
    onSelectionChange(sels) {
      this.sels = sels
    }, 
  
  }
}
</script>
