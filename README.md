
一个基于Vue开发的BPM 前端，后续会增加更多实用的功能。 

后端地址: https://github.com/leooneone/AIBPM

一个基于VUE开发的BPM。
### 关键词
Vue, workflow 工作流, bpm , OA

### 有些东西必须写
框架：https://github.com/zhontai/Admin.UI 

工作流前端：https://github.com/SNFocus/approvalFlow

里面有什么：Vue 一些工作流可用组件，树形流程设计图 ==

我做了什么？
1.开发一些前端组件和修改一些BUG；
2.增加了一些功能
3.我做了很多没用的测试工作。
 
### 后续要做什么：

1.丰富审批功能（转发，协助，催办，驳回到任意节点，取消流程）

2.先做完1再说吧

### 在线体验
演示地址：稍后呈现（http://bpm.ailicloud.com）

文档地址：还没有写，等我亮瞎你们眼
*********************************************************
### 项目下载后，首先安装依赖包
```
npm install
或
npm install --registry=https://registry.npm.taobao.org
```

### 安装成功后，运行即可
```
npm run serve
```

#### Tips：



```
如果你想换端口，可以直接修改根目录下的 vue.config.js 文件

  devServer: {
    port: 9000, // 当前 admin 项目的端口号

    proxy: {
      // 配置代理
      "/api": {
        target: "http://localhost:8000",//改成后端api地址

```

### 开发过程中检查错误，可执行lint
```
npm run lint
```

### 想要发布，执行bulid打包成dist
```
npm run build
```
