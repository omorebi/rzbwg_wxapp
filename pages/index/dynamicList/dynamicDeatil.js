// pages/index/dynamicList/dynamicDeatil.js
const app = getApp()
import {
  get_news_detail
} from '../../../apis/api_index.js';
Page({
  data: {
    base_url: app.globalData.base_url,
    news: {}
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id) {
      this.getNewsDetail(options.id)
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 动态详情
   */
  getNewsDetail(e) {
    let that = this
    get_news_detail(e).then(res => {
      console.log('动态详情', res.data)
      that.setData({
        news: res.data
      })
    });
  }
})