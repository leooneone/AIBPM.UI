<template>
    <section class="bpm-card-main">
      <br/>
        <span>请选择工单流程</span>
    <el-divider></el-divider>
<el-row gutter="20" padd>
         <el-col
        v-for="(item, index) in tpls"
        style="padding-top:20px"
        :key="index"
        :xs="12"
        :sm="6"
        :md="3"
        :lg="3"
        :xl="3"
      >
        <router-link :to="`/workitem?workflowId=`+item.id" target="_blank">
          <el-card class="icon-panel" shadow="never">
              <svg-icon  icon-class="component"  class-name="my-icon"  :style="{color:iconList[index].color}"   />
            <p>{{ item.name }}</p>
          </el-card>
        </router-link>
      </el-col>

      </el-row>
    </section>
</template>
<script>

import * as tpl from '@/api/bpm/template'
export default {
    data() {
        return {
        tpls:[],
                //卡片图标
        iconList: [
          {
            icon: 'video',
            title: '视频播放器',
            link: '/vab/player',
            color: '#ffc069',
          },
          {
            icon: 'table',
            title: '表格',
            link: '/vab/table/comprehensiveTable',
            color: '#5cdbd3',
          },
          {
            icon: 'laptop-code',
            title: '源码',
            link: 'https://github.com/chuzhixin/vue-admin-better',
            color: '#b37feb',
          },
          {
            icon: 'book',
            title: '书籍',
            link: '',
            color: '#69c0ff',
          },
          {
            icon: 'bullhorn',
            title: '公告',
            link: '',
            color: '#ff85c0',
          },
          {
            icon: 'gift',
            title: '礼物',
            link: '',
            color: '#ffd666',
          },
          {
            icon: 'balance-scale-left',
            title: '公平的世界',
            link: '',
            color: '#ff9c6e',
          },
          {
            icon: 'coffee',
            title: '休息一下',
            link: '',
            color: '#95de64',
          },
        ],

        }
    },
    mounted(){
        this.getList()
    },

    methods:{
        getList(){

            tpl.list().then(res=>{
                this.tpls=res.data
                console.log('111111111111111111')
            })
        }
    }
}
</script>
<style lang="scss" scoped>

 .bpm-card-main {
    width: 88%;
    margin: auto;
}
.my-icon{ 
  
    color:rgb(92, 219, 211);
    font-size: 140px!important;
}

.icon-panel {
    height: 120px;
    text-align: center;
    cursor: pointer;

     .svg-icon{
        width: 38px!important;
    height: 38px!important;
    font-size: 140px!important;
    }
} 
</style>