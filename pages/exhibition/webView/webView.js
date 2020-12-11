// pages/exhibition/webView/webView.js
Page({
    data: {
        webUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let title = options.title
        if (title) {
            wx.setNavigationBarTitle({
                title: title
            })
        }
        let str = decodeURI(options.url)
        this.setData({
            webUrl: str
        })
    }
})