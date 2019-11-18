import Vue from 'vue'
import Router from 'vue-router'

// 在注册组件之前要记得引入
import HelloWorld from '@/components/HelloWorld'
import Chapter11 from '@/components/Chapter1-1'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', // URL
      name: 'HelloWorld', // 这个路由组件的名字，当我们需要用name来跳转的时候会用到
      component: HelloWorld // 注册的组件
    },
    {
      path: '/chapter1-1', // URL
      name: 'Chapter1-1', // 这个路由组件的名字，当我们需要用name来跳转的时候会用到
      component: Chapter11 // 注册的组件
    }
  ]
})
