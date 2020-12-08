// pages/index/visitInfo/visitInfo.js
const app = getApp()
Page({
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 拨打电话
     */
    phoneCall() {
        wx.makePhoneCall({
            phoneNumber: '0633-878814' //仅为示例，并非真实的电话号码
        })
    }

})