const api = require('./request.js')
module.exports = {
  // 我的收藏
  get_collect_lsit: (page, limit) => api.request('/api/collect/my', 'get', {
    p: 'wx',
    language: '1',
    page: page,
    limit: limit
  }, true),

  // 我的消息
  get_message_lsit: (page, limit) => api.request('/api/message', 'get', {
    p: 'wx',
    page: page,
    limit: limit
  }, true),

}