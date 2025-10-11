package com.mashiro.business.mapper;

import com.mashiro.business.domain.RepaymentPlans;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mashiro.business.domain.RepaymentRecords;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
* @author mashiro
* @description 针对表【repayment_plans(还款计划表)】的数据库操作Mapper
* @createDate 2025-10-03 01:21:44
* @Entity com.mashiro.domain.RepaymentPlans
*/
public interface RepaymentPlansMapper extends BaseMapper<RepaymentPlans> {
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
     * 删除还款计划
     *
     * @param id 还款计划主键
     * @return 结果
     */
    public int deleteRepaymentPlansById(Long id);

    /**
     * 批量删除还款计划
     *
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteRepaymentPlansByIds(Long[] ids);

    /**
     * 批量删除还款记录
     *
     * @param ids 需要删除的数据主键集合
     * @return 结果
     */
    public int deleteRepaymentRecordsByPlanIds(Long[] ids);

    /**
     * 批量新增还款记录
     *
     * @param repaymentRecordsList 还款记录列表
     * @return 结果
     */
    public int batchRepaymentRecords(List<RepaymentRecords> repaymentRecordsList);


    /**
     * 通过还款计划主键删除还款记录信息
     *
     * @param id 还款计划ID
     * @return 结果
     */
    public int deleteRepaymentRecordsByPlanId(Long id);

    // ==================== 前端日历页面专用方法 ====================

    /**
     * 查询所有还款记录用于日历显示
     *
     * @return 还款记录列表
     */
    public List<RepaymentRecords> selectAllRepaymentRecords();

    /**
     * 新增单笔还款记录
     *
     * @param repaymentRecord 还款记录
     * @return 结果
     */
    public int insertRepaymentRecord(RepaymentRecords repaymentRecord);

    /**
     * 批量新增或更新还款记录
     *
     * @param repaymentRecords 还款记录列表
     * @return 结果
     */
    public int batchInsertOrUpdateRepaymentRecords(List<RepaymentRecords> repaymentRecords);

    /**
     * 根据日期和金额删除还款记录
     *
     * @param repaymentDate 还款日期
     * @param amount 金额
     * @return 结果
     */
    public int deleteRepaymentRecordByDateAndAmount(@Param("repaymentDate") String repaymentDate, @Param("amount") Double amount);

    /**
     * 获取还款统计数据
     *
     * @return 统计数据
     */
    public Map<String, Object> getRepaymentStatistics();

    /**
     * 获取月度汇总数据
     *
     * @return 月度汇总数据
     */
    public List<Map<String, Object>> getMonthlyTotals();

    /**
     * 根据日期和金额查询还款记录
     *
     * @param repaymentDate 还款日期
     * @param amount 金额
     * @return 还款记录
     */
    public RepaymentRecords selectRepaymentRecordByDateAndAmount(@Param("repaymentDate") String repaymentDate, @Param("amount") Double amount);

    /**
     * 清空所有还款记录
     *
     * @return 结果
     */
    public int deleteAllRepaymentRecords();

    RepaymentPlans getStartAndEndDate();
}




