// app.js
App({
  globalData: {
    userInfo: {},
    islogin:false, //判断是否登录
    userIp:" ",
    Sdata:"",//需要发送的指令
    History:[]
    
  },
  onLaunch(){
    let userlogin=wx.getStorageSync('islogin')
    let user=wx.getStorageSync('user')
    // console.log(userlogin)
    this.globalData.islogin=userlogin//成功登陆
    this.globalData.userInfo=user
    console.log(this.globalData.islogin)
    wx.cloud.init({
      env:"cloud1-7g437xupe24169d5"
    })
  }
})
