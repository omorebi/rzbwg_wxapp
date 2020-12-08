// pages/user/user.js
const app = getApp()
import {
  getCode
} from "../../apis/globalData.js";
import {
  get_wx_mini_session,
  get_wx_mini_jtoken,
  get_wx_mini_decoder,
  get_wx_mini_register
} from '../../apis/api_login.js';

Page({
  data: {
    userList: [{
        icon: 'user/book.png',
        title: '我的预约',
        badge: 0,
      },
      {
        icon: 'user/book.png',
        title: '我的足迹',
        badge: 0,
      },
      {
        icon: 'user/like.png',
        title: '我的收藏',
        badge: 32,
      },
      {
        icon: 'user/book.png',
        title: '我的点赞',
        badge: 64,
      },
      {
        icon: 'user/like.png',
        title: '问卷调查',
        badge: 0,
      },
      {
        icon: 'user/like.png',
        title: '意见反馈',
        badge: 0,
      }
    ],
    messageNum: 0, // 未读消息数
    height: 0, // 登录页面高度
    base_url: app.globalData.base_url,
    userInfo: {
      nickName: '可口可爱',
      avatarUrl: 'https://sapi.hnmuseum.com/uploadfiles/avatar/20201128/e4774cdda0793f86414e8b9140bb6db4.jpg'
    },
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
      success: e => { // { statusBarHeight: 20, ... }，单位为 px
        // 获取右上角胶囊的位置信息
        let info = wx.getMenuButtonBoundingClientRect() // { bottom: 58, height: 32, left: 278, right: 365, top: 26, width: 87 }，单位为 px
        let height = e.windowHeight - (info.top + 0 + info.height)
        this.setData({
          height: height
        })
      }
    })
    /**
     * 登录~~~~~~
     */
    // this.login();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //  预留给未来的未读消息
    let maxList = [1, 2, 3, 4, 5, 6]
    let minList = [2]
    let newList = minList.filter((val) => {
      return maxList.indexOf(val) > -1
    })
    if (newList.length === maxList.length) {
      // console.log("true") // 没有未读消息
    } else {
      // console.log("fasle") // 没有未读消息
      // console.log(maxList.length - newList.length) // 未读的数量
    }

    /**
     * 判断登录状态
     */
    let jtoken = wx.getStorageSync('jtoken')
    let userInfo = wx.getStorageSync('userInfo')
    if (jtoken) {
      // console.log(jtoken)
      if (userInfo) {
        // console.log(userInfo)
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true,
        })
      } else {
        // 乖乖去登录
        this.setData({
          hasUserInfo: false,
        })
      }
    }

  },

  /**
   * 登录
   */
  async login() {
    let that = this;
    try {
      let code = await getCode()
      // console.log(code)
      let res = await get_wx_mini_session(code);
      // console.log('res===', res)
      if (res.status == 1) {
        wx.setStorage({
          key: "sessions",
          data: res.data,
        });
        // console.log('openid------', res.data.openid)
        that.setData({
          session: res.data
        })
        let token = await get_wx_mini_jtoken(res.data.openid)
        let userInfo = {
          nickName: token.data.nickname,
          avatarUrl: token.data.avatar,
        }
        wx.setStorage({
          key: "userInfo",
          data: userInfo,
          success: function () {
            that.setData({
              userInfo: userInfo,
              hasUserInfo: true,
            });
          }
        })

        if (token.status == 1) {
          // 显示登录状态下的个人中心页面
          that.setData({
            hasUserInfo: true
          })
          wx.setStorage({
            key: "jtoken",
            data: token.data.jtoken,
          });
        } else if (token.status == 9001) {
          that.setData({
            disabled: false,
          })
        }
      }
    } catch (e) {
      console.log(e)
      this.showM()
    }
  },
  /**
   * 提示信息
   */
  showM() {
    wx.showModal({
      title: '提示',
      content: '遇到问题了，请稍后再试~',
      confirmText: '回到首页',
      confirmColor: '#992e2d',
      success(res) {
        if (res.confirm) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }

      }
    });
  },

  /**
   * 授权按钮
   */
  getUserInfo: function (e) {
    var that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
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
      that.mini_decoder(e.detail);

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
  mini_decoder(e, type = 1) {
    let that = this;
    console.log('type===', type)
    let datas = {
      p: 'wxmini',
      iv: encodeURIComponent(e.iv),
      encryptdata: encodeURIComponent(e.encryptedData),
      session: encodeURIComponent(that.data.session.session_key),
    }
    console.log('data====', datas)
    if (type == 2) {
      get_wx_mini_decoder(datas).then(res => {
        console.log(res)
        that.setData({
          phone: res.data.pure_phone_number
        })
        //phone_number  国外手机带区号

        let reDatas = {
          p: 'wxmini',
          phone: that.data.phone,
          openid: that.data.session.openid,
          b_from: 'wxmini',
          b_unionid: that.data.unionid,
          b_nickname: that.data.userInfo.nickName,
          b_avatar: that.data.userInfo.avatarUrl,
        }
        /**
         * 用户注册接口
         */
        // console.log(reDatas)
        get_wx_mini_register(reDatas).then(res => {
          console.log(res)
          wx.setStorage({
            key: "jtoken",
            data: res.data.jtoken,
            success: function () {
              // 显示登录状态下的个人中心页面
              that.setData({
                hasUserInfo: true
              })
            }
          })
        })
      })
    } else {
      get_wx_mini_decoder(datas).then(res => {
        console.log(res)
        that.setData({
          unionid: res.data.union_id
        })
        that.setData({
          phoneMd: true,
        });
      })
    }
  },

  /**
   * 获取手机号
   */
  getPhoneNumber(e) {
    var that = this;
    console.log(e.detail);
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      that.setData({
        phoneMd: false,
        uesrPhoneNumber: e.detail,
      });

      that.mini_decoder(e.detail, 2);

    }
  },
  close() {
    this.setData({
      phoneMd: false,
    })
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
        wx.showToast({
          title: '建设中...',
          icon: 'none'
        })
        break
      case 2:
        console.log("我的收藏")
        wx.navigateTo({
          url: '/pages/user/myCollection/myCollection',
        })
        break
      case 3:
        console.log("我的点赞")

        break
      case 4:
        console.log("问卷调查")
        // wx.navigateTo({
        //   url: '/pages/user/myMessage/myMessage',
        // })
        wx.showToast({
          title: '建设中...',
          icon: 'none'
        })
        break
      case 5:
        console.log("意见反馈")
        wx.navigateTo({
          url: '/pages/user/feedback/feedback',
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