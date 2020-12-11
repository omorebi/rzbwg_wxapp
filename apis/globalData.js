let urlsA = [
  // "https://sapi.hnmuseum.com", //
  // "https://sapi.hnmuseum.com" //正式域名
  "http://192.168.10.159:12050",
  "http://192.168.10.159:12050",
];

function base_urls() {
  let version = __wxConfig.envVersion;
  switch (version) {
    case 'develop':
      return urlsA[0]
      // '开发版环境域名';
    case 'trial':
      return urlsA[0]
      // '体验版环境域名';
    case 'release':
      return urlsA[1]
      // '线上环境域名';
    default:
      return urlsA[1]
      // 未知环境域名';
  }
}


module.exports = {

  base_url: base_urls(),

  showLoading: (title) => {
    return new Promise((resolve, reject) => {
      // if (getApp().globalData.isShowLoading) { //如果已经显示了loading，则跳过
      //   return resolve()
      // }
      wx.showLoading({
        title: title ? title : '加载中...',
        mask: false,
        success(res) {
          // getApp().globalData.isShowLoading = true;
          // console.log(res, '显示loading')
          resolve(res)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  hideLoading: () => {
    return new Promise((resolve) => {

      // if (!getApp().globalData.isShowLoading) { //如果没有显示loading，返回
      //   return resolve()
      // }
      wx.hideLoading({
        success(res) {
          // getApp().globalData.isShowLoading = false;
          resolve(res)
        },
      })
    })
  },
  getCode: () => {
    return new Promise((resolve, reject) => {
      wx.login({
        success: function (res) {
          var code = res['code'];
          resolve(code);
          console.log("code值" + code);
        },
        fail: function (msg) {
          wx.showModal({
            title: '网络繁忙，请稍后再试',
            showCancel: false,
          });
          reject(msg);
        }
      });
    })
  },
  
  /**
   * 加载特殊字体
   */
  loadFontFace: () => {
    return new Promise((resolve, reject) => {
      wx.loadFontFace({
        family: 'fontFamily',
        source: 'url("https://sapi.hnmuseum.com/hn_image/fontFamily.TTF")',
        global: true, 
        success(res) {
          // console.log(res.status)
          resolve(true);
        },
        fail: function (res) {
          reject('字体加载失败');
        },
        complete: function (res) {
          // console.log(res.status)
        }
      });
    })
  }
}