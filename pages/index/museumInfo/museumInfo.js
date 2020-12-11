// pages/index/museumInfo/museumInfo.js
const app = getApp()
import {
    get_museum_des
} from '../../../apis/api_index.js';
Page({
    data: {
        info: {},
        currentIndex: 0,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getInfo()
    },
    /**
     * 获取本馆信息
     */
    getInfo() {
        let that = this
        let museum_id = app.globalData.museum_id
        get_museum_des(museum_id).then(res => {
            // console.log('本馆信息', res)
            that.setData({
                info: res.data
            })
        });
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