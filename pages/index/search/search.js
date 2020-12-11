// pages/index/search/search.js
const app = getApp()
import {
  get_search
} from '../../../apis/api_index.js';
//  get_search: (museum_id,key_words)
Page({
  data: {
    searchFlag: false,
    base_url: app.globalData.base_url,
    step: 1, // 控制页面步骤标识 0-搜索为空; 1-默认页;
    searchList: [], // 请求返回的数据
    cancelFlag: false, // x图标清空Input内容
    inputFocus: true, // input聚焦
    searchData: {}, // 搜索返回的内容
    content: '', // 搜索内容
    hotSearchList: [], // 热门搜索
    historyList: [], // 搜索历史
  },

  /**
   * ***-页面初始化-***
   * A-获取热门搜索排行
   * B-从缓存拿历史搜索记录
   */
  onLoad: function (options) {
    var value = wx.getStorageSync('searchHistory')
    if (value) {
      this.data.historyList = value
      this.setData({
        historyList: value,
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  
  /**
   * 直接搜索热词
   */
  searchHotKey(e) {
    var content = e.currentTarget.dataset.content;
    this.setData({
      content: content
    })
    this.search()
  },
  /**
   * 输入搜索内容
   */
  inputContent: function (e) {
    if (e.detail.value.length >= 1) {
      this.setData({
        content: e.detail.value,
        cancelFlag: true,
      })
    } else {
      this.setData({
        cancelFlag: false,
      })
    }
  },
  /**
   * 从搜索历史再次搜索
   */
  historySearch: function (e) {
    let content = this.data.historyList[e.currentTarget.id]
    this.setData({
      content: content
    })
    this.saveHistoryData(content)
  },
  /**
   * 保存历史搜索记录
   */
  saveHistoryData(e) {
    // console.log('保存搜索历史', e)
    this.searchKeywords(e)
    var index = this.data.historyList.indexOf(e)
    if (index > -1) {
      this.data.historyList.splice(index, 1);
    }
    this.data.historyList.unshift(e)
    this.setData({
      historyList: this.data.historyList
    })
    wx.setStorageSync('searchHistory', this.data.historyList)
    this.setData({
      content: e,
      cancelFlag: true,
    })

  },
  /**
   * 清除搜索历史记录
   */
  clearHistory() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定清空搜索记录吗',
      success(res) {
        if (res.confirm) {
          that.data.historyList = []
          that.setData({
            historyList: [],
          })
          wx.setStorageSync('searchHistory', that.data.historyList)
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 清除Input内容
   */
  onClear() {
    this.setData({
      content: '',
      cancelFlag: false,
      step: 1
    })
  },
  /**
   * 取消，页面返回一页
   */
  goBack() {
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 跳转到具体展品详情页
   */
  toHistoricalDeatil(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/exhibition/detailExhibits/detailExhibits?id=' + id,
    })
  },
  /**
   * 跳转到具体展览详情页
   */
  toExhibitionDeatil(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/exhibition/detailExhibition/detailExhibition?id=' + id,
    })
  },
  /**
   * 搜索
   */
  search(e) {
    // console.log('最终的要搜索的关键字', this.data.content)
    this.saveHistoryData(this.data.content)

  },
  /**
   * 最终共同的搜索请求方法 每次只要搜索data里面的content就行，最终搜索结果都指向了cotent
   */
  searchKeywords() {
    let that = this
    let key_words = this.data.content
    let museum_id = app.globalData.museum_id
    get_search(museum_id,key_words).then(res => {
      // console.log('搜索结果', res.data)
      let searchData = res.data
      if (searchData.exhibit_list.length < 1 && searchData.exhibition_list.length < 1) {
        // 搜索为空，显示搜索为空页面
        that.setData({
          step: 0
        })
      } else {
        //有结果的话
        that.setData({
          step: 2,
          searchData: searchData
        })
      }
    });
  }
})