package com.mashiro.business.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

/**
 * 还款计划表
 * @TableName repayment_plans
 */
@TableName(value ="repayment_plans")
@Data
public class RepaymentPlans {
    /**
     * 计划ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 计划名称
     */
    private String planName;

    /**
     * 还款日（1-31）
     */
    private Integer paymentDay;

    /**
     * 总期数
     */
    private Integer totalCount;

    /**
     * 每期金额
     */
    private BigDecimal amountPerPeriod;

    /**
     * 总金额
     */
    private BigDecimal totalAmount;

    /**
     * 开始日期
     */
    private Date startDate;

    /**
     * 结束日期
     */
    private Date endDate;

    /**
     * 状态：0-已取消，1-进行中，2-已完成
     */
    private Integer status;

    /**
     * 计划描述
     */
    private String description;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
    /** 还款记录信息 */
    @TableField(exist = false)
    private List<RepaymentRecords> repaymentRecordsList;

    /** 还款日期（用于单笔还款） */
    @JsonFormat(pattern = "yyyy-MM-dd")
    @TableField(exist = false)
    private Date repaymentDate;

    /** 还款金额（用于单笔还款） */
    @TableField(exist = false)
    private BigDecimal amount;

    /** 首笔还款时间 */
    @JsonFormat(pattern = "yyyy-MM-dd")
    @TableField(exist = false)
    private Date firstPaymentDate;
}