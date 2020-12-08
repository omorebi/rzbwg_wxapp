const api = require('./request.js')
module.exports = {
  // 获取首页数据
  get_home_data: () => api.request('/api/home', 'get', {
    p: 'wx',
    language: '1'
  }),

  // 参观指南
  get_visit: () => api.request('/api/visit/guid', 'get', {
    p: 'wx',
    language: '1'
  }),


  /**
   * ----- 展览part
   */
  // 1.全部展览查询分类
  get_exhibition_category: () => api.request('/api/exhibition/category_list', 'get', {
    p: 'wx',
    language: '1'
  }),

  // 2.根据分类查询展览
  get_exhibition_list: (cate_id) => api.request('/api/exhibition/list', 'get', {
    p: 'wx',
    language: '1',
    page: 1,
    limit: 1000,
    cate_id: cate_id
  }, false, false),

  // 3. 展览详情
  get_exhibition_detail: (id) => api.request('/api/exhibition/detail', 'get', {
    p: 'wx',
    language: '1',
    id: id
  }),

  // 4.查询展览相关评论
  get_exhibition_comment: (page, limit, id) => api.request('/api/comment/exhibition/list', 'get', {
    p: 'wx',
    page: page,
    limit: limit,
    id: id
  }, true),

  // 5.展览全部语音列表页
  get_video_list: (page, limit, exhibition_id) => api.request('/api/exhibit/video_list', 'get', {
    p: 'wx',
    page: page,
    limit: limit,
    exhibition_id: exhibition_id
  }),

  // 6.点赞or取消点赞  1-展览 2-展品
  do_like: (type, id) => api.request('/api/like', 'post', {
    p: 'wx',
    type: type,
    id: id
  }, true, false),

  // 7.发表评论  1-展览 2-展品
  do_comment: (type, id, content) => api.request('/api/comment', 'post', {
    p: 'wx',
    type: type,
    id: id,
    content: content
  }, true),

  /**
   * ---- 湘博动态part
   */
  // 湘博动态列表页
  get_news_list: (page, limit) => api.request('/api/news/list', 'get', {
    p: 'wx',
    language: '1',
    page: page,
    limit: limit,
  }),

  // 动态详情
  get_news_detail: (id) => api.request('/api/news/detail', 'get', {
    p: 'wx',
    language: '1',
    id: id
  }),


  /**
   * ---- 搜索模块
   */
  // a.热门搜索
  get_hotwords_list: () => api.request('/api/hotwords/list', 'get', {
    p: 'wx'
  }),

  // b.关键词搜索
  get_search: (words) => api.request('/api/hotwords/search', 'get', {
    p: 'wx',
    language: '1',
    words: words
  },false,false),


  /**
   * ---- 展品part
   */

  // 1.展品列表
  get_exhibit_list: (page, limit, exhibition_id) => api.request('/api/exhibit/list', 'get', {
    p: 'wx',
    language: '1',
    page: page,
    limit: limit,
    exhibition_id: exhibition_id
  }),

  // 2.展品详情  language不传的话就是查询全部语种
  get_exhibit_detail: (id) => api.request('/api/exhibit', 'get', {
    p: 'wx',
    id: id
  }),

  // 3.查询展品相关评论
  get_exhibit_comment: (page, limit, id) => api.request('/api/comment/exhibit/list', 'get', {
    p: 'wx',
    page: page,
    limit: limit,
    id: id
  }, true),

  // 4.收藏or取消收藏展品
  do_collect: (id) => api.request('/api/collect', 'post', {
    p: 'wx',
    id: id
  }, true, false),

  // 5.展品语音播放量+1
  add_play_nums: (language_id) => api.request('/api/exhibit/audio_incr', 'post', {
    p: 'wx',
    language_id: language_id,
  }, false,false),
}