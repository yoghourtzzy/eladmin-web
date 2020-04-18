import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/task',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/task/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/task',
    method: 'put',
    data
  })
}
export function report(data) {
  return request({
    url: 'api/task/report',
    method: 'post',
    data
  })
}

export function delreport(id) {
  return request({
    url: 'api/task/report',
    method: 'delete',
    data:id
  })
}


export default { add, edit, del,report,delreport }
