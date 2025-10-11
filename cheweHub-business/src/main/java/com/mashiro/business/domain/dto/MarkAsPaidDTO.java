package com.mashiro.business.domain.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * 标记已还款请求DTO
 * @author mashiro
 */
@Data
public class MarkAsPaidDTO {
    
    /**
     * 还款日期
     */
    private String date;
    
    /**
     * 还款金额
     */
    private BigDecimal amount;
}
