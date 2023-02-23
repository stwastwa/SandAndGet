// pages/index2/index2.js
const app=getApp();
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userInfo: {},
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      canIUseGetUserProfile: false,
      canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
      sdata: '',
      rdata: '此处显示接收到的信息',
      t:null,
      userIp:"",
      // ifSend:false,//判断是否正在接收，节流阀
      // ifGet:false,//判断是否正在接收，节流阀
      history:[],
      //滚动条
      step: 2, // 滚动速度
      distance: 360, // 初始滚动距离
      space: 300,
      interval: 30 ,// 时间间隔
  },

 
  gotoInput() {//前往发送指令页面
    if(app.globalData.islogin!=true){
      wx.showToast({//用户未登录
        title: "请先登录",
        icon:"error"
      })
      return
    }
    console.log('跳转指令页面')
    // var time=this.formatTime();
    // console.log(time);
    wx.navigateTo({
      url: '/pages/index2/inputSend/inputSend'
    })
  },
  gotoHelp(){//前往教程页面
    console.log('跳转教程页面')
    wx.navigateTo({
      url: '/pages/index2/help/help'
    })
  },
  setInputValue: function(e){//废弃函数
    // this.data.sdata = e.detail.value;
  },
  //throttle用于节流，防止重复点击；
  ifsendData:util.throttle(function (e){
    if(app.globalData.islogin!=true){//如果未登录
      wx.showToast({//用户未登录
        title: "请先登录",
        icon:"error"
      })
      return
    }
    wx.showLoading({
      title: "发送中",//发送提示
    })
    this.sendData();//向设备发送数据
    wx.hideLoading();
  },500),
  sendData(){//向设备发送信息
    this.getsdata();//从页面读取需要发送的数据
    var that=this;
    console.log(this.data.sdata); 
    wx.request({
      url: 'http://'+app.globalData.userIp+this.data.sdata,
      data: {
        // sdata:this.data.sdata
      },
      method: 'Get',
      success:function(e){
        console.log(e.data)  
        that.SaveDataToCloud("发送",that.data.sdata,"成功");//将这条记录传至云端
        wx.showToast({//用户未登录
          title: "发送成功",
          icon:"success"
        })
      },
      fail:function(e){
        console.log('发送失败')
        var  failmessage="错误信息";
        console.log(e)
        // that.setData({
        //   ifSend:false
        // }) 
        wx.showModal({
          title: '发送失败',
          content: '请检查ip地址',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        that.SaveDataToCloud("发送",that.data.sdata,"失败")//将这条记录发到云端
      }
    })
  },
  getsdata(){//得到需要发送的数据
    console.log(app.globalData.Sdata);
    this.setData({
      sdata:app.globalData.Sdata
    });
  },
  SaveDataToCloud(e1,e2,e3){//发送记录到云端
    var time=util.formatTime();//引入util中关于计算系统时间的组件
    var that=this;
    wx.cloud.database().collection("history")
    .add({
      data:{
        time:time,
        ip:app.globalData.userIp,
        SorR:e1,
        message:e2,
        ifsuccess:e3,
        signature:app.globalData.userInfo.signature
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
    
  },
  // reqForSensor(){//废弃函数，估计有用
  //   var t = this.getData;
  //   setInterval(t, 500);
  //   // this.getData()
  // }, ifsendData:util.throttle(function (e){
  ifgetData:util.throttle(function (e){//函数节流，防止滚动机制多次触发，极其重要！！！！！
    if(app.globalData.islogin!=true){//如果未登录
      wx.showToast({//用户未登录
        title: "请先登录",
        icon:"error"
      })
      return
    }
    wx.showLoading({
      title: "接收中",//发送提示
    })
    this.getData();//接收设备发送的数据
    wx.hideLoading();
  },500),

  getData(){//得到设备发送的命令
    var that=this
    wx.request({
    //注意修改url！
      url: 'http://'+app.globalData.userIp+'/getData',
      method: 'Get',
      success:function(e){
        console.log(e.data.value);
        that.setData({
          rdata: e.data.value,
          // ifGet:false
        }) 
        that.SaveDataToCloud("接收",that.data.rdata,"成功")//将这条记录发到云端
        wx.showToast({//用户未登录
          title: "接收成功",
          icon:"success"
        })
      },
      fail:function(e){
        console.log('发送失败')
        console.log(e)
        // that.setData({
        //   ifGet:false
        // }) 
        wx.showModal({
          title: '接收失败',
          content: '请检查ip地址',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        that.SaveDataToCloud("接收",that.data.rdata,"失败")//将这条记录发到云端
      }
    })
  },
  bindViewTap() {//废弃函数
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  scroll:util.throttle(function (e){
    // scroll(){//滑动文本
      var that = this;
      var query = wx.createSelectorQuery();
      // 选择id
      query.select('#mjltest').boundingClientRect();
      query.exec(function(res) {
        console.log(res)
        var length = res[0].width;
        var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
        that.setData({
          length: length,
          windowWidth: windowWidth,
          space:windowWidth
        });
        that.scrollling(); // 第一个字消失后立即从右边出现
      })
    
  },114514000000000),//scroll为回调函数，只需要在页面启动时触发一次就好，无需多次触发。
  
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