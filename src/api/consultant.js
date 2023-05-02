import request from '@/utils/request'

export function getConsultantList(data) {
  return request({
    url: '/cglback/staff/yeji',
    method: 'post',
    data
  })
}

export function titlechange(data) {
  return request({
    url: '/cglback/staff/titlechange',
    method: 'post',
    data
  })
}

