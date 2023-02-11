function formatTime() {//获取当前时间
  var timestamp = Date.parse(new Date());
  var date = new Date(timestamp);
  //获取年份  
  var Y =date.getFullYear();
  //获取月份
  var M =date.getMonth()+1;
  //获取当前天
  var D = date.getDate();
  //获取当前小时
  var H = date.getHours();
  var Mi=date.getMinutes();
  var S=date.getSeconds();
  console.log("当前时间：" + Y + '年' + M +'月' + D +'日' + H+'时');
  return  Y + '年' + M +'月' + D +'日' + H+'时'+Mi+'分'+S+'秒';
}

//防止多次点击多次跳转（函数节流）
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
      gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
      let _nowTime = + new Date()
      if (_nowTime - _lastTime > gapTime || !_lastTime) {
          fn.apply(this, arguments)   //将this和参数传给原函数
          _lastTime = _nowTime
      }
  }
}

module.exports = {
  throttle: throttle,
  formatTime:formatTime
}
