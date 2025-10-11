package com.mashiro.business.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mashiro.business.domain.WorkReport;
import com.mashiro.business.mapper.WorkReportMapper;
import com.mashiro.business.service.WorkReportService;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * 工作日报服务实现类
 */
@Service
public class WorkReportServiceImpl extends ServiceImpl<WorkReportMapper, WorkReport> implements WorkReportService {

    @Override
    public boolean saveOrUpdateReport(WorkReport workReport) {
        // 设置创建时间和更新时间
        Date now = new Date();
        
        // 检查是否已存在
        WorkReport existingReport = getById(workReport.getReportId());
        
        if (existingReport != null) {
            // 更新
            workReport.setUpdateTime(now);
            return updateById(workReport);
        } else {
            // 新增
            workReport.setCreateTime(now);
            workReport.setUpdateTime(now);
            return save(workReport);
        }
    }

    @Override
    public WorkReport getReportById(String reportId) {
        return getById(reportId);
    }
}
