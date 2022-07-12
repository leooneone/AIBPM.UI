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
  >
    <my-container v-loading="pageLoading" style="height: 100%;">
      <!--查询-->
      <el-container class="container" style="height: 100%;">
        <el-aside v-resizable="resizeOptions" width="30%" style="border-right: 1px solid #e6e6e6;position: relative;overflow:unset;">
          <device v-if="isDevice"  @current-change="onCurrentChange"  />
          <model v-else  @current-change="onCurrentChange"  />
        </el-aside>
        <el-main style="height:100%;">
          <attribute :parent-row="parentRow" :multiple="multiple" @change="onSelChange" @click="onSure" />
        </el-main>
      </el-container>
      <!--列表-->

    </my-container>
    <template #footer>

      <el-button @click.native="onCancel">取消</el-button>
      <el-button type="primary" @click="onSure">确定</el-button>
    </template>
    <el-tag v-for="item in sels" closable>{{ item.deviceName }}. {{ item.name }}</el-tag>

  </my-window>
</template>

<script>
import MyContainer from '@/components/my-container'
import MyWindow from '@/components/my-window'
import Device from './device'
import Model from './model'
import Attribute from './attribute'
import resizable from '@/directive/resizable'
export default {
  name: 'MySelectAttribute',
  components: { MyContainer, MyWindow, Device,Model,Attribute },
  directives: { resizable },
  props: {
    
    isDevice: { type: Boolean },
    title: {
      type: String,
      default: '选择属性'
    },
    visible: {
      type: Boolean,
      default: true
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
      filter: {
        name: ''
      }, parentRow: {},
      data: [],
      total: 0,
      listLoading: false,
      pageLoading: false,
      currentRow: null,
      sels: []
    }
  }, computed: {
    resizeOptions() {
      return {
        handles: 'e',
        onlySize: true,
        minWidth: 280,
        maxWidth: 700
      }
    }
  },
  methods: {

    onCurrentChange(row, oldCurrentRow) {
      this.currentRow = row
      this.parentRow = row
    },
    onSelChange(sels) {
      this.sels = sels
      // console.log(sels)
    },
    // 取消
    onCancel() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    // 确定
    onSure(form,sel) {
      this.currentRow.child=sel
      this.$emit('click', this.form, this.multiple ? this.sels : this.currentRow)

      this.$emit('update:visible', false)
    }
  }
}
</script>
