<script>
import render from '@/utils/bpm/render.js'
import instance from '@/views/bpm/instance.js'
import * as workItem from '../../api/bpm/workItem'
import { trigger } from '@/components/bpm/DynamicForm/components/generator/config.js'
/**
 * 校验组织机构组件是否为空
 */
const setFcOrgSelectRule = ( conf, ctx ) => {
  return { 
    validator: (rule, value, callback) => {
      var val = ctx.formModel[rule.field]
      if (Object.keys(val || {}).length === 0) {
        callback()
        return
      }

      var count = 0
      conf.tabList.forEach(key => {
        val && Array.isArray(val[key]) && (count += val[key].length)
      })
      callback(count ? undefined : new Error(`${conf.title}不能为空`))
    }, 
    trigger: trigger[conf.tag],
    type: 'object',
    required: true, 
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
  console.log(prop)
  ctx.$set(ctx.formModel, prop, val)
}

var _isMounted = false // 收集默认值 渲染完成之后防止重复收集默认值

const buildData = (ctx, value, prop) => setData(ctx, value, prop, true)

var permissions=  {field20:true,field2:true,field3:true,field4:true,field5:false,}
 
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
    console.log('conf.vModel:'+conf.vModel)
    let item =  <el-col span={conf.span}>
                  <el-form-item 
                  label-width={labelWidth} 
                  label={isList ? '' : conf.label} 
                  prop={conf.vModel}>
                    <render
                    formData={ctx.formModel}
                    conf={conf} 
                    disabled={permissions[conf.vModel]||false}
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
      id:this.$route.query.id,
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
      ///审批结果
       comment:'' 
    }
  },
  mounted(){
     
    if (!this.confGlobal) {
      this.getConfigByAjax();
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
    submitForm (result) {//提交表单
      const isTableValid = this.checkTableData()
      this.$refs[this.confGlobal.formRef].validate(valid => {
        if(!valid) return
        if (!isTableValid) return
        this.$notify({
          title: '表单数据',
          message: '请在控制台中查看数据输出',
          position: 'bottom-right'
        });
        this.showResult('success','提交成功','您的工作项已完成！');
        workItem.submit({id:this.id,form:this.formModel,comment:this.comment,approvalResult:result}).then(res=>{
            console.log(res)
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
          //disabled:true,
          model: this.formModel,
          rules: this.ruleList,
          size: this.confGlobal.size,
          labelWidth: this.confGlobal.labelWidth + 'px',
          labelPosition: this.confGlobal.labelPosition || undefined
        },
        ref: this.confGlobal.formRef
      }
      const btns = <el-col span={24}>
                    <el-form-item  style="text-align:right;"  >
                      <span v-show={this.activity&&this.activity.type==='Approver'} >
                      <el-input type="text" v-model={this.comment}  />
                      <el-button type="primary" onClick={this.agree} >同意</el-button>
                      <el-button type="primary" onClick={this.reject}>拒绝</el-button>
                      </span>
                      <el-button type="primary" onClick={this.submitForm} v-show={!this.activity||this.activity.type!=='Approver'} ></el-button>
                      <el-button onClick={this.resetForm}>重置</el-button>
                    </el-form-item>
                  </el-col>
      // 因为使用jsx时  el-form 的 model 一直无法正确填充，故采用createElement直接渲染
      return h('el-form', formObject, [content, btns]) 
    },
    ///为表单创建属性
    initDefaultData(config) {
      config.fields.forEach(field => {
        this.$set(this.formModel, field.vModel, field.defaultValue);
      });
    },
    //远程获取表单配置
    getConfigByAjax() {
      var that=this
      workItem.open({id:this.id}).then(res => {
 
        if(res.code===0)
        {
          this.showResult('error','打开失败',res.msg);
          return
          }
        var formData=JSON.parse(res.data.form);
        console.log('formData')
        console.log(formData)
        var model=JSON.parse(res.data.formModel); 
        console.log(res.data.formModel)
        console.log('this.formModel')
        console.log(model) 
        console.log(this.formModel)
        this.confGlobal = Object.freeze(formData);
        this.activity=res.data.activity
        this.items=res.data.items
        this.instance=res.data.instance
        this.activityCode=res.data.activity.nodeId
  //      console.log(formData)
        if( model!==undefined&&model!==null)
          this.formModel=model
        else 
          this.initDefaultData(formData);
      });
    }
  },

  render (h) {

return <instance></instance>
    const workflowList=<el-card>
        <div slot="header" class="clearfix">
          <span>流程信息</span>
          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
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
              prop="name"
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
              prop="approvalResult"
              align="center"
              label="审批意见"  width="80"
              
              scopedSlots={{
                    default: ({ row }) => {
                      let approval=  row.approvalResult   === '1'  ?'同意': (row.approvalResult   === '0'?'拒绝':'')
                      
                      return <div >{  approval}</div>
                    }
                  }}
                  
                  >
              
            </el-table-column>
            <el-table-column
              prop="comment"
              label="评论">
            </el-table-column>
          </el-table> 
        
        </el-card>
    
  const resultPage= <el-result  v-show={this.result.show} icon={this.result.icon} title={this.result.title} subTitle={this.result.detail}>
                <template slot="extra">
                  <el-button type="primary" size="medium">查看流程进度</el-button>
                </template>
              </el-result>

  const  basic=<el-card>
                <div slot="header" class="clearfix">
                    <span>{this.instance.name}</span>
                    <el-button style="float: right; padding: 3px 0" type="text"></el-button>
                  </div>
                  <el-row><el-col span={2}> 发起日期：</el-col> <el-col span={10}> {this.instance.createdTime}</el-col>
                  <el-col span={2}>
                  发起人：
                  </el-col> <el-col span={10}>-</el-col>
                  </el-row>

                  <el-row><el-col span={2}> 参考号码：</el-col>
                  <el-col span={10}>{this.instance.referenceNo}</el-col>
                  <el-col span={2}>
                  当前节点
                  </el-col> 
 <el-col span={10}>
                  {this.activity&&this.activity.title} 
                  </el-col> 
                  
                  </el-row>
                  
                </el-card>

    if (!this.confGlobal) {
      return <div>
            <div v-loading="true" v-show={!this.result.show} class="loading-mask"></div>
      
               {resultPage}
              </div>
    }    
    return <el-card class="workflow" v-show={!this.result.show} >
            
             {basic}
             <br/>
            <el-card  >  
            
             <div slot="header" class="clearfix">
                <span>表单信息</span>
                <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
              </div>
             
                <el-row gutter={this.confGlobal.gutter} style="padding: 2rem 2rem 0;">
                  {this.buildForm(h)}
                </el-row>
                
                {this.buildDrawer(h)}
         
                
              </el-card>
            <br/>
              {workflowList}
              
              </el-card>
              
               {resultPage}
  }
}
</script>
<style lang="stylus" scoped>
.workflow 
  margin 0 auto 1rem
  border-radius 6px
  box-shadow 0 0 15px rgba(0, 0, 0, .1)
   
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
