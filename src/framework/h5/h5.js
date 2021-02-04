import Vue from 'vue'
import App from './App'
import router from '@/router/h5'
import Vant from 'vant'
import 'vant/lib/index.css'

Vue.config.productionTip = false
window.isFirstAlertAbateTag = true
Vue.use(Vant)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
