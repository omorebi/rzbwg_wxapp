// pages/user/myCollection/myCollection.js
const app = getApp()
import {
    get_my_exhibit_lsit
} from '../../../apis/api_user.js';
import {
    do_like
} from '../../../apis/api_index.js';

Page({
    data: {
        collectList: [],
        notMore: false, // 加载更多
        page: 1,
        limit: 10,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCollectList()
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        //离开页面是停止播放音乐
        wx.getBackgroundAudioManager().stop();
        // 停止对下拉加载的监听
        this._observer && this._observer.disconnect();
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.backgroundAudioManager.stop();
        // 停止对下拉加载的监听
        this._observer && this._observer.disconnect();
    },
    /**
     * 获取点赞列表
     */
    getCollectList() {
        let that = this
        let museum_id = app.globalData.museum_id
        let api_token = wx.getStorageSync('api_token')
        let {
            page,
            limit,
            collectList
        } = that.data;
        get_my_exhibit_lsit(museum_id, 2, api_token, page, limit).then(res => {
            console.log('返回数据', res.data)
            var data = res.data
            if (limit > data.length) {
                this.setData({
                    page: page + limit,
                    collectList: [...collectList, ...data], // es6合并数组
                    bannerList: res.data,
                    notMore: true,
                });
                this._observer && this._observer.disconnect();
            } else {
                this.setData({
                    page: page + limit,
                    collectList: [...collectList, ...data],
                    bannerList: res.data,
                    notMore: false,
                });
            }
        });
    },
    /**
     * 取消收藏
     */
    deleteLike(e) {
        var that = this
        let id = e.currentTarget.dataset.id
        let api_token = wx.getStorageSync('api_token')
        wx.showModal({
            title: '提示',
            content: '是否确认取消收藏？',
            success(res) {
                if (res.confirm) {
                    console.log(id)
                    do_like(2, id, api_token).then(res => {
                        that.data.page = 1
                        that.data.collectList = []
                        that.getCollectList()
                    });
                } else if (res.cancel) {
                    // console.log('用户点击取消')
                }
            }
        })
    },
    /**
     * 跳转至具体展品页
     */
    toDetailExhibit(e) {
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/exhibition/detailExhibits/detailExhibits?id=' + id,
        })
    }
})