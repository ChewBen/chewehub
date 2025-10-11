import request from '@/utils/request'

// 保存工作日报
export function saveWorkReport(data) {
    return request({
        url: '/business/work-report/save',
        method: 'post',
        data: data
    })
}

// 获取工作日报
export function getWorkReport(reportId) {
    return request({
        url: `/business/work-report/get/${reportId}`,
        method: 'get'
    })
}
