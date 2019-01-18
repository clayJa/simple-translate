//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    fromLanguage: wx.getStorageSync('fromLanguage') || app.globalData.fromLanguage,
    toLanguage: wx.getStorageSync('fromLanguage') || app.globalData.toLanguage,
    canClear: false
  },
  //事件处理函数
  bindViewTap: function() {
  },
  onLoad: function () {
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
