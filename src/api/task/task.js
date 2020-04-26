import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/task',
    method: 'post',
    data
  })
}

export function deltask(ids) {
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
    id
  })
}

export function grade(data) {
  return request({
    url: 'api/task/grade',
    method: 'put',
    data
  })
}


export default { add, edit, deltask,report,delreport,grade }
