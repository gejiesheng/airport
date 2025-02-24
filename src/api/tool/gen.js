import request from '@/utils/request'

// 查询当天历史通信记录
export function getlistHistory(query) {
  return request({
    url: '/communication/log/history',
    method: 'get',
    params: query
  })
}

//接受通话记录
export function receiveCommunication(data) {
  return request({
    url: '/communication/receive',
    method: 'post',
    data: data
  })
}

//查询跑道状态信息
export function getrunwayStatus(query) {
  return request({
    url: '/runway/status',
    method: 'get',
    params: query
  })
}

//获取视频直播流路径
export function getvideoUrl(query) {
  return request({
    url: '/video/url',
    method: 'get',
    params: query
  })
}

// 修改跑道状态信息
export function updaterunwayStatus(data) {
  return request({
    url: '/status/modify',
    method: 'post',
    data: data
  })
}

// 导入第二天航班信息
export function importcreateTable(data) {
  return request({
    url: '/flight/import',
    method: 'post',
    data: data
  })
}

//筛选通信记录
export function changeRecordList(query) {
  return request({
    url: '/communication/log/list',
    method: 'get',
    params: query
  })
}

// 删除表数据
export function delTable(tableId) {
  return request({
    url: '/tool/gen/' + tableId,
    method: 'delete'
  })
}


