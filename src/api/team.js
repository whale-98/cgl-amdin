import request from '@/utils/request'

export function getTeamList(data) {
  return request({
    url: '/cglback/team/achievement',
    method: 'post',
    data
  })
}

export function achievementdetail(data) {
  return request({
    url: '/cglback/team/achievementdetail',
    method: 'post',
    data
  })
}
