// pages/exhibition/detailExhibition/detailExhibition.js
const app = getApp()
import {
    get_exhibition_detail
} from '../../../apis/api_index.js';
Page({

    data: {
        id: 0,
        bannerList: [],
        info: {},
        exhibitList: [],
        scrollLeft: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('哈哈哈', options.id)
        this.data.id = options.id
        this.getgetExhibitionDetail()
    },
    /**
     * 展品详情
     */
    getgetExhibitionDetail() {
        let that =this
        let id = this.data.id 
        let scrollLeft = 480/app.globalData.ratio
        get_exhibition_detail(id).then(res => {
            var data = res.data
            console.log('展览详情', res.data)
            that.setData({
                bannerList: res.data.exhibition_info.exhibition_imgs,
                info: res.data.exhibition_info,
                exhibitList: res.data.exhibit_list,
                scrollLeft: scrollLeft
            })
        });
    },
    /**
     * 馆藏精品查看更多
     */
    toExhibitionList() {
        let id = this.data.id
        wx.navigateTo({
          url: '/pages/exhibition/exhibitsList/exhibitsList?id='+id,
        }) 
    },
    /**
     * 查看视频
     */
    playMp4() {
        let url = this.data.info.mp4_path
        let title = this.data.info.exhibition_name
        wx.navigateTo({
          url: '/pages/exhibition/webView/webView?url=' +url+'&title='+title,
        })
    },
    /**
     * 查看具体展品
     */
    toDetails(e) {
        console.log(e.currentTarget.dataset.id)
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '/pages/exhibition/detailExhibits/detailExhibits?id='+id,
        })
    }
})