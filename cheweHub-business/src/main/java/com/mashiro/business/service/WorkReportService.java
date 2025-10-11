package com.mashiro.business.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.mashiro.business.domain.WorkReport;

/**
 * 工作日报服务接口
 */
public interface WorkReportService extends IService<WorkReport> {
    
    /**
     * 保存或更新工作日报
     * @param workReport 工作日报对象
     * @return 操作结果
     */
    boolean saveOrUpdateReport(WorkReport workReport);
    
    /**
     * 根据报告ID获取工作日报
     * @param reportId 报告ID
     * @return 工作日报对象
     */
    WorkReport getReportById(String reportId);
}
