// 浏览器兼容性
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/components/bpm/DynamicForm/styles/index.styl'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/styles/index.scss'
import '@/mixin'
import '@/directive'
import lodash from 'lodash'
import i18n from './lang' // 国际化
import store from './store'
import router from './router'
import App from './App.vue'
import MyPagination from '@/components/my-pagination'

//import '@/components/bpm/DynamicForm/icons'
import './icons'

import FormControls from '@/components/bpm/FormControls/index.js'

import Tinymce from '@/components/bpm/FormControls/Tinymce/index.vue'

Vue.component('tinymce', Tinymce)
Vue.use( FormControls )
// 组件尺寸和多语言
Vue.use(ElementUI, {
  size: 'mini', // large / medium / small / mini
  i18n: (key, value) => i18n.t(key, value)
})

// 全局组件注册
Vue.component('MyPagination', MyPagination)

Vue.config.productionTip = false
Vue.prototype.$_ = lodash

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
