import { base_url } from "../apis/globalData";

const app = getApp();
/**
 * 防止重复点击 防抖节流
 */
var oldtime = '';

function preventclick(msc) {
  if (oldtime == '') {
    oldtime = new Date().getTime();
    return true;
  } else {
    var newtime = new Date().getTime();
    if (newtime - oldtime > msc) {
      oldtime = new Date().getTime();
      return true;
    } else {
      return false;
    }
  }
}



function formatDate(timestamp, option = "YY-MM-DD hh-mm") {
  var date = new Date(timestamp);
  var year = date.getFullYear()
  var month = function () {
    return date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
  }
  var day = function () {
    return date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  }
  var hour = function () {
    return date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  }

  var minute = function () {
    return date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  }

  var second = function () {
    return date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  }

  var week = function () {
    var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    return weeks[date.getDay()];
  }
  //获取 年月日
  if (option == 'YY-MM-DD hh-mm') return year + "-" + month() + "-" + day() + " " + hour() + ":" + minute();

  //获取 年月日
  if (option == 'YY-MM-DD') return year + "-" + month() + "-" + day();

  //获取年月
  if (option == 'YY-MM') return year + "-" + month();

  //获取年
  if (option == 'YY') return year;

  //获取月
  if (option == 'MM') return month();

  //获取日
  if (option == 'DD') return day();

  //获取昨天
  if (option == 'yesterday') return day() * 1 - 1;

  //获取时分秒
  if (option == 'hh-mm-ss') return hour() + ":" + minute() + ":" + second();

  //获取时分
  if (option == 'hh-mm') return hour() + ":" + minute();

  //获取分秒
  if (option == 'mm-ss') return minute() + ":" + second();

  //获取分
  if (option == 'mm') return minute();

  //获取秒
  if (option == 'ss') return second();

  //获取星期几
  if (option == 'week') return week();

  //默认时分秒年月日
  return year + '-' + month + '-' + day + ' ' + hour() + ':' + minute() + ":" + second();
}

//-------------------

/* 
字符串 转 对象
aaa=1&bb=2&cc=3 to {aaa:1,bb:2,cc:3,}
*/

function toObj(str) {
  let strArr = str.split("&");
  var opt = new Object();
  for (var i = 0; i < strArr.length; i++) {
    opt[strArr[i].split('=')[0]] = unescape(strArr[i].split('=')[1])
  }
  return opt
}

/**
 * 获取微信客户端基础库版本
 */
function compareVersion(v2) {
  var v1 = wx.getSystemInfoSync().SDKVersion;
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
}

/**
 * 微信登录
 */
function login(avatar, nickname) {
  return new Promise((resolve, reject) => {
    wxGetCode().then(res => userLogin(res, avatar, nickname)).then(res => {
      resolve(res)
    }).catch(error => {
      reject(error)
    })
  })
}

function wxGetCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        resolve(res.code)
        console.log("code值" + res.code);
      },
      fail: function (msg) {
        reject(msg);
        console.info(msg);
      }
    });
  })
}

function userLogin(code, avatar, nickname) {
  wx.request({
    url: base_url + "/api/users/login_mini",
    data: {
      p: 'wxmini',
      code: code,
      avatar: avatar,
      nickname: nickname,
    },
    method: 'POST',
    header: {
      'Accept': 'application/json' // 默认值
    },
    success: function (res) {
      console.log("token值" + res.data.data.api_token + "== 登录成功==");
      var api_token = res.data.data.api_token;
      wx.setStorage({
        key: "api_token",
        data: api_token,
      });
      wx.setStorage({
        data: res.data.data.openid,
        key: 'openid',
      })
      let userInfo = {
        nickName: res.data.data.nickname,
        avatarUrl: res.data.data.avatar,
      }
      wx.setStorage({
        data: userInfo,
        key: 'userInfo',
      })
      app.globalData.openid = res.data.data.openid
      app.globalData.api_token = api_token;
    },
    fail: msg => {
      wx.showModal({
        title: '服务器繁忙，请稍后再试',
        showCancel: false,
      });
      console.log(msg);
    }
  });
}



module.exports = {
  preventclick: preventclick,
  formatDate,
  compareVersion,
  toObj,
  login
}