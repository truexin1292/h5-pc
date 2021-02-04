module.exports = {
  proxy: {
    '/lyy': {
      target: 'https://db.leyaoyao.com',  // 开发环境域名
      // target: 'https://sb.leyaoyao.com',  // 测试环境域名
      // target: 'https://b.leyaoyao.com',  // 生产环境域名
      // target: 'http://192.168.10.17:9023',  // 局域网环境域名
      changeOrigin: true,
      // pathRewrite: {// 如果接口本身没有/api需要通过pathRewrite来重写了地址  , todo 不能使用重写，因为其他接口无法验证登录信息
      //   '^/h5': '' // 重写规则，必须是/h5 -> '' 不能 h5 => ''
      // }
    },
    // 没有字母的规则必须放在下面
    '/': {
      target: 'https://dwo.leyaoyao.com',  // 开发环境域名
      // target: 'https://swo.leyaoyao.com',  // 测试环境域名
      // target: 'https://wa.leyaoyao.com',  // 生产环境域名
      // target: 'http://192.168.10.17:9023',  // 局域网环境域名
      changeOrigin: true
    },
  }
}
