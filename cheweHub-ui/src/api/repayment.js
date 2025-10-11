import request from '@/utils/request'

// 还款计划相关API
export function listRepaymentPlans(query) {
  return request({
    url: '/repayment/plans',
    method: 'get',
    params: query
  })
}

export function getRepaymentPlan(id) {
  return request({
    url: '/repayment/plans/' + id,
    method: 'get'
  })
}

export function addRepaymentPlan(data) {
  return request({
    url: '/repayment/plans',
    method: 'post',
    data: data
  })
}

export function updateRepaymentPlan(id, data) {
  return request({
    url: '/repayment/plans/' + id,
    method: 'put',
    data: data
  })
}

export function deleteRepaymentPlan(id) {
  return request({
    url: '/repayment/plans/' + id,
    method: 'delete'
  })
}

// 还款记录相关API
export function listRepaymentRecords(query) {
  return request({
    url: '/repayment/records',
    method: 'get',
    params: query
  })
}

export function getRepaymentRecord(id) {
  return request({
    url: '/repayment/records/' + id,
    method: 'get'
  })
}

export function addRepaymentRecord(data) {
  return request({
    url: '/repayment/records',
    method: 'post',
    data: data
  })
}

export function updateRepaymentRecord(id, data) {
  return request({
    url: '/repayment/records/' + id,
    method: 'put',
    data: data
  })
}

export function deleteRepaymentRecord(id) {
  return request({
    url: '/repayment/records/' + id,
    method: 'delete'
  })
}

// 批量添加还款记录（用于生成还款计划）
export function batchAddRepaymentRecords(data) {
  return request({
    url: '/repayment/records/batch',
    method: 'post',
    data: data
  })
}

// 统计相关API
export function getMonthlyStats(query) {
  return request({
    url: '/repayment/stats/monthly',
    method: 'get',
    params: query
  })
}

export function getRepaymentSummary() {
  return request({
    url: '/repayment/stats/summary',
    method: 'get'
  })
}

// 获取指定日期范围的还款记录
export function getRepaymentRecordsByDateRange(startDate, endDate) {
  return request({
    url: '/repayment/records/range',
    method: 'get',
    params: {
      startDate: startDate,
      endDate: endDate
    }
  })
}

// 获取指定月份的还款记录
export function getRepaymentRecordsByMonth(year, month) {
  return request({
    url: '/repayment/records/month',
    method: 'get',
    params: {
      year: year,
      month: month
    }
  })
}

// 数据导入导出
export function exportRepaymentData(query) {
  return request({
    url: '/repayment/export',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

export function importRepaymentData(data) {
  return request({
    url: '/repayment/import',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
} 