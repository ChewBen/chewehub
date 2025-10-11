package com.mashiro.business.domain;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

/**
 * 
 * @TableName t_work_record
 */
@TableName(value ="t_work_record")
@Data
public class WorkRecord {
    /**
     * 
     */
    @TableId
    private Integer id;

    /**
     * 
     */
    private String workRecord;
}