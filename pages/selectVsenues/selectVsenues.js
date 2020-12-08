// pages/selectVsenues/selectVsenues.js
const app = getApp()
Page({
    data: {
        vsenuesList: [
            {
                id: 1,
                imgUrl: '/images/m1.png',
                name: '日照市博物馆'
            },
            {
                id: 2,
                imgUrl: '/images/m2.png',
                name: '日照市美术馆'
            },
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

   /**
    * 选择场馆
    */
   chooseVsenues(e) {
    // console.log(e.currentTarget.dataset.id)
    let type = e.currentTarget.dataset.id
    // 全局存场馆id
    app.globalData.type = type
    console.log(app.globalData.type)
    wx.switchTab({
      url: '/pages/index/index',
    })
   }
})