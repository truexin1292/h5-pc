import Vue from 'vue'
import App from './App'
import router from '@/router/pc'
import store from '@/store'
import VueResource from 'vue-resource'
import Es6Promise from 'es6-promise'
import * as filters from '@/utils'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/assets/css/base.css'
import { configHref } from '@/utils'

Es6Promise.polyfill()

Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'small' })
Vue.use(VueResource)

// 设置超时时间
Vue.http.options.timeout = 60000
window.isFirstAlertAbateTag = true

let reLoginSessionBox = function (title) {
  window.isFirstAlertAbateTag = false
  Vue.prototype.$alert(title, '抱歉！', {
    confirmButtonText: '登录',
    showClose: false,
    closeOnHashChange: false,
    callback: _ => {
      configHref('login')
      setTimeout(() => {
        window.isFirstAlertAbateTag = true
      }, 500)
    }
  })
}
// 请求拦截器
Vue.http.interceptors.push((request, next) => {
  // 调用等待框，此处的 this 为发起请求的 component
  let timeout
  // 如果某个请求设置了_timeout,那么超过该时间，会终端该（abort）请求,并执行请求设置的钩子函数onTimeout方法，不会执行then方法。
  if (request._timeout) {
    timeout = setTimeout(() => {
      if (request.onTimeout) {
        request.onTimeout(request)
        request.abort()
      }
    }, request._timeout)
  }
  if (request.method === 'GET') {
  } else if (request.method === 'POST') {
  }
  next(response => {
    var title = ''
    if (+response.status === 403 && window.isFirstAlertAbateTag) {
      request.abort()
      title = '当前会话已过期，请重新登录'
      reLoginSessionBox(title)
      return
    }
    if (+response.body.result === 401 && window.isFirstAlertAbateTag) {
      request.abort()
      title = '您无权限访问，请重新登录'
      reLoginSessionBox(title)
      return
    }
    clearTimeout(timeout)
  })
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
