// pages/index/visitInfo/visitInfo.js
const app = getApp()
import {
    get_visit
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
     * 获取参观须知信息
     */
    getInfo() {
        let that = this
        let museum_id = app.globalData.museum_id
        get_visit(museum_id).then(res => {
            // console.log('返回数据', res.data)
            that.setData({
                info: res.data
            })
        });
    },
    /**
     * 拨打电话
     */
    phoneCall() {
        wx.makePhoneCall({
            phoneNumber: this.data.info.phone   //仅为示例，并非真实的电话号码
        })
    }

})