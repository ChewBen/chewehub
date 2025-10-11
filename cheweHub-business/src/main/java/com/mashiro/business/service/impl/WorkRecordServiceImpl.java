package com.mashiro.business.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.mashiro.business.domain.WorkRecord;
import com.mashiro.business.service.WorkRecordService;
import com.mashiro.business.mapper.WorkRecordMapper;
import org.springframework.stereotype.Service;

/**
* @author mashiro
* @description 针对表【t_work_record】的数据库操作Service实现
* @createDate 2025-10-06 23:19:18
*/
@Service
public class WorkRecordServiceImpl extends ServiceImpl<WorkRecordMapper, WorkRecord>
    implements WorkRecordService{

}




