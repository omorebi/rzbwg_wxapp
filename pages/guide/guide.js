// pages/guide/guide.js
const app = getApp()
import {
  getMapList
} from '../../apis/api_map.js';

Page({
  data: {
    base_url: app.globalData.base_url,
    index: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMapList()
  },

  getMapList() {
    let that = this
    let museum_id = app.globalData.museum_id
    getMapList(museum_id).then(res => {
      console.log('返回数据', res.data)
      that.setData({
        mapList:res.data
      })
      
    });
  },

  showFloorMap(e) {
    let id = e.target.id
    console.log('map_id++++',id)
    // wx.navigateTo({
    //   url: '../guide/floorMap?mapId=' + id + '&mapList=' + JSON.stringify(this.data.mapList),
    // })
  },

  showSecondFloorMap() {

  },

  showThirdFloorMap() {

  },

})