import axios from 'axios'
import Config from '../assets/js/config'
import { MessageBox, Message } from 'element-ui'
import { debounceHandle, configHref } from './index.js'

const alertErrorHandle = debounceHandle(
  errorCode => {
    Message({
      message: `请求失败，错误码：${errorCode}`,
      type: 'error',
      duration: 1500
    })
  },
  1500,
  true
)

let reLoginBox = debounceHandle(
  () => {
    MessageBox.alert(
      '当前会话已过期，请重新登录。',
      '抱歉！',
      {
        confirmButtonText: '前往登录',
        callback: action => {
          configHref('login')
        },
        showClose: false
      }
    )
  },
  2000,
  true
)

// 创建axios实例
const service = axios.create({
  baseURL: Config.baseUrl, // api 的 base_url
  timeout: 12000 // request timeout
})

// axios拦截器 添加请求拦截器
service.interceptors.request.use(
  function (config) { // 在请求发出之前进行一些操作
    return config
  },
  function (error) { // 请求错误
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    console.log(response.data.result, 'eeeeeeeeeeeee')
    if (+response.data.result === 401 && window.isFirstAlertAbateTag) {
      window.isFirstAlertAbateTag = false
      reLoginBox()
      return
    }

    if (response.data.result !== 0 && response.data.result !== 1) { // 收益有些result是1
      Message({
        message: response.data.description,
        type: 'error',
        duration: 3000
      })
      return Promise.reject(new Error())
    }
    // 对响应数据做点什么
    return response.data
  },
  function (error) {
    // 对响应错误做点什么
    if (+error.response.status === 401 && window.isFirstAlertAbateTag) {
      window.isFirstAlertAbateTag = false
      reLoginBox()
      return
    }

    if (error === undefined || !error.response) {
      Message({
        message: '服务请求超时！',
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(error)
    }

    if (+error.response.status === 403 && window.isFirstAlertAbateTag) {
      reLoginBox()
      return Promise.reject(new Error('error'))
    }
    alertErrorHandle(error.response.status)
    return Promise.reject(new Error('error'))
  }
)

export default service
