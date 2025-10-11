package com.mashiro.business.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.util.Date;

/**
 * 工作日报表
 * @TableName work_report
 */
@TableName(value = "work_report")
@Data
public class WorkReport {
    /**
     * 日报ID（格式：年份+月份+开始日期，如20251006）
     */
    @TableId(type = IdType.INPUT)
    private String reportId;

    /**
     * 周开始日期（周一）
     */
    private Date weekStartDate;

    /**
     * 周结束日期（周五）
     */
    private Date weekEndDate;

    /**
     * 日报内容（JSON格式存储）
     */
    private String reportContent;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    /**
     * 创建人
     */
    private String createBy;

    /**
     * 更新人
     */
    private String updateBy;
}
