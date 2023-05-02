import request from '@/utils/request'

// 一级团队业绩下载
export function achievementDownload(data) {
  return request({
    url: '/cglback/team/achievementdownload',
    method: 'post',
    data
  })
}

// 顾问业绩下载
export function performanceDownload(data) {
  return request({
    url: '/cglback/staff/download',
    method: 'post',
    data
  })
}

// 职业变动下载
export function titleChangeDownload(data) {
  return request({
    url: '/cglback/staff/titlechange/download',
    method: 'post',
    data
  })
}
