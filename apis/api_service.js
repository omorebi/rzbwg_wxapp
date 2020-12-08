const api = require('./request.js')
module.exports = {
  /**
   * 服务设施
   */
  get_infra: () => api.request('/api/visit/infra', 'get', {
    p: 'wx',
    language: '1'
  }),


  /**
   * 文创商店模块
   */

  // 1.文创商店分类
  get_shop_category: () => api.request('/api/wenchuang/purchase', 'get', {
    p: 'wx',
    language: '1'
  }),
  // 2.文创商店根据分类Id查询商品列表
  get_wenchuang_lsit: (purchase_id, page, limit) => api.request('/api/wenchuang/list', 'get', {
    p: 'wx',
    language: '1',
    purchase_id: purchase_id,
    page: page,
    limit: limit
  }, false, false),
  // 3.文创商品浏览量+1
  add_views: (id) => api.request('/api/wenchuang/views_incr', 'post', {
    p: 'wx',
    id: id,
  }, false, false),



  /**
   * 意见反馈
   */
  feedback_save: (content, user_phone) => api.request('/api/feedback', 'post', {
    p: 'wx',
    language: '1',
    content: content,
    user_phone: user_phone
  }, true),



  /**
   * 问卷调查模块
   */
  // 1.获取问卷调查所有问题 ok
  get_question_list: () => api.request('/api/question/detail', 'get', {
    p: 'wx',
    language: '1'
  }),



  // 2.提交问卷
  post_question: (id, infos) => api.request('/api/question/answer', 'post', {
    p: 'wx',
    id: id,
    infos: infos
  }, true),
}