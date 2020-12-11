const api = require('./request.js')
module.exports = {
  /**
   * 选择场景
   */
  get_museum_list: () => api.request('/api/museum_list', 'get', {
    p: 'wxmini',
  }),



  // 获取首页数据
  get_home_data: (museum_id) => api.request('/api/home_list', 'get', {
    p: 'wxmini',
    museum_id: museum_id
  }),

  /**
   * 搜索
   */
  get_search: (museum_id,key_words) => api.request('/api/home_search', 'get', {
    p: 'wx',
    museum_id: museum_id,
    key_words: key_words
  },false,false),


  // 1.本馆介绍
  get_museum_des: (museum_id) => api.request('/api/museum_des', 'get', {
    p: 'wxmini',
    museum_id: museum_id
  }),

  // 3.参观须知
  get_visit: (museum_id) => api.request('/api/museum_visit_info', 'get', {
    p: 'wxmini',
    museum_id: museum_id
  }),

  // 4.交通信息
  get_traffic_info: (museum_id) => api.request('/api/museum_traffic_info', 'get', {
    p: 'wxmini',
    museum_id: museum_id
  }),



  /**
   * ---- 馆务动态part
   */
  //  馆务动态列表页 type: 1本馆新闻2工作动态
  get_news_list: (museum_id, type, page, limit) => api.request('/api/news/news_list', 'get', {
    p: 'wxmini',
    museum_id: museum_id,
    type: type,
    page: page,
    limit: limit,
  }),

  // 动态详情
  get_news_detail: (news_id) => api.request('/api/news/news_info', 'get', {
    p: 'wxmini',
    news_id: news_id
  }),





  /**
   * ----- 展览part
   */
  // 1. 展览首页
  get_exhibition_home: (museum_id) => api.request('/api/exhibition/exhibition_home', 'get', {
    p: 'wxmini',
    museum_id: museum_id
  }),

  // 2. 展览详情
  get_exhibition_detail: (exhibition_id) => api.request('/api/exhibition/exhibition_info', 'get', {
    p: 'wxmini',
    exhibition_id: exhibition_id
  }),

  /**
   * 展品patr
   */
  // 1. 藏品列表
  get_exhibit_list: (museum_id, page, limit, exhibition_id) => api.request('/api/exhibit/exhibit_list', 'get', {
    p: 'wxmini',
    museum_id: museum_id,
    page: page,
    limit: limit,
    exhibition_id: exhibition_id,
  }),
  // 2. 藏品详情
  get_exhibit_detail: (exhibit_id, language, api_token) => api.request('/api/exhibit/exhibit_info', 'get', {
    p: 'wxmini',
    exhibit_id: exhibit_id,
    language: language,
    api_token: api_token
  }),

  // 3.查询展品相关评论 p	string	
  get_exhibit_comment: (page, limit, exhibit_id) => api.request('/api/exhibit/comment_list', 'get', {
    p: 'wxmini',
    page: page,
    limit: limit,
    exhibit_id: exhibit_id
  }),

  // 4.点赞/收藏展品 type：	1点赞2收藏
  do_like: (type, exhibit_id, api_token) => api.request('/api/exhibit/do_like', 'post', {
    p: 'wxmini',
    type: type,
    exhibit_id: exhibit_id,
    api_token: api_token
  },false,false),

   // 5.发表评论 -展品
   do_comment: (api_token, exhibit_id, comment) => api.request('/api/exhibit/exhibit_comment', 'post', {
    p: 'wxmini',
    api_token: api_token,
    exhibit_id: exhibit_id,
    comment: comment
  }),








  // ————————————————————————————分割线






  // 5.展览全部语音列表页
  get_video_list: (page, limit, exhibition_id) => api.request('/api/exhibit/video_list', 'get', {
    p: 'wx',
    page: page,
    limit: limit,
    exhibition_id: exhibition_id
  }),

  

 




  /**
   * ---- 展品part
   */




  // 4.收藏or取消收藏展品
  do_collect: (id) => api.request('/api/collect', 'post', {
    p: 'wx',
    id: id
  }, true, false),

  // 5.展品语音播放量+1
  add_play_nums: (language_id) => api.request('/api/exhibit/audio_incr', 'post', {
    p: 'wx',
    language_id: language_id,
  }, false, false),
}