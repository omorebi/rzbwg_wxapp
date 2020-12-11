// pages/selectVsenues/selectVsenues.js
const app = getApp()
import {
    get_museum_list
} from '../../apis/api_index.js';

Page({
    data: {
        vsenuesList: [],
        sameDes: false, //是不是两个馆的开放时间一样
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getMuseumList()
    },
    /**
     * 获取场馆
     */
    getMuseumList() {
        let that = this
        get_museum_list().then(res => {
            // console.log('返回数据', res.data)
            let data = res.data
            that.setData({
                vsenuesList: data
            })
            if (data[0].open_time == data[1].open_time) {
                /**
                 * 两个馆的开始时间一样
                 */
                console.log('两个馆的开始时间一样')
                that.setData({
                    sameDes: true
                })
            } else {
                console.log('两个馆的开始时间不一样')
                that.setData({
                    sameDes: false
                })
            }
        });
    },
    /**
     * 选择场馆
     */
    chooseVsenues(e) {
        let museum_id = e.currentTarget.dataset.id
        // 全局存场馆id
        app.globalData.museum_id = museum_id
        console.log(app.globalData.museum_id)
        wx.switchTab({
            url: '/pages/index/index',
        })
    }
})