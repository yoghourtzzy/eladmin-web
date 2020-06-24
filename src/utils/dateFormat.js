export default function(dateStr, fmt = "yyyy-MM-dd HH:mm:ss") {
  // 根据给定的时间字符串，得到特定的时间
  var dt = new Date(dateStr)
  var o = {
    "M+": dt.getMonth() + 1, //月份
    "d+": dt.getDate(), //日
    "H+": dt.getHours(), //小时
    "m+": dt.getMinutes(), //分
    "s+": dt.getSeconds(), //秒
    "q+": Math.floor((dt.getMonth() + 3) / 3), //季度
    "S": dt.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
