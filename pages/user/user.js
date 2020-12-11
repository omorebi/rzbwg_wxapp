// pages/user/user.js
const app = getApp()
const util = require('../../utils/util.js');
import {
  get_user_info
} from '../../apis/api_user.js';
Page({
  data: {
    userList: [{
        icon: '/images/user/user_1.png',
        title: '我的预约',
        badge: 0,
      },
      {
        icon: '/images/user/user_2.png',
        title: '我的足迹',
        badge: 0,
      },
      {
        icon: '/images/user/user_3.png',
        title: '我的收藏',
        badge: 0,
      },
      {
        icon: '/images/user/user_4.png',
        title: '我的点赞',
        badge: 0,
      },
      {
        icon: '/images/user/user_5.png',
        title: '我的评论',
        badge: 0,
      },
      {
        icon: '/images/user/user_6.png',
        title: '问卷调查',
        badge: 0,
      },
      {
        icon: '/images/user/user_7.png',
        title: '意见反馈',
        badge: 0,
      },
      {
        icon: '/images/user/user_8.png',
        title: '切换场馆',
        badge: 0,
      }
    ],
    messageNum: 0, // 未读消息数
    height: 0, // 登录页面高度
    base_url: app.globalData.base_url,
    userInfo: {},
    avatarUrl: '', // 头像
    nickName: '', // 昵称
    hasUserInfo: false, // 是否登录
    phoneMd: false,
    disabled: true, //禁用登录按钮
    session: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: e => {
        let height = e.windowHeight
        this.setData({
          height: height
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    /**
     * 判断登录状态
     */
    let that = this
    let api_token = wx.getStorageSync('api_token')
    let userInfo = wx.getStorageSync('userInfo')
    if (api_token) {
      if (userInfo) {
        that.setData({
          userInfo: userInfo,
          hasUserInfo: true,
        })
      } else {
        // 乖乖去登录
        that.setData({
          hasUserInfo: false,
        })
      }
      /**
       * 有api_token查询详情个人信息
       */
      this.getInfo()
    }
  },
  /**
   * 查询个人信息
   */
  getInfo() {
    let that = this
    let museum_id = app.globalData.museum_id
    let api_token = wx.getStorageSync('api_token')
    get_user_info(museum_id, api_token).then(res => {
      console.log('返回数据', res.data)
      let collection = res.data.collection_num //收藏数量
      let like = res.data.like_num //点赞数量
      let comment = res.data.comment_num //评论数量


      let collection_num = "userList[2].badge";
      let like_num = "userList[3].badge";
      let comment_num = "userList[4].badge";
      that.setData({
        [collection_num]: collection,
        [like_num]: like,
        [comment_num]: comment,
      })
    })



  },
  /**
   * 授权按钮
   */
  getUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      wx.setStorage({
        key: "userInfo",
        data: e.detail.userInfo,
        success: function () {
          let userInfo = {
            avatarUrl: e.detail.userInfo.avatarUrl,
            nickName: e.detail.userInfo.nickName,
          }
          that.setData({
            userInfo: userInfo
          });
        }
      })
      app.globalData.userInfo = e.detail.userInfo,
        util.login(app.globalData.userInfo.avatarUrl, app.globalData.userInfo.nickName).then(res => {
          setTimeout(function () {
            that.setData({
              hasUserInfo: true,
            });
          }, 2000);

          wx.hideLoading()
        }).catch(error => {
          wx.hideLoading()
        })

    } else {
      wx.showModal({
        title: '提示',
        content: '您取消了授权，将影响使用小程序的部分功能。',
        confirmText: '确认授权',
        confirmColor: '#992e2d',
        success(res) {
          if (res.confirm) {
            wx.getSetting({
              success(res) {
                if (!res.authSetting['scope.userInfo']) {
                  wx.openSetting({
                    success(res) {
                      console.log(res.authSetting)
                      if (res.authSetting['scope.userInfo']) {
                        wx.getUserInfo({
                          success(res) {
                            console.log(res)
                            that.setData({
                              userInfo: res.userInfo,
                            });
                            that.mini_decoder(res);
                          }
                        });
                      }
                    }
                  })
                }
              }
            })
          }

        }
      });
    }
  },

  /**
   * 点击列表项- 跳转页面
   */
  clickRow: function (e) {
    var index = e.currentTarget.dataset.index;
    switch (index) {
      case 0:
        console.log("我的预约")
        wx.showToast({
          title: '建设中...',
          icon: 'none'
        })
        break
      case 1:
        console.log("我的足迹")
        wx.navigateTo({
          url: '/pages/user/footPoint/footPoint',
        })
        break
      case 2:
        console.log("我的收藏")
        wx.navigateTo({
          url: '/pages/user/myCollection/myCollection',
        })
        break
      case 3:
        wx.navigateTo({
          url: '/pages/user/myLikes/myLikes',
        })
        console.log("我的点赞")
        break
      case 4:
        console.log("我的评论")
        wx.navigateTo({
          url: '/pages/user/myComment/myComment',
        })
        break
      case 5:
        console.log("问卷调查")
        wx.navigateTo({
          url: '/pages/user/question/question',
        })
        break
      case 6:
        console.log("意见反馈")
        wx.navigateTo({
          url: '/pages/user/feedback/feedback',
        })
        break
      case 7:
        console.log("切换场馆")
        wx.reLaunch({
          url: '/pages/selectVsenues/selectVsenues',
        })
        break
    }

  },
  /**
   * 跳转至设置页
   */
  toSetting() {
    wx.navigateTo({
      url: '/pages/user/setting/setting',
    })
  },

})