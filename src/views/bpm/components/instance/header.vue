<template>
    <section class="v-application">
         <div class="v-main">
        <div class="contents">

        <!--    <div class="container grey pa-0 container--fluid lighten-4"  ><div class="row no-gutters align-content-center" style="height: 90px;"><div class="page-col-content is-page-header offset-lg-3 offset-xl-2 col pl-4" style="margin-top: auto; margin-bottom: auto;"><div class="headline grey--text text--darken-3">工单流程</div><div class="caption grey--text text--darken-1">工单流程</div></div></div></div>

   <h2 id="entity实体类" class="toc-header"><a href="#entity实体类" class="toc-anchor">¶</a> 基本信息</h2>-->
 <blockquote class="is-info">
    <el-row>
   <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6"><p>发起日期：{{info.createdTime}}<br></p></el-col>
   <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6"><p>发起人：{{info.initiatorName}}<br></p></el-col>
   <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6"><p>参考号：{{info.referenceNo}}<br></p></el-col>
   <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6"><p>当前节点：{{activity&&activity.title}}<br></p></el-col>
    </el-row>
    </blockquote>
 
   <!--<h2 id="entity实体类" class="toc-header"><a href="#entity实体类" class="toc-anchor">¶</a> 表单信息</h2>-->
        </div> </div>
    </section>
</template> 
<script> 
export default   {
   props:{
    info:{type:Object}
   }
} 
</script>
<style>
.comments-container {
    border-radius: 7px;
}
.comments-header {
    color: #fff;
    padding: 8px 20px
px
;
    font-size: 16px;
    font-weight: 500;
    background-color: #607d8b;
    border-radius: 7px 7px 0 0;
}
.mdi-comment-text-outline:before {
    content: "\F0189";
}
.mdi-set, .mdi:before {
    display: inline-block;
    font: normal normal normal 24px/1 Material Design Icons;
    font-size: inherit;
    text-rendering: auto;
    line-height: inherit;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.v-icon.v-icon:after {
    background-color: currentColor;
    border-radius: 50%;
    content: "";
    display: inline-block;
    height: 100%;
    left: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    transform: scale(1.3);
    width: 100%;
    transition: opacity .2s cubic-bezier(.4,0,.6,1);
}

.comments-main {
    background-color: #eceff1;
    border-radius: 0 0 7px 7px;
    padding: 20px;
}
.v-icon.v-icon {
    align-items: center;
    -js-display: inline-flex;
    display: inline-flex;
    font-feature-settings: "liga";
    font-size: 24px;
    justify-content: center;
    letter-spacing: normal;
    line-height: 1;
    position: relative;
    text-indent: 0;
    transition: .3s cubic-bezier(.25,.8,.5,1),visibility 0s;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}
.v-application .grey.lighten-4 {
    background-color: #f5f5f5!important;
    border-color: #f5f5f5!important;
} 
.v-application .pa-0 {
    padding: 0!important;
} 
.v-application .grey {
    background-color: #9e9e9e!important;
    border-color: #9e9e9e!important;
} 
.container--fluid {
    max-width: 100%;
}

.no-gutters {
    margin-right: 0;
    margin-left: 0;
}
.v-application .pl-4 {
    padding-left: 16px!important;
}

.v-application .grey--text.text--darken-3 {
    color: #424242!important;
    caret-color: #424242!important;
}
 
.v-application .headline, .v-application .title {
    line-height: 2rem;
    font-family: Roboto,sans-serif!important;
} 
.v-application .headline {
    font-size: 1.5rem!important;
    font-weight: 400;
    letter-spacing: normal!important;
} 
.v-application .grey--text {
    color: #9e9e9e!important;
    caret-color: #9e9e9e!important;
}
.row {
    -js-display: flex;
    display: flex;
    flex-wrap: wrap;
    flex: 1 1 auto;
    margin-right: -12px;
    margin-left: -12px;
}
</style>
<style lang="scss" scoped>
 
.v-application {
    font-family: sans-serif;
    line-height: 2;
    .v-main .contents{
        p{
            padding: 1rem 0 0;
            margin: 0;
        }
        h1,h2,h3,h4,h5,h6 {
            padding: 0;
            color: #1565c0;
            margin-top: 2rem;
            position: relative;
            &:after {
                content: "";
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(90deg,#1976d2,rgba(25,118,210,0));
                border-radius: 3px;
            }

             .toc-anchor {
                    display: none;
                    position: absolute;
                    right: 1rem;
                    bottom: 0.5rem;
                    font-size: 1.25rem;
                    text-decoration: none;
                    color: #9e9e9e;
                }
        }

         blockquote {
            padding: 0 1rem 1rem;
            background-color: #eceff1;
            border-left: 55px solid #607d8b;
            border-radius: 0.5rem;
            margin: 1rem 0;
            position: relative;
            &:before {
                display: inline-block;
                font: normal normal normal 24px/1 Material Design Icons,sans-serif;
                position: absolute;
                margin-top: -12px;
                top: 50%;
                left: -38px;
                color: hsla(0,0%,100%,.7);
                content: "󰋼";
            }
            &.is-info{
                &:before {
                    content: "󰋼";
                }
                -webkit-text-size-adjust: 100%;
                word-break: normal;
                tab-size: 4;
                font-size: 16px;
                text-rendering: optimizeLegibility;
                -webkit-font-smoothing: antialiased;
                -webkit-tap-highlight-color: rgba(0,0,0,0);
                font-family: Roboto,sans-serif;
                line-height: 1.5;
                background-repeat: no-repeat;
                box-sizing: inherit;
                padding: 0 1rem 1rem;
                border-left: 55px solid #607d8b;
                border-radius: .5rem;
                margin: 1rem 0;
                position: relative;
                background-color: #e3f2fd;
                border-color: #64b5f6;
                color: #0d47a1;
                }
            }
    }
}
</style>