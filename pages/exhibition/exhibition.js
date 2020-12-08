// pages/exhibition/exhibition.js
Page({

    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 跳转到具体展览页面
     */
    toDetailExhibition() {
        wx.navigateTo({
          url: '/pages/exhibition/detailExhibition/detailExhibition',
        })
    }
})