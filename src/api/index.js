import request from '../utils/request'
import Config from '../assets/js/config'

// 获取用户菜单
export function getMenuList () {
  return request({
    url: '/rest/authority/user/getMenu',
    method: 'get'
  })
}

// 获取商户场地
export function getPlaceList () {
  return request({
    url: '/vending/analysis/equipment/group',
    method: 'get'
  })
}

// 获取场地分组
export function getGroupList () {
  return request({
    url: '/vending/analysis/group/setting',
    method: 'get'
  })
}

// 账号权限
export function getAllRoleMenuApi () {
  return request({
    url: '/rest/user/resource/getAllRoleMenu',
    method: 'get'
  })
}

// 娃娃屋登录
export function loginWaWaWuApi (data) {
  return request({
    baseURL: Config.wawawuContext, // api 的 wawawuContext
    url: '/rest/login',
    method: 'post',
    data
  })
}

// 登录
export function loginApi (data) {
  return request({
    url: '/rest/login',
    method: 'post',
    data
  })
}

// 获取验证码
export function getValidCode () {
  return `${Config.wawawuContext}/rest/verifycode?${new Date().getTime()}`
}

// 判断是否主子账号
export function isApproveApi () {
  return request({
    url: '/rest/user/approve',
    method: 'get'
  })
}

// 判断新手指引
export function isFirstPcLoginApi () {
  return request({
    url: '/rest/user/isFirstPcLogin',
    method: 'get'
  })
}

// 退出
export function logoutApi () {
  return request({
    url: '/rest/logout',
    method: 'get'
  })
}
