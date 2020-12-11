// pages/index/dynamicList/dynamicList.js
const app = getApp()
import {
    get_news_list
} from '../../../apis/api_index.js';
Page({
    data: {
        bannerList: [], // 轮播图
        currentIndex: 0, // 轮播图当前索引
        tabList: ['本馆新闻', '工作动态'], //tab
        tabIndex: 0, // tab当前索引
        notMore: false, // 加载更多
        page: 1,
        limit: 10,
        list: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getNewsList()
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
     * 滚动到底部加载更多
     */
    loadMore() {
        this._observer = wx.createIntersectionObserver(this);
        this._observer.relativeToViewport().observe('.observer-el', res => {
            // 下来到底部
            if (res.intersectionRatio > 0) {
                this.getNewsList();
            }
        });
    },
    /**
     * 获取动态列表
     */
    getNewsList() {
        let that = this
        let museum_id = app.globalData.museum_id
        let type = this.data.tabIndex + 1
        var {
            page,
            limit,
            list
        } = that.data;
        get_news_list(museum_id, type, page, limit).then(res => {
            var data = res.data.news_list
            console.log('全部动态', res.data)
            if (limit > data.length) {
                this.setData({
                    page: page *1+ 1,
                    list: [...list, ...data], // es6合并数组
                    bannerList: res.data.top_list,
                    notMore: true,
                });
                this._observer && this._observer.disconnect();
            } else {
                this.setData({
                    page: page *1+ 1,
                    list: [...list, ...data],
                    bannerList: res.data.top_list,
                    notMore: false,
                });
            }

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
    /**
     * 切换Tab
     */
    changeTab(e) {
        let index = e.currentTarget.dataset.index
        this.setData({
            tabIndex: index,
        })
        this.getNewsList()
    },
    /**
     * 跳转至动态详情页
     */
    toDetailDynamic(e) {
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/index/dynamicList/dynamicDeatil?id=' + id,
        })
    }
})