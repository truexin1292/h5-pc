class WebSocketCommon {
  /* 配置构造器 */
  constructor (url, options) {
    this.url = url || ''
    this.options = options || {}
    this.url = options.url || '' // websocket路径
    this.messageType = options.messageType || '' // 消息类型
    this.autoReconnect = options.autoReconnect || true // 是否自动重连，按目前后端设计的websocket方案，是只能连接一次，重连是要重新获取websocket地址
    this.reConnectDuration = options.reConnectDuration || 1500 // 重连间隔时间
    this.reSendCount = options.reSendCount || 3 // 客户端重发消息次数
    this.reSendDuration = options.reSendDuration || 1500 // 重发消息间隔时间
    // 各种监听事件
    this.onEvent = options.onEvent || {
      open: function () {},
      noSupport: function () {},
      close: function () {},
      error: function () {},
      getMsg: function () {}
    }
    this.reconnect_timer = null // 重连定时器
    this.reSend_timer = null // 重发定时器
    this.isConnect = false // 连接状态
    this.init(this.url)
  }
  /* 初始化websocket */
  init (url) {
    var that = this
    that.socket = null
    console.log('❤❤❤❤❤❤init', url)

    // 检测浏览器支持
    window.WebSocket = window.WebSocket || window.MozWebSocket
    if (!window.WebSocket) {
      that.onEvent.noSupport()
      console.warn('❤❤❤❤❤❤浏览器不支持websocket', 'WebSocketCommon文件打印的日志')
      return
    }

    clearInterval(that.reconnect_timer)

    that.socket = new WebSocket(url)

    that.socket.onopen = function (msg) {
      console.warn('❤❤❤❤❤❤--onopen连上了----->', msg)
      that.isConnect = true
      clearInterval(that.reconnect_timer) // 清除重连定时器
      that.onEvent.open(msg)
    }

    that.socket.onclose = function (msg) {
      console.warn('❤❤❤❤❤❤--onclose连接关闭----->', msg)
      that.isConnect = false
      that.onEvent.close(msg)
    }

    that.socket.onerror = function (msg) {
      console.warn('❤❤❤❤❤❤--onerror连接错误----->', msg)
      that.isConnect = false
      that.autoReconnect = false
      that.onEvent.error(msg)
    }

    that.socket.onmessage = function (msg) {
      console.warn('❤❤❤❤❤❤----onmessage收到消息----->', msg)
      that.getMsg(msg.data)
    }
  }

  /* 发送消息 */
  send (msg) {
    var that = this
    clearInterval(that.reSend_timer)
    if (that.isConnect) {
      msg = typeof msg === 'string' ? msg : JSON.stringify(msg)
      that.socket.send(msg)
    } else {
      var reSendCount = that.reSendCount // 重发次数
      that.reSend_timer = setInterval(function () {
        console.log('websocket状态：', that.socket.readyState, 'WebSocketCommon文件打印的日志')
        reSendCount-- // 重发次数自减
        if (reSendCount === 0) { // 重发次数用完
          clearInterval(that.reSend_timer)
        } else {
          if (that.socket.readyState === WebSocket.OPEN) { // 连接处于打开状态才发送消息
            that.socket.send(msg)
            clearInterval(that.reSend_timer)
          } else {
            console.warn('websocket连接未打开', 'WebSocketCommon文件打印的日志')
          }
        }
      }, that.reSendDuration)
    }
  }

  /* 返回消息 */
  getMsg (msg) {
    console.log('❤❤❤❤❤❤getMsg', msg)
    this.onEvent.getMsg(msg)
  }

  // 断开连接
  close () {
    if (this.isConnect) {
      this.socket.close()
      this.autoReconnect = false
    }
  }
}

export default WebSocketCommon
