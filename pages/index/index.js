// pages/index/index.js
const app = getApp()
import {
  get_home_data
} from '../../apis/api_index.js';

Page({
  data: {
    base_url: app.globalData.base_url,
    thumbnail_url: app.globalData.thumbnail_url, // 缩略图用
    bannerList: [], // 轮播图
    currentIndex: 0, 
    scrollLeft: 0,
    menus: [{
        img: "/images/index/t1.png",
        title: '本馆介绍',
        id: 0
      },
      {
        img: "/images/index/t2.png",
        title: '参观预约',
        id: 1
      }, {
        img: "/images/index/t3.png",
        title: '参观须知',
        id: 2
      }, {
        img: "/images/index/t4.png",
        title: '交通信息',
        id: 3
      }
    ],
    // 展览
    exhibitionList: [],
    // 动态
    dynamicList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHomeData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },
  /**
   * 获取首页信息
   */
  getHomeData() {
    let that = this
    get_home_data().then(res => {
      // console.log('返回数据', res.data)
      that.setData({
        dynamicList: res.data.news,
        exhibitionList: res.data.recommend_exhibitions,
        bannerList: res.data.banners.exhibitions,
        scrollLeft: 240
      })
    });
  },
  /**
   * 点击轮播图去对应展览详情
   */
  toDetailExhibitions(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/index/exhibitionDeatils/exhibitionDeatil?id=' + id,
    })
  },
  /**
   * 点击菜单栏
   */
  clickMenu(e) {
    let id = e.currentTarget.id
    if (id == 0) {
      wx.navigateTo({
        url: '/pages/index/museumInfo/museumInfo',
      })
    }
    if (id == 1) {
      console.log('建设中')
      // wx.navigateTo({
      //   url: '/pages/index/ticket/ticket',
      // })
    }
    if (id == 2) {
      wx.navigateTo({
        url: '/pages/index/visitInfo/visitInfo',
      })
    }
    if (id == 3) {
      wx.navigateTo({
        url: '/pages/index/trafficInfo/trafficInfo',
      })
    }
  },
  /**
   * 湘博展览 查看全部
   */
  toExhibitionList() {
    wx.navigateTo({
      url: '/pages/index/exhibitionList/exhibitionList',
    })
  },
  /**
   * 湘博动态 查看全部
   */
  toDynamicList() {
    wx.navigateTo({
      url: '/pages/index/dynamicList/dynamicList',
    })
  },
  /**
   * 查看具体的动态
   */
  toDynamicDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/index/dynamicList/dynamicDeatil?id=' + id,
    })
  },
  /**
   * 查看单个具体展览
   */
  toDetails(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/index/exhibitionDeatils/exhibitionDeatil?id=' + id,
    })
  },
  /**
   * 跳转至搜索页
   */
  toSearchPage() {
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  },
  /**
   * 切换轮播图
   */
  swiperChange: function (e) {
    var that = this;
    that.setData({
      currentIndex: e.detail.current,
    })
  },
})