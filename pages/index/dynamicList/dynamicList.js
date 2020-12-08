// pages/index/dynamicList/dynamicList.js
const app = getApp()
import {
    get_news_list
} from '../../../apis/api_index.js';
Page({
    data: {
        bannerList: [{
                id: 0,
                title: '日照博物馆关于疫情期间参观须知',
                imgUrl: '/images/index/i4.png'
            },
            {
                id: 1,
                title: '日照博物馆关于疫情期间参观须知',
                imgUrl: '/images/index/i4.png'
            },
            {
                id: 2,
                title: '日照博物馆关于疫情期间参观须知',
                imgUrl: '/images/index/i4.png'
            }
        ],
        currentIndex: 0, // 轮播图当前索引
        tabList: ['本馆新闻', '工作动态'], //tab
        tabIndex: 0, // tab当前索引
        notMore: false, // 加载更多
        page: 1,
        limit: 10,
        list: [], // 全部数据
        dynamicList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getNewsList()
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this;
        if (!that.data.notMore) {
            that.data.page++;
            that.getNewsList()
        }
    },
    /**
     * 获取湘博动态列表
     */
    getNewsList() {
        let that = this
        var {
            page,
            limit
        } = that.data;
        get_news_list(page, limit).then(res => {
            var data = res.data.news.list
            console.log('全部动态', res.data)
            // 接下来的这一串都是为了要一条设计觉得好看的线--哎
            if (page == 1) {
                var num = 0
                for (let i = 0; i < data.length; i++) {
                    if (data[i].is_top == 1) {
                        num = num + i;
                    }
                }
                that.setData({
                    toppingNum: num > 1 ? num : -1,
                    toppingLine: num > 1 ? true : false,
                })
            }
            // 正常操作
            that.setData({
                dynamicList: that.data.dynamicList.concat(res.data.news.list)
            })
            if (res.data.news.count == that.data.dynamicList.length) {
                that.setData({
                    notMore: true,
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
            tabIndex: index
        })
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