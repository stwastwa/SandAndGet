// pages/logs/logs.js
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    islogin:null,
    history:[],
   //滚动条
   step: 0.5, // 滚动速度
   distance: 360, // 初始滚动距离
   space: 300,
   interval: 30 ,// 时间间隔
   total:0//每次查询获得数据的总数量

  },
  setHistory(){
    
    if(app.globalData.islogin!=true){//未登录
      wx.showToast({//用户未登录
        title: "请先登录",
        icon:"error"
      })
      return
    }
    this.getHistory();
    
  },
  getHistory(){ 
    var that=this; 
    wx.showLoading({ 
      title: '加载中...', 
    }) 
    let len=this.data.history.length 
    console.log("当前history长度",len) 
    wx.cloud.database().collection("history") .
      where(
        {
          signature:app.globalData.userInfo.signature//只读取本用户的数据
        }
      )
      .orderBy("time","desc") //按照时间倒叙排列
      .skip(len) //每次从上一次读取的数据之后开始读取
      .get() //拉取数据
      .then(res =>{ 
        console.log("请求成功",res) 
        let dataList=res.data 
        if(dataList.length<=0){ 
          wx.showToast({ 
            icon:"none", 
            title: '没有数据啦', 
          }) 
        } 
        that.setData({ 
          history:that.data.history.concat(res.data) 
        }) 
        wx.hideLoading(); 
      }) 
    .catch(res =>{ 
      console.log("请求失败",res) 
      wx.hideLoading(); 
    }) 
  }, 
      // 3,把组装好的数据一次性全部返回

    

    // 2，通过for循环做多次请求，并把多次请求的数据放到一个数组里
    // for (let i = 0; i <count; i += 20) { //自己设置每次获取数据的量
    // console.log(11)
    //  db.collection('history').where({
    //   signature:app.globalData.userInfo.signature
    // }).skip(i)
    // .get({success: function(res) {
    //   console.log(res.data)
    //   that.setData({
    //     history:res.data
    //   })
    //   }})}


      // }
      // 3,把组装好的数据一次性全部返回

 
    // wx.cloud.database().collection("history")
    //   .orderBy("time","desc")
    //   .skip(len)
    //   .get()
    //   .then(res =>{
    //     console.log("请求成功",res)
    //     let dataList=res.data
    //     if(dataList.length<=0){
    //       wx.showToast({
    //         icon:"none",
    //         title: '没有数据啦',
    //       })
    //     }
    //     that.setData({
    //       history:that.data.history.concat(res.data)
    //     })
    //     wx.hideLoading();
    //   })
    //  .catch(res =>{
    //   console.log("请求失败",res)
    //   wx.hideLoading();
    //  })

  scroll(){//滑动文本
    var that = this;
    var query = wx.createSelectorQuery();
    // 选择id
    query.select('#mjltest').boundingClientRect();
    query.exec(function(res) {
      var length = res[0].width;
      var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
      that.setData({
        length: length,
        windowWidth: windowWidth,
        space:windowWidth
      });
      that.scrollling(); // 第一个字消失后立即从右边出现
    })
  },
  scrollling: function() {//滑动文本具体参数设置
    var that = this;
    var length = that.data.length; // 滚动文字的宽度
    var windowWidth = that.data.windowWidth; // 屏幕宽度
    var interval = setInterval(function() {
      var maxscrollwidth = length + that.data.space;
      var left = that.data.distance;
      if (left < maxscrollwidth) { // 判断是否滚动到最大宽度
        that.setData({
          distance: left + that.data.step
        })
      } else {
        that.setData({
          distance: 0 // 直接重新滚动
        });
        clearInterval(interval);
        that.scrollling();
      }
    }, that.data.interval);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      // this.setData({
      // height:wx.getSystemInfoSync().windowHeight,
      // width:wx.getSystemInfoSync().windowWi
      // })
      // console.log(this.data.height)
      this.scroll();//启动滑动文本

  
      
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
    this.setData({
      islogin:app.globalData.islogin
    })
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