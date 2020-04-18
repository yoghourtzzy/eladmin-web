export default  function(dateStr, pattern = "") {
  // 根据给定的时间字符串，得到特定的时间
  var dt = new Date(dateStr)

  //   yyyy-mm-dd
  var y = dt.getFullYear()
  var m = dt.getMonth() + 1
  var d = dt.getDate()

  // return y + '-' + m + '-' + d
  if (pattern.toLowerCase() === 'yyyy-mm-dd') {
    return `${y}-${m}-${d}`
  } else {
    var hh = dt.getHours()
    var mm = dt.getMinutes()
    var ss = dt.getSeconds()

    return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`
  }
}
