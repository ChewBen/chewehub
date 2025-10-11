package com.mashiro.business.controller;

import com.mashiro.business.domain.WorkReport;
import com.mashiro.business.service.WorkReportService;
import com.mashiro.common.core.controller.BaseController;
import com.mashiro.common.core.domain.AjaxResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 工作日报控制器
 */
@RestController
@RequestMapping("/business/work-report")
public class WorkReportController extends BaseController {

    @Autowired
    private WorkReportService workReportService;

    /**
     * 保存工作日报
     */
    @PostMapping("/save")
    public AjaxResult saveWorkReport(@RequestBody Map<String, Object> requestData) {
        try {
            String reportId = (String) requestData.get("reportId");
            String weekStartDate = (String) requestData.get("weekStartDate");
            String weekEndDate = (String) requestData.get("weekEndDate");
            String reportContent = (String) requestData.get("reportContent");

            WorkReport workReport = new WorkReport();
            workReport.setReportId(reportId);
            workReport.setWeekStartDate(java.sql.Date.valueOf(weekStartDate));
            workReport.setWeekEndDate(java.sql.Date.valueOf(weekEndDate));
            workReport.setReportContent(reportContent);
            workReport.setCreateBy(getUsername());

            boolean result = workReportService.saveOrUpdateReport(workReport);
            
            if (result) {
                return success("工作日报保存成功");
            } else {
                return error("工作日报保存失败");
            }
        } catch (Exception e) {
            return error("保存失败：" + e.getMessage());
        }
    }

    /**
     * 获取工作日报
     */
    @GetMapping("/get/{reportId}")
    public AjaxResult getWorkReport(@PathVariable String reportId) {
        try {
            WorkReport workReport = workReportService.getReportById(reportId);
            if (workReport != null) {
                return success(workReport);
            } else {
                return error("未找到对应的工作日报");
            }
        } catch (Exception e) {
            return error("获取失败：" + e.getMessage());
        }
    }
}
