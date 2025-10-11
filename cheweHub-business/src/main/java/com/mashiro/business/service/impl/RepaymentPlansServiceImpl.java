package com.mashiro.business.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mashiro.business.domain.RepaymentPlans;
import com.mashiro.business.domain.RepaymentRecords;
import com.mashiro.business.service.RepaymentPlansService;
import com.mashiro.business.mapper.RepaymentPlansMapper;
import com.mashiro.business.service.RepaymentRecordsService;
import com.mashiro.common.utils.StringUtils;
import com.mashiro.common.utils.uuid.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
* @author mashiro
* @description 针对表【repayment_plans(还款计划表)】的数据库操作Service实现
* @createDate 2025-10-03 01:21:44
*/
@Service
public class RepaymentPlansServiceImpl extends ServiceImpl<RepaymentPlansMapper, RepaymentPlans>
    implements RepaymentPlansService{
    @Autowired
    private RepaymentPlansMapper repaymentPlansMapper;

    @Autowired
    private RepaymentRecordsService recordsService;

    /**
     * 查询还款计划
     *
     * @param id 还款计划主键
     * @return 还款计划
     */
    @Override
    public RepaymentPlans selectRepaymentPlansById(Long id) {
        return repaymentPlansMapper.selectRepaymentPlansById(id);
    }

    /**
     * 查询还款计划列表
     *
     * @param repaymentPlans 还款计划
     * @return 还款计划
     */
    @Override
    public List<RepaymentPlans> selectRepaymentPlansList(RepaymentPlans repaymentPlans) {
        return repaymentPlansMapper.selectRepaymentPlansList(repaymentPlans);
    }

    /**
     * 新增还款计划
     *
     * @param repaymentPlans 还款计划
     * @return 结果
     */
    @Transactional
    @Override
    public int insertRepaymentPlans(RepaymentPlans repaymentPlans) {
        int rows = repaymentPlansMapper.insertRepaymentPlans(repaymentPlans);
        insertRepaymentRecords(repaymentPlans);
        return rows;
    }

    /**
     * 修改还款计划
     *
     * @param repaymentPlans 还款计划
     * @return 结果
     */
    @Transactional
    @Override
    public int updateRepaymentPlans(RepaymentPlans repaymentPlans) {
        repaymentPlansMapper.deleteRepaymentRecordsByPlanId(repaymentPlans.getId());
        insertRepaymentRecords(repaymentPlans);
        return repaymentPlansMapper.updateRepaymentPlans(repaymentPlans);
    }

    /**
     * 批量删除还款计划
     *
     * @param ids 需要删除的还款计划主键
     * @return 结果
     */
    @Transactional
    @Override
    public int deleteRepaymentPlansByIds(Long[] ids) {
        if (ids == null || ids.length == 0) {
            throw new IllegalArgumentException("删除ID不能为空");
        }
        
        // 先检查记录是否存在
        for (Long id : ids) {
            RepaymentPlans plan = repaymentPlansMapper.selectRepaymentPlansById(id);
            if (plan == null) {
                throw new RuntimeException("还款计划不存在，ID: " + id);
            }
        }
        
        // 删除关联的还款记录
        int deletedRecords = repaymentPlansMapper.deleteRepaymentRecordsByPlanIds(ids);
        System.out.println("删除了 " + deletedRecords + " 条还款记录");
        
        // 删除还款计划
        int deletedPlans = repaymentPlansMapper.deleteRepaymentPlansByIds(ids);
        System.out.println("删除了 " + deletedPlans + " 条还款计划");
        
        if (deletedPlans == 0) {
            throw new RuntimeException("删除还款计划失败，可能记录不存在或已被删除");
        }
        
        return deletedPlans;
    }

    /**
     * 删除还款计划信息
     *
     * @param id 还款计划主键
     * @return 结果
     */
    @Transactional
    @Override
    public int deleteRepaymentPlansById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("删除ID不能为空");
        }
        
        // 先检查记录是否存在
        RepaymentPlans plan = repaymentPlansMapper.selectRepaymentPlansById(id);
        if (plan == null) {
            throw new RuntimeException("还款计划不存在，ID: " + id);
        }
        
        // 删除关联的还款记录
        int deletedRecords = repaymentPlansMapper.deleteRepaymentRecordsByPlanId(id);
        System.out.println("删除了 " + deletedRecords + " 条还款记录");
        
        // 删除还款计划
        int deletedPlans = repaymentPlansMapper.deleteRepaymentPlansById(id);
        System.out.println("删除了 " + deletedPlans + " 条还款计划");
        
        if (deletedPlans == 0) {
            throw new RuntimeException("删除还款计划失败，可能记录不存在或已被删除");
        }
        
        return deletedPlans;
    }

    /**
     * 新增还款记录信息
     *
     * @param repaymentPlans 还款计划对象
     */
    public void insertRepaymentRecords(RepaymentPlans repaymentPlans) {
        List<RepaymentRecords> repaymentRecordsList = repaymentPlans.getRepaymentRecordsList();
        Long id = repaymentPlans.getId();
        if (StringUtils.isNotNull(repaymentRecordsList)) {
            List<RepaymentRecords> list = new ArrayList<RepaymentRecords>();
            for (RepaymentRecords repaymentRecords : repaymentRecordsList) {
                repaymentRecords.setPlanId(id);
                list.add(repaymentRecords);
            }
            if (list.size() > 0) {
                repaymentPlansMapper.batchRepaymentRecords(list);
            }
        }
    }

    // ==================== 前端日历页面专用方法实现 ====================

    /**
     * 获取日历数据
     *
     * @return 日历数据列表，格式: [["2025-08-01", 5000, 1], ...]
     */
    @Override
    public List<RepaymentPlans> getCalendarData() {
        return lambdaQuery().eq(RepaymentPlans::getStatus, 1).list();
    }

    /**
     * 批量保存日历数据
     *
     * @param calendarData 日历数据
     * @return 处理的记录数
     */
    @Transactional
    @Override
    public int saveCalendarData(List<Object[]> calendarData) {
        if (calendarData == null || calendarData.isEmpty()) {
            return 0;
        }

        // 先清空现有数据
        repaymentPlansMapper.deleteAllRepaymentRecords();

        List<RepaymentRecords> records = new ArrayList<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (Object[] data : calendarData) {
            try {
                RepaymentRecords record = new RepaymentRecords();
                record.setRepaymentDate(sdf.parse((String) data[0]));
                record.setAmount(BigDecimal.valueOf((Double) data[1]));
                record.setCount((Integer) data[2]);
                record.setRecordType(2); // 2-单笔还款
                record.setStatus(1); // 1-正常
                records.add(record);
            } catch (ParseException e) {
                throw new RuntimeException("日期格式错误: " + data[0], e);
            }
        }

        if (!records.isEmpty()) {
            return repaymentPlansMapper.batchInsertOrUpdateRepaymentRecords(records);
        }

        return 0;
    }

    /**
     * 生成还款计划数据
     *
     * @param paymentDay      还款日
     * @param totalCount      总期数
     * @param amountPerPeriod 每期金额
     * @return 日历数据列表
     */
    @Override
    public List<Object[]> generatePlanData(Integer paymentDay, Integer totalCount, Double amountPerPeriod) {
        List<Object[]> planData = new ArrayList<>();

        if (paymentDay == null || paymentDay < 1 || paymentDay > 31 ||
                totalCount == null || totalCount < 1 ||
                amountPerPeriod == null || amountPerPeriod <= 0) {
            throw new IllegalArgumentException("参数不合法");
        }

        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for (int i = 0; i < totalCount; i++) {
            // 计算还款日期
            calendar.set(Calendar.DAY_OF_MONTH, paymentDay);
            calendar.add(Calendar.MONTH, i);

            // 如果还款日超过了当月的天数，调整为当月最后一天
            int lastDayOfMonth = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
            if (paymentDay > lastDayOfMonth) {
                calendar.set(Calendar.DAY_OF_MONTH, lastDayOfMonth);
            }

            Object[] item = new Object[3];
            item[0] = sdf.format(calendar.getTime()); // 日期字符串
            item[1] = amountPerPeriod; // 金额
            item[2] = 1; // 笔数
            planData.add(item);
        }

        return planData;
    }

    /**
     * 添加单笔还款记录
     *
     * @param repaymentPlans 还款计划信息
     * @return 结果
     */
    @Transactional
    @Override
    public int addSinglePayment(RepaymentPlans repaymentPlans) {
        // 检查必要参数
        if (repaymentPlans.getRepaymentDate() == null && repaymentPlans.getAmount() == null) {
            throw new IllegalArgumentException("还款日期和金额不能为空");
        }

        try {
            Date repaymentDate = repaymentPlans.getRepaymentDate();
            BigDecimal amount = repaymentPlans.getAmount();

            // 如果金额为空，尝试从amountPerPeriod获取
            if (amount == null && repaymentPlans.getAmountPerPeriod() != null) {
                amount = repaymentPlans.getAmountPerPeriod();
            }

            if (amount == null) {
                throw new IllegalArgumentException("还款金额不能为空");
            }

            // 1. 创建还款计划（开始和结束都是还款日）
            RepaymentPlans plan = new RepaymentPlans();
            plan.setPlanName("单笔还款-" + new SimpleDateFormat("yyyy-MM-dd").format(repaymentDate));
            plan.setPaymentDay(repaymentDate.getDate()); // 从还款日期获取日
            plan.setTotalCount(1); // 总期数为1
            plan.setAmountPerPeriod(amount); // 每期金额
            plan.setTotalAmount(amount); // 总金额
            plan.setStartDate(repaymentDate); // 开始日期为还款日
            plan.setEndDate(repaymentDate); // 结束日期为还款日
            plan.setStatus(1); // 状态为正常
            plan.setDescription("单笔还款计划");

            // 保存还款计划
            save(plan);

            // 2. 创建还款记录
            RepaymentRecords record = new RepaymentRecords();
            record.setPlanId(plan.getId());
            record.setRepaymentDate(repaymentDate);
            record.setAmount(amount);
            record.setCount(1); // 笔数为1
            record.setRecordType(1); // 1-计划还款
            record.setStatus(1); // 1-正常
            // 不设置ID，让数据库自动生成

            // 保存还款记录
            recordsService.save(record);

            return 1;
        } catch (Exception e) {
            throw new RuntimeException("添加单笔还款失败: " + e.getMessage(), e);
        }
    }

    /**
     * 删除还款记录
     *
     * @param dateStr 还款日期字符串
     * @param amount  还款金额
     * @return 结果
     */
    @Transactional
    @Override
    public int deleteCalendarRecord(String dateStr, Double amount) {
        if (StringUtils.isEmpty(dateStr) || amount == null) {
            throw new IllegalArgumentException("参数不合法");
        }

        return repaymentPlansMapper.deleteRepaymentRecordByDateAndAmount(dateStr, amount);
    }

    /**
     * 获取还款统计数据
     *
     * @return 统计数据
     */
    @Override
    public Map<String, Object> getStatistics() {
        Map<String, Object> statistics = repaymentPlansMapper.getRepaymentStatistics();
        if (statistics == null) {
            statistics = new HashMap<>();
            statistics.put("totalAmount", 0.0);
            statistics.put("totalCount", 0);
            statistics.put("totalRecords", 0);
        }
        return statistics;
    }

    /**
     * 获取月度汇总数据
     *
     * @return 月度汇总数据
     */
    @Override
    public Map<String, Object> getMonthlyTotals() {
        List<Map<String, Object>> monthlyData = repaymentPlansMapper.getMonthlyTotals();
        Map<String, Object> result = new HashMap<>();

        for (Map<String, Object> monthData : monthlyData) {
            String month = (String) monthData.get("month");
            Double totalAmount = (Double) monthData.get("totalAmount");
            result.put(month, totalAmount);
        }

        return result;
    }

    @Override
    public Integer addPaymentPlan(RepaymentPlans repaymentPlans) {
        BigDecimal totalAmount = repaymentPlans.getAmountPerPeriod().multiply(BigDecimal.valueOf(repaymentPlans.getTotalCount()));
        repaymentPlans.setTotalAmount(totalAmount);
        repaymentPlans.setStatus(1); // 默认状态为1（正常）

        // 使用用户指定的首笔还款时间
        Date firstPaymentDate = repaymentPlans.getFirstPaymentDate();
        if (firstPaymentDate == null) {
            throw new IllegalArgumentException("首笔还款时间不能为空");
        }

        // 从首笔还款时间中提取还款日
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(firstPaymentDate);
        Integer paymentDay = calendar.get(Calendar.DAY_OF_MONTH);
        repaymentPlans.setPaymentDay(paymentDay);

        // 设置开始日期为首笔还款时间
        repaymentPlans.setStartDate(firstPaymentDate);

        // 计算结束日期：首笔还款时间 + (总期数-1)个月
        Calendar endCalendar = Calendar.getInstance();
        endCalendar.setTime(firstPaymentDate);
        endCalendar.add(Calendar.MONTH, repaymentPlans.getTotalCount().intValue() - 1);
        repaymentPlans.setEndDate(endCalendar.getTime());

        save(repaymentPlans);

        // 生成还款记录
        RepaymentRecords toAddRecord = new RepaymentRecords();
        toAddRecord.setPlanId(repaymentPlans.getId());
        toAddRecord.setAmount(repaymentPlans.getAmountPerPeriod());
        toAddRecord.setRecordType(1);
        toAddRecord.setStatus(1);

        // 从首笔还款时间开始，每月同一天生成还款记录
        Calendar recordCalendar = Calendar.getInstance();
        recordCalendar.setTime(firstPaymentDate);

        for (int i = 0; i < repaymentPlans.getTotalCount(); i++) {
            if (i > 0) {
                // 从第二期开始，每月加1个月
                recordCalendar.add(Calendar.MONTH, 1);
            }

            Date payTime = recordCalendar.getTime();

            // 创建新的记录对象，让数据库自动生成ID
            RepaymentRecords record = new RepaymentRecords();
            record.setPlanId(repaymentPlans.getId());
            record.setAmount(repaymentPlans.getAmountPerPeriod());
            record.setRecordType(1);
            record.setStatus(1);
            record.setRepaymentDate(payTime);
            record.setCount(i + 1); // 设置期数，从1开始
            
            recordsService.save(record);
        }

        return 1;
    }

    @Override
    public List<RepaymentPlans>  getPlanAndRecords() {
        List<RepaymentPlans> planList = lambdaQuery().eq(RepaymentPlans::getStatus, 1).list();
        if (planList.isEmpty()) {
            return null;
        }else {
            for (RepaymentPlans repaymentPlans : planList) {
                List<RepaymentRecords> records = recordsService.lambdaQuery()
                        .eq(RepaymentRecords::getPlanId, repaymentPlans.getId())
                        .list();
                repaymentPlans.setRepaymentRecordsList(records);
            }
        }
        return planList;
    }

    @Override
    public RepaymentPlans getStartAndEndDate() {
        return repaymentPlansMapper.getStartAndEndDate();
    }

    @Override
    public int markAsPaid(String date, Double amount) {
        // 根据日期和金额查找对应的还款记录
        LambdaQueryWrapper<RepaymentRecords> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(RepaymentRecords::getRepaymentDate, date)
                   .eq(RepaymentRecords::getAmount, amount)
                   .eq(RepaymentRecords::getStatus, 1); // 只更新状态为1（正常）的记录
        
        RepaymentRecords record = recordsService.getOne(queryWrapper);
        if (record != null) {
            record.setStatus(2); // 设置为已还款状态
            return recordsService.updateById(record) ? 1 : 0;
        }
        return 0;
    }

}




