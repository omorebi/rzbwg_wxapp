// pages/index/trafficInfo/trafficInfo.js
const app = getApp()
import {
    get_traffic_info
} from '../../../apis/api_index.js';
Page({
    data: {
        info: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getInfo()
    },
    /**
     * 获取交通信息
     */
    getInfo() {
        let that = this
        let museum_id = app.globalData.museum_id
        get_traffic_info(museum_id).then(res => {
            that.setData({
                info: res.data
            })
        });
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
            name: this.data.info.title,
            address: "日照市东港区烟台路33号"
        })
    }
})