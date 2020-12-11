// pages/user/footPoint/footPoint.js
const app = getApp();
import {
    get_my_exhibit_lsit
} from '../../../apis/api_user.js';


Page({

    /**
     * 页面的初始数据
     */
    data: {
        nullImages: "../../images/common/kongneirong.png",
        list: [],
        showNullTip: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getData();
    },

    getData() {
        // get_my_exhibit_lsit
        let that = this
        let museum_id = app.globalData.museum_id
        let api_token = wx.getStorageSync('api_token')

        get_my_exhibit_lsit(museum_id, 3, api_token, 1, 1000).then(res => {
            console.log('返回数据', res.data)
            var data = res.data
            if (res.data.length > 0) {
                this.setData({
                    list: res.data
                })
            } else {
                this.setData({
                    showNullTip: true
                })
            }
        });

    },
})