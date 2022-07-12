<script>
import render from '@/utils/bpm/render.js'
import * as workItem from '../../api/bpm/workItem'
import * as instance from '../../api/bpm/instance'
import { trigger } from '@/components/bpm/DynamicForm/components/generator/config.js'
import approveBox from './approve.vue'
import instanceHeader from './components/instance/header.vue'
import MyAffix from './components/myAffix.vue'
import toolbar from './components/toolbar.vue'
/**
 * 校验组织机构组件是否为空
 */
const setFcOrgSelectRule = ( conf, ctx ) => {
 
  return { 
    validator: (rule, value, callback) => {
      
      var val = ctx.formModel[rule.field]
      console.log(val)
      var keys=Object.keys(val || {})
      for(var k=0;k<keys.length;k++)
      {
          var key=keys[k]
          if(val[key].length>0)
          {
            callback()
            return
          }

      }
     
      var count = 0
      conf.tabList.forEach(key => {
        val && Array.isArray(val[key]) && (count += val[key].length)
      })
      callback(count ? undefined : new Error(`${conf.title}不能为空`))
    }, 
    trigger: trigger[conf.tag],
    type:undefined,// 'object',
    required: true
  }
}
/**
 * 收集表单必填项并组装成ElementUI表单校验得rules选项
 * 表格除外 表格自带校验
 */
function buildRules ( conf, ctx ) {
  if ( conf.vModel === undefined ||  !trigger[conf.tag]) return
  const rules = []
  if ( conf.required ) {
    const type = Array.isArray( conf.defaultValue ) ? 'array' : undefined
    let message = Array.isArray( conf.defaultValue ) ? `请至少选择一个` : conf.placeholder
    if ( message === undefined ) message = `${conf.label}不能为空`
    conf.tag === 'fc-org-select'
      ? rules.push( setFcOrgSelectRule( conf, ctx ) )
      : rules.push( { required: true, type, message, trigger: trigger[conf.tag] } )
    if( conf.tag === 'fc-org-select')
    {
      console.log('rules')
      console.log(rules)

    }
  }
  // 自定义正则匹配
  if ( conf.regList && Array.isArray( conf.regList ) ) {
    conf.regList.forEach( item => {
      if ( item.pattern ) {
        rules.push( { pattern: eval( item.pattern ), message: item.message, trigger: trigger[conf.tag] } )
      }
    } )
  }
  ctx.ruleList[conf.vModel] = rules
}


var setData = (ctx, val, prop, init = false) => {
  if (!prop) return
  ctx.$set(ctx.formModel, prop, val)
}

var _isMounted = false // 收集默认值 渲染完成之后防止重复收集默认值

const buildData = (ctx, value, prop) => setData(ctx, value, prop, true)

var permissions= {}// {field20:true,field2:true,field3:true,field4:true,field5:false,}
 
//布局：行列
const layouts = {
  //列生成 表格内部列
  colFormItem: function (conf,  h, ctx, isList = false,) {
    buildRules(conf, ctx)
    !_isMounted && buildData(ctx, conf.defaultValue, conf.vModel)
    let labelWidth = ''
    if ( conf.labelWidth ) labelWidth = `${conf.labelWidth}px`
    if ( isList ) labelWidth = "0px"
    const required = ( !trigger[conf.tag] && conf.required ) || conf.tag === 'fc-org-select' 
    const handleInput = val => {
      setData(ctx, val, conf.vModel)
      if (conf.tag === 'fc-org-select') {
        /**
         * 组织机构组件数据复杂 
         * async-validator不一定能准确捕获到数据变化 
         * 所以在这里手动校验一次
         */
        ctx.$refs[ctx.confGlobal.formRef].validateField(conf.vModel,()=>{ })
      }
    }
    let item =  <el-col span={conf.span}>
                  <el-form-item 
                  label-width={labelWidth} 
                  label={isList ? '' : conf.label} 
                  prop={conf.vModel}>
                    <render
                    formData={ctx.formModel}
                    conf={conf} 
                   
                    value={ctx.formModel[conf.vModel]} 
                    ref={conf.rowType === 'table' ? conf.vModel : undefined} 
                    onInput={handleInput} 
                    />
                  </el-form-item>
                </el-col>

    if (isList) {
      var tableTitle = <el-col span={24} style="font-size: 14px;padding:6px 0px;margin-bottom: 4px;border-bottom: 1px solid #e5e5e5;">{conf.label}</el-col>
      return [tableTitle, item]
    }
    return item
  },
  ///行生成
  rowFormItem: function (conf, h, ctx) {
    //表格特殊处理
     if ( conf.rowType === 'table' ) {
       ctx.tableRefs[conf.vModel] = conf
       const param = {...conf, config: conf, formSize: ctx.confGlobal.size, labelWidth: `${conf.labelWidth || ctx.confGlobal.labelWidth}px`}
       return this.colFormItem( param, h, ctx, conf.type === 'list' )
    }
    ///创建规则
    buildRules(conf, ctx)
    ///创建传值属性参数
    const props = {
      type: conf.type === 'default' ? undefined : conf.type,
      justify: conf.type === 'default' ? undefined : conf.justify,
      align: conf.type === 'default' ? undefined : conf.align,
      gutter: typeof conf.gutter === 'number' ? conf.gutter : undefined,
    }
    //列布局
    let row = <el-col span={conf.span || 24}>
                <el-row {...{ props: props }}>
                  { Array.isArray(conf.children) && conf.children.map( ( el ) => layouts[el.layout]( el, h, ctx ) ) }
                </el-row>
              </el-col>
    let divider
    if (conf.showDivider) {
      let explain
      //定制组件
      if (conf.cmpType === 'custom' && conf.explain) {
        explain = <el-tooltip effect="dark" content="组件说明" placement="top">
                    <i class="el-icon-info"
                      onClick={ctx.showExplain.bind(this, conf.explain, conf.label)}
                      style="margin-right: 8px; color: #E6A23C;cursor: pointer;">
                    </i>
                  </el-tooltip>
      }
      divider = <el-col span={24}>
                  <el-divider content-position="left" >{explain} {conf.label}</el-divider>
                </el-col>
      return [divider, row]
    } 
    return row
  },
}


export default {
  data () {
    return { 
      //version:this.$route.query.version, 
       workflowId:this.$route.query.workflowId,

      workItemId:this.$route.query.workItemId,
      activityCode:0,
      activity:null,
      items:[],
      instance:{},
      tableRefs: {},
      drawerTitle: '',
      drawerText: '',
      drawerVisible: false,
      containerWidth: 100,
      confGlobal: this.$route.params.formData || null,
      formModel: {},
      ruleList: {},
      result:{show:false,icon:'success',title:'',detail:''},

      approve:{ comment:'' ,
       result:-1,}
      ///审批结果
      
    }
  },
  mounted(){
     
    if (!this.confGlobal) {
      
      if(this.workItemId===undefined &&this.workflowId!==undefined)
      {  
        this.getConfigByTpl()
        }
      else {
      
        this.getConfigByAjax();}
    } else {
      this.initDefaultData(this.confGlobal);
    }
    _isMounted = true;
  },
  methods: {
    showResult(type,title,detail){

      this.result.title=title
      this.result.detail=detail
      this.result.icon=type
      this.result.show=true
    },
    hideResult(){this.result.show=false},

    agree(){
      this.submitForm(true)
    },
    reject(){
      this.submitForm(false)
    },
    submitForm () {//提交表单
      const isTableValid = this.checkTableData()
      this.$refs[this.confGlobal.formRef].validate(valid => {
        if(!valid) return
        if (!isTableValid) return
        this.$notify({
          title: '表单数据',
          message: '请在控制台中查看数据输出',
          position: 'bottom-right'
        });
        workItem.submit({
          templateId:this.workflowId,activityCode:this.activityCode,
          workItemId:this.workItemId,form:this.formModel,comment:this.approve.comment,approvalResult:this.approve.result}).then(res=>{
            
            if(res.code===1)
              this.showResult('success','提交成功','您的工作项已完成！');
              else 
              this.showResult('error','提交失败',res.msg);
        });
        console.log('表单数据', this.formModel)
        // TODO 提交表单
      })
    },
    //重置表单
    resetForm() {
      this.$refs[this.confGlobal.formRef].resetFields()
      this.resetTableData()
    },
    //重置表格数据
    resetTableData(){
      Object.keys(this.tableRefs).forEach(vModel => {
        // 由于render.js返回的动态组件 所以动态组件相当于是render的子组件
        const res = this.$refs[vModel]['$children'][0].reset()
      })
    },
    ///检查表格数据
    checkTableData () {
      let valid = true
      Object.keys(this.tableRefs).forEach(vModel => {
        const res = this.$refs[vModel].$children[0].submit()  // 返回false或表单数据
        res ? (this.formModel[vModel] = res) : (valid = false)
      })
      return valid
    },
    //显示说明
    showExplain (explainText, title) {
      if(!explainText) return
      this.drawerTitle = title
      this.drawerText = explainText
      this.drawerVisible = true
    },
    //创建抽屉
    buildDrawer (h) {
      var content = <pre style="padding-left: 1rem;">{this.drawerText}</pre>
      return h('el-drawer', {
        props: {
          title: this.drawerTitle + '说明',
          visible: this.drawerVisible,
        },
        on: {
          'update:visible': val => this.drawerVisible = val
        }
      },
      [content])
    },
    //创建表单
    buildForm (h) {
      let labelPosition = this.confGlobal.labelPosition || 'left'
      const content = this.confGlobal.fields.map(c => layouts[c.layout](c, h, this))
      const formObject = {
        props: {
          ///傳閱和detail 為只讀
          disabled: this.activity.type==='Copy', //type===Copy true
          model: this.formModel,
          rules: this.ruleList,
          size: this.confGlobal.size,
          labelWidth: this.confGlobal.labelWidth + 'px',
          labelPosition: this.confGlobal.labelPosition || undefined
        },
        ref: this.confGlobal.formRef
      }
      const btns = <el-col span={24}>
                    <el-form-item  >
                      <span v-show={this.activity&&this.activity.type==='Approver'} > 
                      <el-input type="textarea" v-model={this.approve.comment}  />
                       <el-radio v-model={this.approve.result} label={true}>同意</el-radio>
                        <el-radio v-model={this.approve.result} label={false}>拒绝</el-radio>
                      </span>
                      </el-form-item>
                      <el-form-item  style="text-align:right;"  >
                      
                      <el-button type="primary" onClick={this.submitForm}>提交</el-button>
                      <el-button onClick= {this.resetForm}>重置</el-button>
                    </el-form-item>
                  </el-col>
      // 因为使用jsx时  el-form 的 model 一直无法正确填充，故采用createElement直接渲染
      return h('el-form', formObject, [content/*, btns*/]) 
    },
    ///为表单创建属性
    initDefaultData(config) {
      config.fields.forEach(field => {
        this.$set(this.formModel, field.vModel, field.defaultValue);
      });
    },
    ///設置權限 後台實現
    setPermission(properties,fields){


       var permissions={}

        for(var k=0;k< properties.formOperates.length;k++)
        {
          var formOperate=properties.formOperates[k]
          permissions[formOperate.formId]=formOperate.formOperate
        } 
        ///根據權限設置表單控件
        for(var k=0;k<fields.length;k++)
        {
          var field=fields[k]
          //1只讀 2 可編輯 3 隱藏
          if(permissions[field.formId]===1)
            field.disabled=true
          else if(permissions[field.formId]===3) 
            field.show=false
          else if(permissions[field.formId]===2) 
          {
            field.show=true
            field.disabled=false
          }
           

        }
    },

     //远程获取表单配置
    getConfigByTpl() {
      instance.open({tplId:this.workflowId}).then(res => {
        var formData=JSON.parse(res.data.form);
        this.confGlobal = Object.freeze(formData);
        this.activity=res.data.activity
        this.activityCode=res.data.activity.nodeId
  //      console.log(formData)
        this.initDefaultData(formData);
      });
    },
    //远程获取表单配置
    getConfigByAjax() {
      var that=this
      workItem.open({workItemId:this.workItemId}).then(res => {
 
        if(res.code===0)
        {
          this.showResult('error','打开失败',res.msg);
          return
          }
        var formData=JSON.parse(res.data.form);
        var model=JSON.parse(res.data.formModel); 
        
        this.confGlobal = Object.freeze(formData);
        this.activity=res.data.activity
        this.items=res.data.items
        this.instance=res.data.instance
        this.activityCode=res.data.activity.nodeId
  //      console.log(formData)

       
     //後台實現 
     //    this.setPermission(this.activity.properties,formData.fields)

        if( model!==undefined&&model!==null)
          this.formModel=model
        else 
          this.initDefaultData(formData);
      });
    }
  },

  render (h) {

    const workflowList=<el-card>
        <div slot="header" class="clearfix">
          <span>流程信息</span> 
        </div>
        <el-table
            border
            data={this.items}
            style="width: 100%">
          <el-table-column
            label="序号"
            align="center"
            type="index"
            width="50">
          </el-table-column>
            <el-table-column
              prop="title"
              label="节点"
              align="center"
              width="120">
            </el-table-column>
            <el-table-column
              prop="participant"
              label="处理人"
              align="center"
              width="120">
            </el-table-column>
        <el-table-column
              prop="startTime"
              label="启动时间"
              align="center"
              width="180">
            </el-table-column>
              <el-table-column
              prop="finishTime"
              align="center"
              label="完成时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="state"
              align="center"
              label="狀態"
              width="80">
            </el-table-column>
            
            <el-table-column
              prop="comment"
              label="详情"
                 scopedSlots={{
                    default: ({ row }) => {
                      let approval=  row.approvalResult   === '1'  ?'同意': (row.approvalResult   === '0'?'拒绝':'')
                      
                      return   <div><el-row><el-col span={4}>{row.executor}</el-col><el-col span={4}>{  approval} </el-col><el-col span={16}> {row.comment}</el-col></el-row></div>
                     
                    }
                  }}> 
            </el-table-column>
          </el-table> 
        
        </el-card>
    
  const resultPage= <el-result  v-show={this.result.show} icon={this.result.icon} title={this.result.title} subTitle={this.result.detail}>
                <template slot="extra">
                <a href={'/detail?instanceId='+this.instance.id} >  
                  <el-button type="primary" size="medium">查看流程进度</el-button></a>
                </template>
              </el-result>
 

    if (!this.confGlobal) {
      return <div>
            <div v-loading="true" v-show={!this.result.show} class="loading-mask"></div>
               {resultPage}
              </div>
    }    
     const btns = <div span={24} style="position:fixed;top:0px;background-color:white;z-index:9999" >
                      <span v-show={this.activity&&this.activity.type==='Approver'} > 
                      <el-input type="textarea" v-model={this.approve.comment}  />
                       <el-radio v-model={this.approve.result} label={true}>同意</el-radio>
                        <el-radio v-model={this.approve.result} label={false}>拒绝</el-radio>
                      </span> 
                      
                      <el-button type="primary" onClick={this.submitForm}>提交表单</el-button>
                      <el-button onClick= {this.resetForm}>重置</el-button> 
                  </div>
            const menu=<el-menu  
        
              mode="horizontal"
            background-color="#64b5f6"
            text-color="#fff" 
            style="border:none"
            class="el-menu-toolbar"
 >
  <el-menu-item index="4">流程信息</el-menu-item>
  <el-menu-item index="1" onClick={this.submitForm} class="submit">提交表单</el-menu-item>
  <el-submenu index="2">
    <template slot="title">更多 </template>
    <el-menu-item index="2-1">驳回到上一个节点</el-menu-item>
    <el-menu-item index="2-2">驳回到开始</el-menu-item>
    <el-menu-item index="2-3">取消流程</el-menu-item>
   
  </el-submenu>
  <el-menu-item index="3" disabled>打印</el-menu-item>
</el-menu>

    return <el-container>
      <el-header v-show={false }>    <MyAffix  v-show={!this.result.show}>{menu}   </MyAffix></el-header>
      <el-main> 
           <el-row ><el-col>
      
      <div v-show={!this.result.show} class="workflow" style={'width:' + this.containerWidth + '%;'}>
      <el-card>
      
      <div  slot="header"  class="clearfix">
       <MyAffix>
          <span style="font-size:1.5rem">工单流程</span>
           <el-row style="float: right;" >
            <el-button  type="primary" icon="el-icon-s-promotion"  onClick={this.submitForm} size="medium " plain>提交</el-button>
            <el-button  type="info"  size="medium "   icon="el-icon-info" plain>流程信息</el-button>
          </el-row>
        </MyAffix>
        </div>
    
       <instanceHeader info={this.instance} ></instanceHeader> 
                   
          
             
                <el-row gutter={this.confGlobal.gutter} style="padding: 2rem 2rem 0;">
                  {this.buildForm(h)}
                </el-row>
                
                {this.buildDrawer(h)}
         
                 
              
          <div id="discussion" class="comments-container">
            <div class="comments-header"><i aria-hidden="true" class="v-icon notranslate mr-2 mdi mdi-comment-text-outline theme--dark"></i>
              <span>审批信息</span>
            </div>
            <div class="comments-main"><div>
          
              <span v-show={this.activity&&this.activity.type==='Approver'} >
                        <approveBox approveForm={this.approve}></approveBox>
              </span>
          
          </div>
        </div>
        
          </div>
             
               </el-card>
            <br/>
              {workflowList}
               
               </div>
              
               </el-col>
               </el-row> 
               {resultPage} 
              </el-main>
    </el-container>

  }
}
</script>
<style lang="stylus" scoped>

 // border-radius 6px
 // box-shadow 0 0 15px rgba(0, 0, 0, .1)
   
  .width-slider
    width  150px
    position absolute
    top 0
    right 2rem

.showDivider.form-container { 
  margin-bottom: 2rem; 
}
.loading-mask {
  width: 100vw;
  height: 100vh;
}



</style>

<style lang="scss"  >
$height: 3rem;

.workflow {
   margin: 10 auto 1rem ;

   }
.el-menu-toolbar{
     .submit{
    background-color: #ff9e40!important;
    border-left: 3px solid #FFF;
    border-right: 3px solid #FFF;
}
  .el-menu-item{
    height:$height;
    line-height: $height;
    font-size: 18px;}
    //  font-weight: 700;
    text-decoration: none;
    letter-spacing: 2px;
    color: #fff;

}
.el-menu--horizontal>.el-submenu .el-submenu__title {
height:$height;

    line-height: $height;

}
.workflow

{
  .el-select .el-input.is-disabled .el-input__inner {
    cursor: auto;
  }
  .el-radio__input.is-disabled+span.el-radio__label {
    color: black;
    cursor: auto;
  }
 .el-input.el-input--small.is-disabled.el-input--suffix 
 {
    .el-icon-arrow-up:before 
    {
    content:''
    
    }
 }
 .el-input-number.is-disabled {

  .el-input-number__increase{display: none;}
  .el-input-number__decrease{display: none;} 
 }
  .el-input.is-disabled .el-input__inner
  { 
      
    background-color: transparent;
      border-color: transparent;
      border-bottom: 1px dashed #ccc;
      color: black;
      cursor: auto;

      
  }


  .el-textarea.is-disabled .el-textarea__inner {
   background-color: transparent;
      border-color: transparent;
      color: black;
      cursor: auto;
      
    resize: none;
}
  .el-range-editor.is-disabled{
    background-color: transparent;
    input {
      background-color: transparent;
      color: black;
      cursor: auto;
    }
  }

}
</style>
