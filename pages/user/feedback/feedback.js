// pages/hudong/feedback/feedback.js
const app = getApp();
import {
  feedback_save
} from '../../../apis/api_service.js';

Page({
  data: {
    contact: '', // 联系方式，电话或邮箱
    content: '', // 具体的反馈意见
    isClick: false, // 限制多次重复点击
    max: 200, // 最多字数
    currentWordNumber: 0, // 当前输入的字数
  },

  // 反馈信息 
  inputs: function (e) {
    var len = parseInt(e.detail.value.length); // 获取输入框内容的长度
    // 最少字数限制
    if (len >= 1) {
      this.setData({
        content: e.detail.value,
        currentWordNumber: len // 当前字数  
      })
    }
  },

  // 手机号
  phoneNumber: function (e) {
    let that = this;
    that.setData({
      contact: e.detail.value,
    })
  },

  /**
   * 提交信息
   */
  submit() {
    let that = this
    let content = that.data.content
    let user_phone = that.data.contact
    if (content.length < 10) {
      wx.showToast({
        title: '留言信息不能少于10个字符',
        icon: 'none'
      });
    } else {
      if (user_phone=='') {
        wx.showToast({
          title: '联系方式不能为空',
          icon: 'none'
        });
      } else {
        /**
         * 准备就绪可以发请求
         */
        if (that.data.isClick) {
          return
        }
        that.data.isClick = true;
        feedback_save(content, user_phone).then(res => {
          console.log(res)
          that.data.isClick = false;
          that.setData({
            content: "",   // 清空留言内容
            contact: "",   // 清空联系方式
            currentWordNumber: 0
          })
          wx.showToast({
            title: '提交成功',
            icon: 'success',
          });
        }).catch(() => {
          that.data.isClick = false;
        })
      }
    }
  },

})