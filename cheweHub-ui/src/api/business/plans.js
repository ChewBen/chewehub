import request from '@/utils/request'

// 查询还款计划列表
export function listPlans(query) {
    return request({
        url: '/business/plans/list',
        method: 'get',
        params: query
    })
}

// 查询还款计划详细
export function getPlans(id) {
    return request({
        url: '/business/plans/' + id,
        method: 'get'
    })
}

// 新增还款计划
export function addPlans(data) {
    return request({
        url: '/business/plans',
        method: 'post',
        data: data
    })
}

// 修改还款计划
export function updatePlans(data) {
    return request({
        url: '/business/plans',
        method: 'put',
        data: data
    })
}

// 删除还款计划
export function delPlans(id) {
    return request({
        url: '/business/plans/' + id,
        method: 'delete'
    })
}

// ==================== 前端日历页面专用API ====================

// 获取日历数据
export function getCalendarData() {
    return request({
        url: '/business/plans/getPlanAndRecords',
        method: 'get'
    })
}

// 批量保存日历数据
export function saveCalendarData(data) {
    return request({
        url: '/business/plans/calendar-data',
        method: 'post',
        data: data
    })
}

// 生成还款计划
export function generatePlan(data) {
    return request({
        url: '/business/plans/generate-plan',
        method: 'post',
        data: data
    })
}

// 添加单笔还款记录
export function addSinglePayment(data) {
    return request({
        url: '/business/plans/add-single-payment',
        method: 'post',
        data: data
    })
}

// 删除还款记录
export function deleteCalendarRecord(date, amount) {
    return request({
        url: `/business/plans/calendar-record/${date}/${amount}`,
        method: 'delete'
    })
}

// 获取还款统计数据
export function getStatistics() {
    return request({
        url: '/business/plans/statistics',
        method: 'get'
    })
}



export function getStartAndEndDate() {
    return request({
        url: '/business/plans/getStartAndEndDate',
        method: 'get'
    })
}

// 标记还款记录为已还款
export function markAsPaid(data) {
    return request({
        url: '/business/plans/mark-as-paid',
        method: 'post',
        data: data
    })
}