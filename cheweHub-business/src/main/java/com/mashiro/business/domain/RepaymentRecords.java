package com.mashiro.business.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import java.math.BigDecimal;
import java.util.Date;
import lombok.Data;

/**
 * 还款记录表
 * @TableName repayment_records
 */
@TableName(value ="repayment_records")
@Data
public class RepaymentRecords {
    /**
     * 记录ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 计划ID（可为空，表示单笔还款）
     */
    private Long planId;

    /**
     * 还款日期
     */
    private Date repaymentDate;

    /**
     * 还款金额
     */
    private BigDecimal amount;

    /**
     * 还款笔数
     */
    private Integer count;

    /**
     * 记录类型：1-计划还款，2-单笔还款
     */
    private Integer recordType;

    /**
     * 状态：0-已取消，1-正常，2-已还款
     */
    private Integer status;

    /**
     * 备注
     */
    private String remark;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;
}