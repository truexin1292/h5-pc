import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/h5/home'
import LoginPage from '@/components/h5/login/login'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage
    }
  ]
})

/**
 * 验证
 */
router.beforeEach((to, from, next) => {
  if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    window.location.href = '/pc.html#/'
    return
  }
  next()
})

export default router
