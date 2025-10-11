package com.mashiro.business.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.mashiro.business.domain.WorkReport;
import org.apache.ibatis.annotations.Mapper;

/**
 * 工作日报Mapper接口
 */
@Mapper
public interface WorkReportMapper extends BaseMapper<WorkReport> {
}
