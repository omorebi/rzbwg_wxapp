// 小程序开发api接口统一配置

import {
  base_url,
  showLoading,
  hideLoading
} from "globalData";

//常见http错误码列表
const HTTP_ERR_CODE_LIST = {
  [400]: "请求错误",
  [401]: "未授权，请登录",
  [403]: "拒绝访问",
  [404]: "请求地址出错",
  [408]: "请求超时",
  [500]: "服务器内部错误",
  [501]: "服务未实现",
  [502]: "网关错误",
  [503]: "服务不可用",
  [504]: "网关超时",
  [505]: "HTTP版本不受支持"
}

//业务接口错误码列表
const API_ERR_CODE_LIST = {
  [404]: "接口未定义",
  [405]: "登录失效，请重新登录",
}

//业务响应success白名单
const API_SUCCESS_CODE_LIST = [1, 9001, 9002]
const request = (url, method, data, isToken = false, isLoading = true, isToast = true) => {
  let _url = base_url + url;
  if (!data.p) {
    data.p = 'wx';
  };
  if (isLoading) {
    showLoading();
  }
  let header = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  if (isToken) { //是否需要登录
    header.Authorization = wx.getStorageSync('jtoken') || ''
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: header,
      timeout: '8000',
      success(request) {
        if (request.data.status == 1) {
          hideLoading()
          resolve(request.data)
        } else if (request.data.status == 405) {
          hideLoading()
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else if (request.data.status == 9001) {
          //未注册用户  如果是在注册也返回请求结果 如果是其他页面 跳转至注册页面
          if (getCurrentPages()[getCurrentPages().length - 1].route.indexOf("pages/login/login") > -1) {
            resolve(request.data)
          } else {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
          hideLoading()
        } else {
          console.log("asdasdasd", request)
          hideLoading()
          if (isToast) {
            wx.showToast({
              title: request.data.msg || "网络开小差了~ 错误代码:" + request.statusCode,
              icon: 'none'
            })
          }
          reject(request)
        }
      },
      fail(error) {
        if (!getApp().globalData.isConnected) {
          wx.showToast({
            title: "当前网络不给力，请稍后再试~",
            icon: 'none'
          })
        }
        hideLoading()
        if (error && error.response) {
          const errCode = +error.response.status //错误码
          const errMsg = HTTP_ERR_CODE_LIST[errCode] || '请求错误' //错误消息
          showLoading(errMsg)
          console.log('请求出错状态', {
            errCode,
            errMsg
          })
        }
        reject(error)
      },
    })
  })
}


const appRequest = (url, method, data, isToken = false) => {
  let _url = base_url + url;
  if (!data.p) {
    data.p = 'wxmini';
  };

  showLoading();
  let header = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  if (isToken) { //是否需要登录
    header.Authorization = wx.getStorageSync('jtoken') || ''
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: header,
      timeout: '8000',
      success(request) {
        if (request.data.status == 1) {
          resolve(request.data)
        } else if (request.data.status == 405) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else if (request.data.status == 9001) {
          resolve(request.data)
        } else {
          console.log("asdasdasd")
          wx.showToast({
            title: request.data.msg || "404",
            icon: 'none'
          })
          reject(request)
        }
      },
      fail(error) {
        if (!getApp().globalData.isConnected) {
          wx.showToast({
            title: "当前网络不给力，请稍后再试~",
            icon: 'none'
          })
        }
        if (error && error.response) {
          const errCode = +error.response.status //错误码
          const errMsg = HTTP_ERR_CODE_LIST[errCode] || '请求错误' //错误消息
          showLoading(errMsg)
          console.log('请求出错状态', {
            errCode,
            errMsg
          })
        }
        reject(error)
      },
      complete(aaa) {
        hideLoading()
        // 加载完成
      }
    })
  })
}



/**
 * 小程序的uploadFile
 * url-- 请求路径
 * file--文件地址
 * name--接收文件的键值
 * data--请求中其他额外的 form data
 */

const uploadFile = (url, file, name, data, isToken = false, isLoading = true) => {
  let _url = base_url + url;
  if (!data.p) {
    data.p = 'wxmini';
  };
  if (isLoading) {
    showLoading();
  }
  let header = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  if (isToken) { //是否需要登录
    header.Authorization = wx.getStorageSync('jtoken') || ''
  }
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: _url,
      filePath: file,
      name: name,
      formData: data,
      header: header,
      success(request) {
        request.data = JSON.parse(request.data)
        if (request.data.status == 1) {
          resolve(request.data)
        } else if (request.data.status == 405) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        } else if (request.data.status == 9001) {
          //未注册用户  如果是在注册也返回请求结果 如果是其他页面 跳转至注册页面
          if (getCurrentPages()[getCurrentPages().length - 1].route.indexOf("pages/login/index") > -1) {
            resolve(request.data)
          } else {
            wx.navigateTo({
              url: '/pages/login/login',
            })
          }
        } else {
          wx.showToast({
            title: request.data.msg || "404",
            icon: 'none'
          })
          reject(request)
        }
      },
      fail(error) {
        if (!getApp().globalData.isConnected) {
          wx.showToast({
            title: "当前网络不给力，请稍后再试~",
            icon: 'none'
          })
        }
        if (error && error.response) {
          const errCode = +error.response.status //错误码
          const errMsg = HTTP_ERR_CODE_LIST[errCode] || '请求错误' //错误消息
          showLoading(errMsg)
          console.log('请求出错状态', {
            errCode,
            errMsg
          })
        }
        reject(error)
      },
      complete() {
        hideLoading()
        // 加载完成
      }
    })
  })
}
/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {

          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}

module.exports = {
  request,
  appRequest,
  uploadFile
}