// pages/login2/login2.
const util = require('../../utils/util.js')
const app=getApp();
const db=wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userimg: "/img/unlogin.png",
    username:"未登录",
    userIp1:"null",
    items1: [{//关于账号
      id: 0,
      name: '退出登录',
      icon: '/img/activity1.png'
    },
    {
      id: 1,
      name: '清除缓存',
      icon: '/img/shuazi.png',
    },
    
  ],
  items2: [{//个人信息
    id: 0,
    name: '设置个人资料',
    icon: '/img/userinformation.png'
  },
],
  items3: [{//关于账号
    id: 0,
    name: '开发者日志',
    icon: '/img/feedback.png'
},
  {
    id: 1,
    name: '关于我们',
    icon: '/img/aboutus.png',
  },

],

  },
  //关于账号部分的操作，throttle用于节流，防止多次点击
  setLog:util.throttle(function (e){
    var that=this;
    if(app.globalData.islogin!=true){
      wx.showToast({//用户未登录
        title: "请先登录",
        icon:"error"
      })
      return
    }
  if(e.target.id==0){//点击“退出登录”
    wx.showModal({
      title: '注意',
      content: '此举将导致你的账号退出登录',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.loginOut();//执行退出登录操作
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    }) 
  }
  if(e.target.id==1){
    wx.showModal({
      title: '警告',
      content: '此举将清除你的所有本地缓存，请谨慎点击',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.clear();//执行清楚缓存操作
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    }) 
    
  }
  },500),
  toLogin() {//用户点击登录
    var that=this;
    if(app.globalData.islogin==true){
      wx.showToast({//用户已经登陆了，在乱按
        title: "你已经登陆啦！",
        icon:"error"
      })
      return
    }
    wx.showModal({//弹窗询问是否授权
      title: '',
      content: '即将完成微信授权',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          that.keepLog();//登录
          wx.setStorageSync('islogin',app.globalData.islogin )//传输“已登录“状态至本地
        } else if (res.cancel) {
          console.log('用户点击取消')
          return
        }
    
      }
    })
  },
  keepLog(){
    var that=this;
    let user = wx.getStorageSync('user')//如果用户之前登陆过，先读取之前登录本地数据
    // let userip=wx.getStorageSync('userip')
    if(user){//本地数据存在，之前登陆过
      // app.globalData.userIp=userip
      app.globalData.islogin=true//转变为登录状态
      app.globalData.userInfo=user//将用户私人信息保存到公用数据
      console.log( app.globalData.islogin)
      this.setData({
        userInfo: user,
        username:user.nickName,
        userIp1:user.userIp,
        userimg:"/img/islogin.png"
      })
    }
    else{//之前没登陆过
      wx.getUserProfile({
        desc: '必须授权才可以继续使用',
        success: res => {
          let user = res.userInfo
          let sign = res.signature//用户的电子签名，用于判断用户的身份
          console.log(res)
          // 把用户信息缓存到本地
          that.setData({
            userInfo: user,
            username:user.nickName,
            userimg:"/img/islogin.png",
            "userInfo.signature":sign//把signature存入userInfo
        })
        app.globalData.userInfo=user//将用户私人信息保存到公用数据
        wx.setStorageSync('user', user)
        console.log("用户信息", user)
        app.globalData.islogin=true//转变为“已登录”传输至本地
          
        console.log(app.globalData.islogin)
        // that.data.userInfo["signature"] =
      },
        fail: res => {
          console.log('授权失败', res)
        }
      })
    }
    


  },
  loginOut() {
    app.globalData.islogin=false//退出登录
    console.log(app.globalData.islogin)
    this.setData({
      userInfo: '',
      username:"未登录",
      userIp1:"null",
      userimg:"/img/unlogin.png",
      
    })
    wx.setStorageSync('islogin',app.globalData.islogin )//传输“未登录”状态至本地
    
  },
  clear(){
    //清楚本地缓存
    app.globalData.islogin=null//退出登录
    app.globalData.Sdata=""
    console.log(app.globalData.islogin)
    this.setData({
      userInfo: '',
      username:"未登录",
      userIp1:"null",
      userimg:"/img/unlogin.png",
    })
    wx.setStorageSync('islogin', null)//清除登录状态
    wx.setStorageSync('user', null)//清除用户信息

    //清除云端记录
    db.collection("history")
      .where({//通过每个用户独特的signature，寻找到用户储存在云端的使用记录
        signature:app.globalData.userInfo.signature
      })
      .remove()
      .then(res =>{
        console.log("云端删除成功",res)
        
      })
     .catch(res =>{
      console.log("云端删除失败",res)
     })
    

  },
  setIP(){
    var that=this;
    if(app.globalData.islogin!=true){
      wx.showToast({//用户未登录
        title: "请先登录",
        icon:"error"
      })
      return
    }
    else{
      wx.showModal({
        title: '请输入IP地址',
        content: '',
        editable:true,
        complete: (res) => {
          if (res.cancel) {
          }
          if (res.confirm) {
            console.log(res.content);
            that.setData({
            userIp1:res.content,
            "userInfo.userIp":res.content//将userIp存入userInfo
            })
            app.globalData.userIp=res.content;//修改用户ip地址到公用数据
            console.log(app.globalData.userIp)
            wx.setStorageSync('user',that.data.userInfo)//更新用户信息用户ip地址到本地
            // let userip=wx.getStorageSync('userip')
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //读取本地数据
    let user = wx.getStorageSync('user')
    // let userip=wx.getStorageSync('userip')
    if(app.globalData.islogin==true){
      app.globalData.userIp=user.userIp
      console.log('进入小程序的index页面获取缓存', user)
      console.log(app.globalData.userIp)
      this.setData({
        userInfo: user,
        username:user.nickName,
        userIp1:app.globalData.userIp,
        userimg:"/img/islogin.png"

      })
    }
    
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
    // console.log(app.globalData.islogin)
    // wx.setStorageSync('islogin',app.globalData.islogin )
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    // console.log(app.globalData.islogin)
    // wx.setStorageSync('islogin',app.globalData.islogin )

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