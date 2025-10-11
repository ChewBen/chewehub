package com.mashiro.business.controller;

import com.mashiro.business.service.WorkRecordService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author ：Mashiro
 * @ClassName WorkRecordController
 * @date ：Created in 2025/10/6 23:21
 * @description：TODO
 * @version: 1.0
 */
@RestController
@RequestMapping("/business/workRecord")
public class WorkRecordController {
    @Resource
    private WorkRecordService workRecordService;
}
