import request from '../../utils/request'
import Config from '../../assets/js/config'

// 商户信息
export function accountInfoApi (data) {
  return request({
    baseURL: Config.h5,
    url: '/rest/group/distributor/accountInfo',
    method: 'get',
    params: data
  })
}

// 登录 - form-data
export function loginApi (data) {
  return request({
    baseURL: Config.h5,
    url: '/rest/group/distributor/login',
    method: 'post',
    data,
    transformRequest: [ (data) => {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    } ],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
