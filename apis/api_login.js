const api = require('./request.js')
module.exports = {
  // 获取小程序session，或直接登录
  get_wx_mini_session: (code) => api.request('/api/wx/mini_session', 'post', {
    p: 'wxmini',
    code: code
  },false,false),

  // 小程序用户解密
  get_wx_mini_decoder: (data) => api.request('/api/wx/mini_decode', 'post', data),


  // 小程序用户登录
  get_wx_mini_jtoken: (openid) => api.request('/api/usersbind/login', 'post', {
    openid,
    b_from: 'wxmini'
  }),
  // 小程序app.js用户登录
  get_wx_mini_jtoken_app: (openid) => api.appRequest('/api/usersbind/login', 'post', {
    openid,
    b_from: 'wxmini'
  }),

  // 小程序用户注册
  get_wx_mini_register: (data) => api.request('/api/usersbind/register', 'post', data),

}