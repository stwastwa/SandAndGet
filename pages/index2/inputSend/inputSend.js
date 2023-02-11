// pages/index2/inputSend/inputSend.js
const app=getApp();
const util = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sdata:"",
    isSaving:false//节流阀，防止重复保存

  },
  bindTextAreaBlur: function(e) {//点到输入框外区域就会触发此函数
    console.log(e.detail.value)
    this.setData({
      sdata:e.detail.value
    }) 
  }, 
  ifsave:util.throttle(function (e){
    wx.showLoading({
      title: "保存中",
    })
    this.save();
    wx.hideLoading();
      wx.showToast({
        title: "保存成功",
        icon:"success",
        duration:500,
        complete:function(e){
          console.log(11)
        }
      })
    
    
  },1000),
  save(){
    var that=this;
    setTimeout(function () {
      console.log(that.sdata)
      app.globalData.Sdata=that.data.sdata;
      console.log(app.globalData.Sdata); 
      
      wx.hideToast();
     //要延时执行的代码
    }, 500) //延迟时间（这里是0.1秒），保证此函数在bindTextAreaBlur之后触发
    },
   

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  this.setData({
  sdata:app.globalData.Sdata
  })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})