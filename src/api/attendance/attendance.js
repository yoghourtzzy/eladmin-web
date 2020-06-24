import request from '@/utils/request'
import dateFormat from "../../utils/dateFormat";

export function add(data) {
  return request({
    url: 'api/attendance',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/attendance/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/attendance',
    method: 'put',
    data
  })
}

export function checkin() {
  return request({
    url: 'api/attendance/checkin',
    method: 'post'
  })
}

export function checkout() {
  return request({
    url: 'api/attendance/checkout',
    method: 'post'
  })
}

export function queryToday(){
  return request({
    url:'api/attendance/findbydate?date='+dateFormat(new Date().valueOf(),"yyyy-MM-dd"),
    method:'get',
  })
}


export function queryAttendancs(fromDate,toDate) {
  return request({
    url: 'api/attendance/scale/?fromDate=' + dateFormat(fromDate.valueOf(), "yyyy-MM-dd")+'&'+ 'toDate=' + dateFormat(toDate.valueOf(),"yyyy-MM-dd"),
    method: 'get',
  })
}



export default { add, edit, del,checkin,checkout,queryToday,queryAttendancs}
