// pages/exhibition/exhibition.js
const app = getApp()
import {
  get_exhibition_home
} from '../../apis/api_index.js';
Page({
  data: {
    currentIndex: 0, //基本陈列索引Id
    recommendList: [], // 推荐展览
    recommendCurrentIndex: 0, //推荐展览当前索引id
    basicList: [], // 基本陈列
    temporaryList: [], // 临时展览
    virtualMuseum: [], // 虚拟博物馆
    scrollLeft: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHomeData()
  },
  /**
   * 展览首页数据
   */
  getHomeData() {
    let that = this
    let museum_id = app.globalData.museum_id
    let scrollLeft = 320 / app.globalData.ratio
    get_exhibition_home(museum_id).then(res => {
      console.log('返回数据', res.data)
      that.setData({
        basicList: res.data.jbcl_exhibition_list, // 基本陈列
        temporaryList: res.data.lszl_exhibition_list, //临时展览
        virtualMuseum: res.data.overall_view_list, //虚拟博物馆
        recommendList: res.data.tj_exhibition_list,  //推荐展览
        scrollLeft: scrollLeft
      })
    });
  },
  /**
   * 跳转到具体展览页面
   */
  toDetailExhibition(e) {
    let id = e.currentTarget.dataset.id
    console.log(id)
    wx.navigateTo({
      url: '/pages/exhibition/detailExhibition/detailExhibition?id=' + id,
    })
  },
  /**
   * 跳转至具体虚拟博物馆
   */
  toDetailOverallView(e) {
    let id = e.currentTarget.dataset.id
    console.log('该打开内嵌h5了')
  },
  /**
   * 【基本陈列】切换轮播图
   */
  swiperChange: function (e) {
    var that = this;
    that.setData({
      currentIndex: e.detail.current
    });
  },
  /**
   * 【推荐展览】切换轮播图
   */
  recommendChange: function (e) {
    var that = this;
    that.setData({
      recommendCurrentIndex: e.detail.current
    });
  },
})