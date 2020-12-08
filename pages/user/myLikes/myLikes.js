// pages/user/myLikes/myLikes.js
Page({
    data: {
        likeList: [{
                id: 1,
                name: '镂空蛋壳高柄陶杯',
                time: '2020-08-04 15:22',
                imgUrL: '/images/e1.png'
            },
            {
                id: 2,
                name: '白釉黑彩四系壶',
                time: '2020-08-04 15:22',
                imgUrL: '/images/e2.png'
            },
            {
                id: 3,
                name: '四系罍',
                time: '2020-08-04 15:22',
                imgUrL: '/images/e3.png'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /**
     * 取消点赞
     */
    deleteLike(e) {
        var that = this
        let id = e.currentTarget.dataset.id
        wx.showModal({
            title: '提示',
            content: '是否确认取消点赞？',
            success(res) {
                if (res.confirm) {
                    console.log(id)
                } else if (res.cancel) {
                    // console.log('用户点击取消')
                }
            }
        })
    },
    /**
     * 跳转至具体展品页
     */
    toDetail(e) {
        let id = e.currentTarget.dataset.id
    }
})