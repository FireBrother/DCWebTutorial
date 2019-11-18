// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$axios = axios

/* eslint-disable no-new */
new Vue({
  el: '#app', // 设置挂载点（作用范围）
  router, // 引入路由
  components: { App }, // 注册组件，只需要注册根组件App
  template: '<App/>' // 一个默认模板
})
