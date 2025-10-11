package com.mashiro.business.service;

import com.mashiro.business.domain.RepaymentPlans;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;
import java.util.Map;

/**
* @author mashiro
* @description 针对表【repayment_plans(还款计划表)】的数据库操作Service
* @createDate 2025-10-03 01:21:44
*/
public interface RepaymentPlansService extends IService<RepaymentPlans> {

    /**
     * 查询还款计划
     *
     * @param id 还款计划主键
     * @return 还款计划
     */
    public RepaymentPlans selectRepaymentPlansById(Long id);

    /**
     * 查询还款计划列表
     *
     * @param repaymentPlans 还款计划
     * @return 还款计划集合
     */
    public List<RepaymentPlans> selectRepaymentPlansList(RepaymentPlans repaymentPlans);

    /**
     * 新增还款计划
     *
     * @param repaymentPlans 还款计划
     * @return 结果
     */
    public int insertRepaymentPlans(RepaymentPlans repaymentPlans);

    /**
     * 修改还款计划
     *
     * @param repaymentPlans 还款计划
     * @return 结果
     */
    public int updateRepaymentPlans(RepaymentPlans repaymentPlans);

    /**
     * 批量删除还款计划
     *
     * @param ids 需要删除的还款计划主键集合
     * @return 结果
     */
    public int deleteRepaymentPlansByIds(Long[] ids);

    /**
     * 删除还款计划信息
     *
     * @param id 还款计划主键
     * @return 结果
     */
    public int deleteRepaymentPlansById(Long id);

    // ==================== 前端日历页面专用方法 ====================

    /**
     * 获取日历数据
     *
     * @return 日历数据列表，格式: [["2025-08-01", 5000, 1], ...]
     */
    public List<RepaymentPlans> getCalendarData();

    /**
     * 批量保存日历数据
     *
     * @param calendarData 日历数据
     * @return 处理的记录数
     */
    public int saveCalendarData(List<Object[]> calendarData);

    /**
     * 生成还款计划数据
     *
     * @param paymentDay 还款日
     * @param totalCount 总期数
     * @param amountPerPeriod 每期金额
     * @return 日历数据列表
     */
    public List<Object[]> generatePlanData(Integer paymentDay, Integer totalCount, Double amountPerPeriod);

    /**
     * 添加单笔还款记录

     * @return 结果
     */
    public int addSinglePayment(RepaymentPlans repaymentPlans);

    /**
     * 删除还款记录
     *
     * @param dateStr 还款日期字符串
     * @param amount 还款金额
     * @return 结果
     */
    public int deleteCalendarRecord(String dateStr, Double amount);

    /**
     * 获取还款统计数据
     *
     * @return 统计数据
     */
    public Map<String, Object> getStatistics();

    /**
     * 获取月度汇总数据
     *
     * @return 月度汇总数据
     */
    public Map<String, Object> getMonthlyTotals();

    Integer addPaymentPlan(RepaymentPlans repaymentPlans);

    List<RepaymentPlans>  getPlanAndRecords();

    RepaymentPlans getStartAndEndDate();

    /**
     * 标记还款记录为已还款
     * @param date 还款日期
     * @param amount 还款金额
     * @return 更新记录数
     */
    int markAsPaid(String date, Double amount);
}
