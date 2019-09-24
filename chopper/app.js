//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var that = this;

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: that.globalData.domainName + that.globalData.projectName + '/login',
          method: "post",
          header: {
            "content-type": "application/x-www-form-urlencoded"
          },
          data: {
            code: res.code
          },
          success: function(res) {
            console.log(res);
            if (res.data.code == 200){
              // 登陆成功
              getApp().globalData.token = res.data.data.token;
              that.globalData.uid = res.data.data.customerId;
              console.log("2" + that.globalData.token);
              that.syncUserInfo();
            }else {
              // 登陆错误
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return;
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  syncUserInfo: function () {
    var that = this;
    var userInfo = that.globalData.userInfo; 
    wx.request({
      url: that.globalData.domainName + that.globalData.projectName + '/sync/user/info',
      method: "post",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        client_session_key: that.globalData.token,
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl,
        gender: userInfo.gender,//性别 0：未知、1：男、2：女
        province: userInfo.province,
        city: userInfo.city,
        country: userInfo.country
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 200) {
          // 同步成功
          console.log("2" + that.globalData.token);
        } else {
          // 登陆错误
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '同步用户信息错误，请重试',
            showCancel: false
          })
          return;
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    domainName: "http://127.0.0.1/",
    projectName: "onshop", 
    token: null
  }
})