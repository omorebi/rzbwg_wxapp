// pages/exhibition/exhibition.js
const app = getApp();
import {get_exhibition_category,get_exhibition_list} from '../../apis/api_index';

Page({

    data: {
      basicExhibitionList: [],
      tempExhibitionList: [],
      virtualExhibitonList: [],
      currentIndex: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getBasicExhibitionList();
      this.getTempExhibitionList();
      this.getVirtualExhibtionList();
    },
    
    getBasicExhibitionList(){
      let that = this;
      get_exhibition_list(2).then(res => {
        console.log(res.data.exhibitions.list)
        that.setData({
          basicExhibitionList: res.data.exhibitions.list
        })
      })
    },
    getTempExhibitionList(){
      let that = this;
      get_exhibition_list(3).then(res => {
        console.log(res.data);
        that.setData({
          tempExhibitionList: res.data.exhibitions.list
        })
      })
    },
    getVirtualExhibtionList(){
      let that = this;
      get_exhibition_list(2).then(res => {
        console.log(res.data.exhibitions.list);
        that.setData({
          virtualExhibitonList: res.data.exhibitions.list
        })
      })
    },
    swiperChange(e){
      this.setData({
        currentIndex: e.detail.current
      })
    }
})