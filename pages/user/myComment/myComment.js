// pages/user/myComment/myComment.js
const app = getApp()
import {
    get_my_comment_lsit,
    el_my_comment
} from '../../../apis/api_user.js';
Page({
    data: {
        commentList: [],
        notMore: false, // 加载更多
        page: 1,
        limit: 4,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getCommentList()
        this.loadMore();
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
     * 获取我的评论列表
     */
    getCommentList() {
        let that = this
        let museum_id = app.globalData.museum_id
        let api_token = wx.getStorageSync('api_token')
        let {
            page,
            limit,
            commentList
        } = that.data;
        get_my_comment_lsit(museum_id, api_token, page, limit).then(res => {
            console.log('返回数据', res.data)
            var data = res.data
            if (limit > data.length) {
                this.setData({
                    page: page *1+ 1,
                    commentList: [...commentList, ...data], // es6合并数组
                    bannerList: res.data,
                    notMore: true,
                });
                this._observer && this._observer.disconnect();
            } else {
                this.setData({
                    page: page *1+ 1,
                    commentList: [...commentList, ...data],
                    bannerList: res.data,
                    notMore: false,
                });
            }
        });
    },
    /**
     * 滚动到底部加载更多
     */
    loadMore() {
        this._observer = wx.createIntersectionObserver(this);
        this._observer.relativeToViewport().observe('.observer-el', res => {
            // 下来到底部
            if (res.intersectionRatio > 0) {
                this.getCommentList();
            }
        });
    },
    /**
     * 删除评论
     */
    toDelete(e) {
        var that = this
        let id = e.currentTarget.dataset.id
        let api_token = wx.getStorageSync('api_token')
        wx.showModal({
            title: '提示',
            content: '是否确认删除该条评论？',
            success(res) {
                if (res.confirm) {
                    console.log(id)
                    el_my_comment(id, api_token).then(res => {
                        that.data.page = 1
                        that.data.commentList = []
                        that.getCommentList()
                    });
                } else if (res.cancel) {
                    // console.log('用户点击取消')
                }
            }
        })
    }
})