//index.js
import { translate } from '../../utils/api.js'
//获取应用实例
const app = getApp()

Page({
  data: {
    fromLanguage: wx.getStorageSync('fromLanguage') || app.globalData.fromLanguage,
    toLanguage: wx.getStorageSync('toLanguage') || app.globalData.toLanguage,
    canClear: false,
    changeFrom: false,
    changeTo: false,
    languageList: app.globalData.languageList,
    fromIconClass: 'icon-down',
    toIconClass: 'icon-down',
    query: '',
    result: []
  },
  onLoad: function( options) {
    console.log('onload..')
    let fromLanguage = this.data.languageList.find((item)=>{return item.index === +options.fromLanguage})
    let toLanguage = this.data.languageList.find((item)=>{return item.index === +options.toLanguage})
    if(options.query) {
      this.setData({ query: options.query,fromLanguage,toLanguage })
    }
    
  },
  onShow: function () {
    this.onConfirm()
  },
  //事件处理函数
  changeLanguage(e) {
    if(e.target.dataset.source === 'from'){
      this.setData({
        changeTo: false,
        toIconClass: 'icon-down',
        fromIconClass: this.data.fromIconClass === 'icon-down' ? 'icon-up' : 'icon-down',
        changeFrom: this.data.changeFrom ? false : true
      })
    } else if(e.target.dataset.source === 'to'){
      this.setData({
        changeFrom: false,
        fromIconClass: 'icon-down',
        toIconClass: this.data.toIconClass === 'icon-down' ? 'icon-up' : 'icon-down',
        changeTo: this.data.changeTo ? false : true
      })
    }
  },
  selectLanguage(e) {
    let index = e.target.dataset.index
    let selectLanguage = this.data.languageList.find((item)=>{return item.index === index})
    let key = e.target.dataset.lang
    wx.setStorageSync(key, selectLanguage)
    this.setData({
      fromLanguage: wx.getStorageSync('fromLanguage'),
      toLanguage: wx.getStorageSync('toLanguage'),
      changeFrom: false,
      changeTo: false,
      fromIconClass: 'icon-down',
      toIconClass: 'icon-down'
    })
    this.onConfirm()
  },
  exchangeLanguage(e) {
    let toLanguage = wx.getStorageSync('toLanguage')
    let fromLanguage = wx.getStorageSync('fromLanguage')
    wx.setStorageSync('fromLanguage', toLanguage)
    wx.setStorageSync('toLanguage', fromLanguage)
    this.setData({
      fromLanguage: toLanguage,
      toLanguage: fromLanguage
    })
    this.onConfirm()
  },
  onInput: function(e) {
    this.setData({'query': e.detail.value})
    if(this.data.query.length > 0) {
      this.setData({ canClear: true })
    }else{
      this.setData({ canClear: false })
    }
  },
  onTapClose: function() {
    this.setData({ query: '', canClear: false, result: []})
  },
  onConfirm: function() {
    if (!this.data.query) return
    translate(this.data.query, {from: this.data.fromLanguage.simpleCode, to: this.data.toLanguage.simpleCode}).then(res=>{
      this.setData({'result': res.trans_result})

      let history = wx.getStorageSync('history')||[]
      history.unshift({ query: this.data.query, result: res.trans_result[0].dst,toLanguage: this.data.toLanguage.index,fromLanguage: this.data.fromLanguage.index})
      history.length = history.length > 10 ? 10 : history.length
      wx.setStorageSync('history', history)
    })
  }
})
