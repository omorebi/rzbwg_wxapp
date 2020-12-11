const api = require('./request.js')
module.exports = {

  // a. 用户信息
  get_user_info: (museum_id, api_token) => api.request('/api/users/user_info', 'get', {
    p: 'wxmini',
    museum_id: museum_id,
    api_token: api_token
  }),

  // b. 我的收藏 [type=1]  / 我的收藏 [type=2]  /足迹 [type=3]    1点赞2收藏3足迹
  get_my_exhibit_lsit: (museum_id, type, api_token, page, limit) => api.request('/api/users/exhibit_list', 'get', {
    p: 'wxmini',
    museum_id: museum_id,
    type: type,
    api_token: api_token,
    page: page,
    limit: limit
  }),


  // c. 我的评论
  get_my_comment_lsit: (museum_id, api_token, page, limit) => api.request('/api/users/my_comment', 'get', {
    p: 'wxmini',
    museum_id: museum_id,
    api_token: api_token,
    page: page,
    limit: limit
  }),

  // d.删除评论
  el_my_comment: (comment_id, api_token) => api.request('/api/users/del_my_comment', 'get', {
    p: 'wxmini',
    comment_id: comment_id,
    api_token: api_token
  }),

  // e.意见反馈
  feedback_save: (museum_id, api_token, comment, phone) => api.request('/api/users/feedback', 'post', {
    p: 'wxmini',
    museum_id: museum_id,
    api_token: api_token,
    comment: comment,
    phone: phone
  }),


  /**
   * 问卷调查模块
   */
  // 1.获取问卷
  get_question: (museum_id) => api.request('/api/question/question_list', 'get', {
    p: 'wxmini',
    museum_id: museum_id
  }),

  // 2.获取问卷调查所有问题 ok
  get_question_list: (question_id) => api.request('/api/question/get_question', 'get', {
    p: 'wxmini',
    question_id: question_id
  }),

  // 3.提交问卷
  post_question: (ques_id, data,num) => api.request('/api/question/postquesinfo_new', 'post', {
    p: 'wxmini',
    ques_id: ques_id,
    data: data,
    num: num
  }, true),
}