<template>
     <el-table
      border
      data={this.data}
      style="width: 100%">
     <el-table-column
      label="序号"
      align="center"
      type="index"
      width="50">
    </el-table-column>
      <el-table-column
        prop="title"
        label="参考号"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="initial"
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
        align="center"
        width="180">
      </el-table-column>
        
      <el-table-column
        prop="instanceName"
        label="流程名称">
      </el-table-column>
    </el-table> 
</template>
<script>
export default {
   props:['data']
}
</script>