import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/attendanceApply',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/attendanceApply/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/attendanceApply',
    method: 'put',
    data
  })
}

export function approve(data) {
  return request({
    url: 'api/attendanceApply/approve',
    method: 'put',
    data
  })
}



export default { add, edit, del,approve }
