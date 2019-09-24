// pages/main/main.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    banners: [],
    menuCategorys: [],
    activeCategoryId: 1,
    menuItems: []
  },

  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id
    });
    for (var i = 0; i < this.data.menuCategorys.length; i++){
      if (this.data.menuCategorys[i].categoryId == e.currentTarget.id){
        this.setData({
          menuItems: this.data.menuCategorys[i].menuItems,
        });
      }
    }
    // this.getGoodsList(this.data.activeCategoryId);
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("1234" + app.globalData.token);
    wx.request({
      url: app.globalData.domainName + app.globalData.projectName + '/banner/list',
      method: 'get',
      data: {
        client_session_key: app.globalData.token,
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log(res.data.data);
          that.setData({
            banners: res.data.data
          });
        } else {
          wx.showModal({
            title: '提示',
            content: '请在后台添加 banner 轮播图片',
            showCancel: false
          })
          
        }
      }
    })

    wx.request({
      url: app.globalData.domainName + app.globalData.projectName + '/menu/list',
      method: 'get',
      data: {
        client_session_key: app.globalData.token,
      },
      success: function (res) {
        if (res.data.code == 200) {
          console.log("a" + res.data.data);
          that.setData({
            menuCategorys: res.data.data,
          });

          if (res.data.data.length > 0){
            that.setData({
              menuItems: res.data.data[0].menuItems,
            });
          }
        } else {
          wx.showModal({
            title: '提示',
            content: '请在后台添加 banner 轮播图片',
            showCancel: false
          })

        }
      }
    })

  },

  toDetailsTap: function (e){
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})