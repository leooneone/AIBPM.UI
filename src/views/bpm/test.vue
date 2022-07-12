<template>
<section>
  
  

  <el-tabs v-model="activeName"  class="pane-tab">
        <el-tab-pane label='我的待办' name='1'>
          <task style="height:500px"></task>
                    <!-- 开始节点 -->
         

        </el-tab-pane>

          <el-tab-pane label='我的待办' name='1'>
          <task style="height:500px"></task>
                    <!-- 开始节点 -->
         

        </el-tab-pane>
  </el-tabs>
    </section>
</template>
<script> 
import Task from './workItem/task'
export default  ({

  components:{Task},
    data(){


        return {
          activeName:'1',

          from:0,
          to:100,
          result:0}
    },
    methods:{

      
    }
})
</script>
