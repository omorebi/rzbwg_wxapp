//app.js
App({
  onLaunch: function () {
    // 设置左侧胶囊按钮
    this.getSystemInfo()
  },
  /**
   * 获取手机数据
   */
  getSystemInfo() {
    wx.getSystemInfo({
      success: e => { // { statusBarHeight: 20, ... }，单位为 px
        // 获取右上角胶囊的位置信息
        let info = wx.getMenuButtonBoundingClientRect() // { bottom: 58, height: 32, left: 278, right: 365, top: 26, width: 87 }，单位为 px
        this.globalData.pageWidth = e.windowWidth
        this.globalData.pageHeight = e.windowHeight
        this.globalData.titleTop = info.top
        this.globalData.topHeight = info.top + 5 + info.height
        this.globalData.titleLineHeight = info.height
        this.globalData.tabbarHeight = e.screenHeight - e.windowHeight - e.statusBarHeight
        // 用于直接给页面全屏高度
        this.globalData.height = this.globalData.pageHeight - this.globalData.topHeight
      }
    })
  },
  globalData: {
    userInfo: null,
    openid: '',
    api_token: '',
    tabbarHeight: 0,
    infosButton: {
      bottom: wx.getSystemInfoSync().statusBarHeight + 38 || 58,
      height: 32,
      width: 87,
    },
    titleTop: 0,
    pageWidth: 0,
    pageHeight: 0,
    topHeight: 0,
    titleLineHeight: 0,
    height: 0, // 页面高度减去顶部导航
    type: 0, // 全局存场馆列id 1===博物馆 2===美术馆
    base_url: 'https://sapi.hnmuseum.com/hn_image/', // 图片资源线上base_url
    thumbnail_url: 'https://sapi.hnmuseum.com', // 给缩略图用
  }
})