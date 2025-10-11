package com.mashiro.business.controller;

import com.mashiro.business.domain.RepaymentPlans;
import com.mashiro.business.domain.dto.MarkAsPaidDTO;
import com.mashiro.business.service.RepaymentPlansService;
import com.mashiro.common.annotation.Log;
import com.mashiro.common.core.controller.BaseController;
import com.mashiro.common.core.domain.AjaxResult;
import com.mashiro.common.core.page.TableDataInfo;
import com.mashiro.common.enums.BusinessType;
import com.mashiro.common.utils.poi.ExcelUtil;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/business/plans")
public class RepaymentPlansController extends BaseController
{
    @Resource
    private RepaymentPlansService repaymentPlansService;


    @GetMapping("/list")
    public TableDataInfo list(RepaymentPlans repaymentPlans)
    {
        startPage();
        List<RepaymentPlans> list = repaymentPlansService.selectRepaymentPlansList(repaymentPlans);
        return getDataTable(list);
    }


    @Log(title = "还款计划", businessType = BusinessType.EXPORT)
    @PostMapping("/export")
    public void export(HttpServletResponse response, RepaymentPlans repaymentPlans)
    {
        List<RepaymentPlans> list = repaymentPlansService.selectRepaymentPlansList(repaymentPlans);
        ExcelUtil<RepaymentPlans> util = new ExcelUtil<RepaymentPlans>(RepaymentPlans.class);
        util.exportExcel(response, list, "还款计划数据");
    }


    @GetMapping(value = "/{id}")
    public AjaxResult getInfo(@PathVariable("id") Long id)
    {
        return success(repaymentPlansService.selectRepaymentPlansById(id));
    }


    @Log(title = "还款计划", businessType = BusinessType.INSERT)
    @PostMapping
    public AjaxResult add(@RequestBody RepaymentPlans repaymentPlans)
    {
        return toAjax(repaymentPlansService.addPaymentPlan(repaymentPlans));
    }

    /**
     * 修改还款计划
     */
    @Log(title = "还款计划", businessType = BusinessType.UPDATE)
    @PutMapping
    public AjaxResult edit(@RequestBody RepaymentPlans repaymentPlans)
    {
        return toAjax(repaymentPlansService.updateRepaymentPlans(repaymentPlans));
    }

    /**
     * 删除还款计划
     */
    @Log(title = "还款计划", businessType = BusinessType.DELETE)
	@DeleteMapping("/{ids}")
    public AjaxResult remove(@PathVariable Long[] ids)
    {
        try {
            int result = repaymentPlansService.deleteRepaymentPlansByIds(ids);
            if (result > 0) {
                return success("删除成功，共删除 " + result + " 条记录");
            } else {
                return error("删除失败，未找到对应的记录");
            }
        } catch (Exception e) {
            return error("删除失败：" + e.getMessage());
        }
    }

    // ==================== 前端日历页面专用API ====================

    /**
     * 获取日历数据 - 返回前端需要的格式 [["2025-08-01", 5000, 1], ...]
     */
    @GetMapping("/calendar-data")
    public AjaxResult getCalendarData()
    {
        List<RepaymentPlans> calendarData = repaymentPlansService.getCalendarData();
        return success(calendarData);
    }

    /**
     * 批量保存日历数据
     */
    @PostMapping("/calendar-data")
    public AjaxResult saveCalendarData(@RequestBody List<Object[]> calendarData)
    {
        try {
            int result = repaymentPlansService.saveCalendarData(calendarData);
            return success("保存成功，共处理 " + result + " 条记录");
        } catch (Exception e) {
            return error("保存失败：" + e.getMessage());
        }
    }

    /**
     * 生成还款计划并返回日历数据
     */
    @PostMapping("/generate-plan")
    public AjaxResult generatePlan(@RequestBody RepaymentPlans params)
    {
        //try {
        //    Integer paymentDay = (Integer) params.get("paymentDay");
        //    Integer totalCount = (Integer) params.get("totalCount");
        //    Double amountPerPeriod = (Double) params.get("amountPerPeriod");
        //
        //    List<Object[]> calendarData = repaymentPlansService.generatePlanData(paymentDay, totalCount, amountPerPeriod.doubleValue());
        //    return success(calendarData);
        //} catch (Exception e) {
        //    return error("生成计划失败：" + e.getMessage());
        //}
        return null;
    }

    /**
     * 添加单笔还款记录
     */
    @PostMapping("/add-single-payment")
    public AjaxResult addSinglePayment(@RequestBody RepaymentPlans repaymentPlans)
    {

       repaymentPlansService.addSinglePayment(repaymentPlans);
       return success("添加成功");
    }

    /**
     * 删除还款记录
     */
    @DeleteMapping("/calendar-record/{date}/{amount}")
    public AjaxResult deleteCalendarRecord(@PathVariable String date, @PathVariable String amount)
    {
        try {
            int result = repaymentPlansService.deleteCalendarRecord(date, Double.parseDouble(amount));
            return success("删除成功");
        } catch (Exception e) {
            return error("删除失败：" + e.getMessage());
        }
    }

    /**
     * 获取还款统计数据
     */
    @GetMapping("/statistics")
    public AjaxResult getStatistics()
    {
        try {
            Map<String, Object> statistics = repaymentPlansService.getStatistics();
            return success(statistics);
        } catch (Exception e) {
            return error("获取统计数据失败：" + e.getMessage());
        }
    }

    /**
     * 获取月度汇总数据
     */
    @GetMapping("/monthly-totals")
    public AjaxResult getMonthlyTotals()
    {
        try {
            Map<String, Object> monthlyTotals = repaymentPlansService.getMonthlyTotals();
            return success(monthlyTotals);
        } catch (Exception e) {
            return error("获取月度数据失败：" + e.getMessage());
        }
    }

    @GetMapping("/getPlanAndRecords")
    public AjaxResult getPlanAndRecords() {
        return success(repaymentPlansService.getPlanAndRecords());
        
    }

    /**
     * 用于图表展示，获取还款计划的开始和结束日期
     * @return {@link AjaxResult }
     */
    @GetMapping("/getStartAndEndDate")
    public AjaxResult  getStartAndEndDate() {
        return success(repaymentPlansService.getStartAndEndDate());
        
    }

    /**
     * 标记还款记录为已还款
     */
    @PostMapping("/mark-as-paid")
    public AjaxResult markAsPaid(@RequestBody MarkAsPaidDTO markAsPaidDTO) {
        try {
            String date = markAsPaidDTO.getDate();
            Double amount = markAsPaidDTO.getAmount().doubleValue();
            
            int result = repaymentPlansService.markAsPaid(date, amount);
            if (result > 0) {
                return success("标记已还款成功");
            } else {
                return error("未找到对应的还款记录");
            }
        } catch (Exception e) {
            return error("标记失败：" + e.getMessage());
        }
    }

    /**
     * 检查还款计划是否存在
     */
    @GetMapping("/check/{id}")
    public AjaxResult checkPlanExists(@PathVariable Long id) {
        try {
            RepaymentPlans plan = repaymentPlansService.selectRepaymentPlansById(id);
            if (plan != null) {
                return success( plan);
            } else {
                return error("记录不存在，ID: " + id);
            }
        } catch (Exception e) {
            return error("检查失败：" + e.getMessage());
        }
    }
}
