/**
 * 单独抽离出来的登录逻辑~ 规规矩矩
 */
import { base_url } from "../apis/globalData";

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
            p: 'wx',
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
    login,
}