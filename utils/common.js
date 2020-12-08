function formatSeconds(val) {
  var secondTime = parseInt(val); // 秒
  var minuteTime = 0; // 分
  if (secondTime > 60) { //如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60);
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60);
  }
  var result = "" + parseInt(secondTime);
  if (secondTime < 10) {
    result = "0" + parseInt(secondTime)
  }

  if (minuteTime < 10) {
    result = "0" + parseInt(minuteTime) + ":" + result;
  } else {
    result = "" + parseInt(minuteTime) + ":" + result;
  }
  return result;
}
export default {
  formatSeconds
}