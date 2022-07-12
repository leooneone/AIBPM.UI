<template>
  <div class="design-page">
    <header class="page__header">
      <div class="page-actions">
        <div style="border-right:1px solid #c5c5c5;cursor: pointer;" @click="exit">
          <i class="el-icon-arrow-left"></i>
        </div>
        <div>{{ title }}</div>
      </div>
      <div class="step-tab">
        <div
          v-for="(item, index) in steps"
          :key="index"
          class="step"
          :class="[activeStep==item.key?'active':'']"
          @click="changeSteps(item)"
        >
          <span class="step-index">{{ index+1 }}</span>
          {{item.label}}
        </div>
        <div class="ghost-step step" :style="{transform: translateX}"></div>
      </div>
      <el-button size="small" class="publish-btn" @click="publish">发布</el-button>
    </header>
    <section class="page__content" v-if="mockData">
      <BasicSetting
        ref="basicSetting" 
        :conf="mockData.basicSetting"
        v-show="activeStep === 'basicSetting'" 
        tabName="basicSetting"
        @initiatorChange="onInitiatorChange" /> 

      <DynamicForm
        ref="formDesign"
        :conf="mockData.formData"
        v-show="activeStep === 'formDesign'" 
        tabName="formDesign" />

      <Process  
        ref="processDesign"
        :conf="mockData.processData"
        tabName="processDesign" 
        v-show="activeStep === 'processDesign'" 
        @startNodeChange="onStartChange"/>

      <AdvancedSetting
        ref="advancedSetting"
        :conf="mockData.advancedSetting"
        v-show="activeStep === 'advancedSetting'" />

    </section>
    <div class="github">
      <el-tooltip effect="dark" content="前往Github" placement="top">
        <a href="https://github.com/SNFocus/approvalFlow" target="_blank" style="display: block;" rel="noopener noreferrer">
          <svg t="1590391861889" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2582" width="40" height="40"><path d="M950.930286 512q0 143.433143-83.748571 257.974857t-216.283429 158.573714q-15.433143 2.852571-22.601143-4.022857t-7.168-17.115429l0-120.539429q0-55.442286-29.696-81.115429 32.548571-3.437714 58.587429-10.313143t53.686857-22.308571 46.299429-38.034286 30.281143-59.977143 11.702857-86.016q0-69.12-45.129143-117.686857 21.138286-52.004571-4.534857-116.589714-16.018286-5.12-46.299429 6.290286t-52.589714 25.161143l-21.723429 13.677714q-53.174857-14.848-109.714286-14.848t-109.714286 14.848q-9.142857-6.290286-24.283429-15.433143t-47.689143-22.016-49.152-7.68q-25.161143 64.585143-4.022857 116.589714-45.129143 48.566857-45.129143 117.686857 0 48.566857 11.702857 85.723429t29.988571 59.977143 46.006857 38.253714 53.686857 22.308571 58.587429 10.313143q-22.820571 20.553143-28.013714 58.88-11.995429 5.705143-25.746286 8.557714t-32.548571 2.852571-37.449143-12.288-31.744-35.693714q-10.825143-18.285714-27.721143-29.696t-28.306286-13.677714l-11.410286-1.682286q-11.995429 0-16.603429 2.56t-2.852571 6.582857 5.12 7.972571 7.460571 6.875429l4.022857 2.852571q12.580571 5.705143 24.868571 21.723429t17.993143 29.110857l5.705143 13.165714q7.460571 21.723429 25.161143 35.108571t38.253714 17.115429 39.716571 4.022857 31.744-1.974857l13.165714-2.267429q0 21.723429 0.292571 50.834286t0.292571 30.866286q0 10.313143-7.460571 17.115429t-22.820571 4.022857q-132.534857-44.032-216.283429-158.573714t-83.748571-257.974857q0-119.442286 58.88-220.306286t159.744-159.744 220.306286-58.88 220.306286 58.88 159.744 159.744 58.88 220.306286z" fill="#2c2c2c" p-id="2583"></path></svg>
        </a>
      </el-tooltip>
    </div>
  </div>
</template>

<script>

// @ is an alias to /src
import Process from "@/components/bpm/Process";
import DynamicForm from "@/components/bpm/DynamicForm";
import BasicSetting from '@/components/bpm/BasicSetting'
import AdvancedSetting from '@/components/bpm/AdvancedSetting'
import { GET_MOCK_CONF } from '@/api/bpm/mock'
import { add as addTpl } from '@/api/bpm/template'

import { mapGetters } from 'vuex'
const beforeUnload = function (e) {
  var confirmationMessage = '离开网站可能会丢失您编辑得内容';
  (e || window.event).returnValue = confirmationMessage;     // Gecko and Trident
  return confirmationMessage;                                // Gecko and WebKit
}

export default {
  name: "Home",
  props: {
    title: {
      type: String,
      default: '模板名称'
    }
  },
  data() {
    return {
      mockData: null, // 可选择诸如 $route.param，Ajax获取数据等方式自行注入
      activeStep: "basicSetting", // 激活的步骤面板
      steps: [
        { label: "基础设置", key: "basicSetting" },
        { label: "表单设计", key: "formDesign" },
        { label: "流程设计", key: "processDesign" },
        { label: "高级设置", key: "advancedSetting" }
      ],
      endActivity:{name:'结束',title:'End',code:'end',type:'end'},
      workflow:{lines:{}, activities:[this.endActivity],chartData:'',startActitivyId:''},
      
     
      
    };
  },
  beforeRouteEnter(to, from, next){
    window.addEventListener('beforeunload', beforeUnload)
    next()
  },
  beforeRouteLeave(to, from, next){
    window.removeEventListener('beforeunload', beforeUnload)
    next()
  },
  computed:{

    ...mapGetters([
      'bpm',
    ]), 
    translateX () {
      return `translateX(${this.steps.findIndex(t => t.key === this.activeStep) * 100}%)`
    }
  },
  mounted() {
    GET_MOCK_CONF().then(data => this.mockData = data);
  },
  methods: {

    initFormOperates(target){
      console.log('initFormOperates')
      console.log(target)
      const formOperates = target.properties && target.properties.formOperates || []
      // 自定义组件不加入权限控制
      const res = []
      const defaultType = 1// this.isApproverNode() ? 1 : 2 // 操作权限 0 隐藏 1 只读 2 可编辑
      const getPermissionById = id => {
        const permission = formOperates.find(t => t.formId === id)
        return permission !== undefined ? permission.formOperate : defaultType
      }
      const format = (list, parentName = '') => list.map(t => {
        const data = {
            formId: t.formId, 
            required: t.required,
            label: parentName ? [parentName, t.label].join('.') : t.label, 
            formOperate: getPermissionById(t.formId)
        }
        res.push(data)
        Array.isArray(t.children) && format(t.children, t.label)
      })
      const formItems = this.bpm.formItemList.filter(t => t.cmpType !== 'custom')
      format(formItems)
console.log('res')
      console.log(res)
      return res
    },
    changeSteps(item) {
      this.activeStep = item.key;
    },
    addLine(startId,end)
    {
      if(this.workflow.lines[startId]===undefined)
      {
        this.workflow.lines[startId]=[]
      }
      this.workflow.lines[startId].push(end)
    },
     parseNode(node,nextId)
     {
       if(node.type==='start')
         this.workflow.startActitivyId=node.nextId
       this.workflow.activities.push({prevId:node.prevId, name:node.content,title:node.properties.title,code:node.nodeId,type:node.type,properties:node.properties})
        if(!node.prevId)
        {
          console.log('开始节点:'+node.content)
        }
          if ( Array.isArray( node.conditionNodes ) && node.conditionNodes.length )  
           {
              if(node.childNode){

                  this.  parseNode(node.childNode,nextId)
                  nextId=node.childNode.nodeId
              }
               
             for(var k=0;k<node.conditionNodes.length;k++)
             {
                this.addLine(node.nodeId , node.conditionNodes[k].nodeId  )
             
               this.  parseNode(node.conditionNodes[k],nextId)
             }
              
           }else //如果不存在条件则遍历子节点
           {
            
             if(node.childNode)//如果存在子节点 作为nextId的设置
            { //console.log('没有条件节点,有子节点')
              
              
                   this.addLine(node.nodeId,  node.childNode.nodeId  )
            
             console.log(node.prevId+'=>'+node.content+"=>"+node.childNode.content)
              this.parseNode(node.childNode,nextId)
            }else 
            {//如果没有子节点 需要看看递归函数是否传送了结束节点id，如果有那么作为该节点的nextId
                 //console.log(node.content+":"+'没有子节点')
             
                if(nextId&&nextId!==null)
                {    
                     
                     this.addLine(node.nodeId ,  nextId  )
           
                    console.log(node.prevId+'=>'+node.content+"=>"+nextId)
                    node.nextId=nextId
                }else 
                {
                this.addLine(node.nodeId ,  this.endActivity.code  )
                  console.log(node.prevId+'=>'+node.content+"=>结束")
                }
            }
              
             
           }
       
       
     },
    async publish() {
      const getCmpData = name => this.$refs[name].getData()
      // basicSetting  formDesign processDesign 返回的是Promise 因为要做校验
      // advancedSetting返回的就是值
      const p1 = getCmpData('basicSetting') 
      const p2 = getCmpData('formDesign')
      const p3 = getCmpData('processDesign')
      Promise.all([p1, p2, p3])
      .then(res => {
        this.workflow.lines={}
        this.workflow.activities=[this.endActivity]
        this.chartData=''
        var process=res[2].formData
        this.parseNode(process)

        this.workflow.activities.forEach(act=>{
          if(act.properties!==undefined&&act.properties!==null)
              act.properties.formOperates=    this. initFormOperates(act)
        })
        // console.log('this.lines')
        // console.log(this.workflow.lines)
        // console.log(this.workflow.activities)
        // console.log('formData')
        // console.log(res[1].formData)
         console.log('process')
         console.log(process)
         
        this.workflow.chartData = JSON.stringify(process) 
        this.workflow.linesContext = JSON.stringify(this.workflow.lines) 
        this.workflow.activitiesContext = JSON.stringify(this.workflow.activities) 
        const param = {
          basicSetting: res[0].formData,
          processData:  this.workflow,// res[2].formData),x 
          formData:JSON.stringify( res[1].formData),
          advancedSetting: getCmpData('advancedSetting')
        }
        console.log(this.workflow)
        this.sendToServer(param)
      })
      .catch(err => {
        err.target && (this.activeStep = err.target)
        err.msg && this.$message.warning(err.msg)
      })
    },
  async  sendToServer(param){
      this.$notify({
        title: '数据已整合完成',
        message: '请在控制台中查看数据输出',
        position: 'bottom-right'
      });
    console.log('sendToServer')
      await addTpl(param).then(res=>{

        console.log(res)
      })
      console.log('配置数据', param)
    },
    exit() {
      this.$confirm('离开此页面您得修改将会丢失, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '模拟返回!'
          });
        }).catch(() => { });
    },
    /**
     * 同步基础设置发起人和流程节点发起人
     */
    onInitiatorChange (val, labels) {
      const processCmp = this.$refs.processDesign
      const startNode = processCmp.data
      startNode.properties.initiator = val['dep&user']
      startNode.content =  labels  || '所有人'
      processCmp.forceUpdate()
    },
    /**
     * 监听 流程节点发起人改变 并同步到基础设置 发起人数据
     */
    onStartChange(node){
      const basicSetting = this.$refs.basicSetting
      basicSetting.formData.initiator = { 'dep&user': node.properties.initiator }
    }
  },
  components: {
    Process,
    DynamicForm,
    BasicSetting,
    AdvancedSetting
  }
};
</script>
<style lang="stylus" scoped>
$header-height = 54px;
.design-page {
  width: 100vw;
  height: 100vh;
  padding-top: $header-height;
  box-sizing: border-box;

  .page__header {
    
    width: 100%;
    height: $header-height;
    display: flex;
    align-items:center;
    justify-content:center;
    justify-content: space-between;
    box-sizing: border-box;
    color:white;
    background: #3296fa;
    font-size: 14px;
    position: fixed;
    top: 0;

    .page-actions {
      height: 100%;
      text-align: center;
      line-height: $header-height;

      > div {
        height: 100%;
        padding-left: 20px;
        padding-right: 20px;
        display: inline-block;
      }

      i {
        font-size: 22px;
        vertical-align: middle;
      }
    }

    .step-tab {
      display: flex;
      justify-content: center;
      height: 100%;
      position: relative;

      >.step {
        width: 140px;
        line-height: $header-height;
        padding-left: 30px;
        padding-right: 30px;
        cursor: pointer;
        position: relative;

        &.ghost-step{
          position: absolute;
          height: $header-height;
          left: 0;
          z-index: -1;
          background: #4483f2;
          transition: transform .5s;

          &::after {
            content: '';
            border-width: 6px 6px 6px;
            border-style: solid;
            border-color: transparent transparent white;
            position: absolute;
            bottom: 0;
            left: 50%;
            margin-left: -6px;
          }
        }

        &.active >.step-index  {
          background: white;
          color: #4483f2;
        }

        >.step-index {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 1px solid #fff;
          border-radius: 8px;
          line-height: 18px;
          text-align: center;
          box-sizing: border-box;
        }
      }
    }
  }

  .page__content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    background #f5f5f7
  }
}

.publish-btn {
  margin-right: 20px;
  color: #3296fa;
  padding: 7px 20px;
  border-radius: 4px;
  font-size: 14px;
}

.github{
  position fixed
  bottom 10px
  left 20px
}
</style>
