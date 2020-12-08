// pages/index/trafficInfo/trafficInfo.js
Page({
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 打开地图
     */
    onTraffic() {
        const latitude = 28.211823
        const longitude = 112.993278
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 16,
            name: "日照市博物馆",
            address: "日照市东港区烟台路33号"
        })
    }
})