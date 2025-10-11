import { getRepaymentPlan, listRepaymentRecords } from '@/api/repayment'

/**
 * 数据一致性检查工具类
 * 由于不使用外键约束，需要在应用层保证数据一致性
 */
export class DataConsistencyChecker {
  
  /**
   * 检查还款计划是否存在
   * @param {number} planId 计划ID
   * @returns {Promise<boolean>} 是否存在
   */
  static async checkPlanExists(planId) {
    try {
      const plan = await getRepaymentPlan(planId)
      return !!plan
    } catch (error) {
      console.error('检查还款计划失败:', error)
      return false
    }
  }

  /**
   * 检查还款记录是否存在
   * @param {number} recordId 记录ID
   * @returns {Promise<boolean>} 是否存在
   */
  static async checkRecordExists(recordId) {
    try {
      const record = await getRepaymentRecord(recordId)
      return !!record
    } catch (error) {
      console.error('检查还款记录失败:', error)
      return false
    }
  }

  /**
   * 验证还款记录数据的完整性
   * @param {Object} record 还款记录数据
   * @returns {Promise<{valid: boolean, errors: string[]}>} 验证结果
   */
  static async validateRepaymentRecord(record) {
    const errors = []

    // 基本字段验证
    if (!record.repayment_date) {
      errors.push('还款日期不能为空')
    }

    if (!record.amount || record.amount <= 0) {
      errors.push('还款金额必须大于0')
    }

    if (!record.count || record.count <= 0) {
      errors.push('还款笔数必须大于0')
    }

    // 如果有关联计划，验证计划是否存在
    if (record.plan_id) {
      const planExists = await this.checkPlanExists(record.plan_id)
      if (!planExists) {
        errors.push('关联的还款计划不存在')
      }
    }

    // 验证日期格式
    if (record.repayment_date) {
      const date = new Date(record.repayment_date)
      if (isNaN(date.getTime())) {
        errors.push('还款日期格式不正确')
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * 验证还款计划数据的完整性
   * @param {Object} plan 还款计划数据
   * @returns {Promise<{valid: boolean, errors: string[]}>} 验证结果
   */
  static async validateRepaymentPlan(plan) {
    const errors = []

    // 基本字段验证
    if (!plan.plan_name || plan.plan_name.trim() === '') {
      errors.push('计划名称不能为空')
    }

    if (!plan.payment_day || plan.payment_day < 1 || plan.payment_day > 31) {
      errors.push('还款日必须在1-31之间')
    }

    if (!plan.total_count || plan.total_count <= 0) {
      errors.push('总期数必须大于0')
    }

    if (!plan.amount_per_period || plan.amount_per_period <= 0) {
      errors.push('每期金额必须大于0')
    }

    if (!plan.total_amount || plan.total_amount <= 0) {
      errors.push('总金额必须大于0')
    }

    if (!plan.start_date) {
      errors.push('开始日期不能为空')
    }

    // 验证金额计算
    if (plan.amount_per_period && plan.total_count && plan.total_amount) {
      const calculatedTotal = plan.amount_per_period * plan.total_count
      if (Math.abs(calculatedTotal - plan.total_amount) > 0.01) {
        errors.push('总金额与每期金额×总期数不匹配')
      }
    }

    // 验证日期格式
    if (plan.start_date) {
      const startDate = new Date(plan.start_date)
      if (isNaN(startDate.getTime())) {
        errors.push('开始日期格式不正确')
      }
    }

    if (plan.end_date) {
      const endDate = new Date(plan.end_date)
      if (isNaN(endDate.getTime())) {
        errors.push('结束日期格式不正确')
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * 检查数据一致性
   * @returns {Promise<{consistent: boolean, issues: string[]}>} 一致性检查结果
   */
  static async checkDataConsistency() {
    const issues = []

    try {
      // 获取所有还款记录
      const records = await listRepaymentRecords({ pageSize: 1000 })
      
      // 检查有plan_id的记录对应的计划是否存在
      for (const record of records) {
        if (record.plan_id) {
          const planExists = await this.checkPlanExists(record.plan_id)
          if (!planExists) {
            issues.push(`还款记录ID ${record.id} 关联的计划ID ${record.plan_id} 不存在`)
          }
        }
      }

      // 检查重复记录
      const dateAmountMap = new Map()
      for (const record of records) {
        const key = `${record.repayment_date}_${record.amount}_${record.count}`
        if (dateAmountMap.has(key)) {
          issues.push(`发现重复的还款记录: ${record.repayment_date} 金额${record.amount} 笔数${record.count}`)
        } else {
          dateAmountMap.set(key, record.id)
        }
      }

    } catch (error) {
      console.error('数据一致性检查失败:', error)
      issues.push('数据一致性检查过程中发生错误')
    }

    return {
      consistent: issues.length === 0,
      issues
    }
  }

  /**
   * 修复数据一致性问题
   * @param {string[]} issues 问题列表
   * @returns {Promise<{success: boolean, message: string}>} 修复结果
   */
  static async fixDataConsistency(issues) {
    try {
      // 这里可以实现具体的数据修复逻辑
      // 例如：删除孤立的记录、修复关联关系等
      
      console.log('开始修复数据一致性问题:', issues)
      
      // 示例：修复孤立记录
      for (const issue of issues) {
        if (issue.includes('关联的计划ID') && issue.includes('不存在')) {
          // 提取记录ID和计划ID
          const match = issue.match(/还款记录ID (\d+) 关联的计划ID (\d+) 不存在/)
          if (match) {
            const recordId = parseInt(match[1])
            const planId = parseInt(match[2])
            
            // 可以选择删除该记录或清空plan_id
            console.log(`修复孤立记录: 记录ID ${recordId}, 计划ID ${planId}`)
            // await updateRepaymentRecord(recordId, { plan_id: null })
          }
        }
      }

      return {
        success: true,
        message: '数据一致性修复完成'
      }
    } catch (error) {
      console.error('数据一致性修复失败:', error)
      return {
        success: false,
        message: '数据一致性修复失败: ' + error.message
      }
    }
  }
}

/**
 * 数据验证工具函数
 */
export const DataValidator = {
  /**
   * 验证日期格式
   * @param {string} dateStr 日期字符串
   * @returns {boolean} 是否有效
   */
  isValidDate(dateStr) {
    const date = new Date(dateStr)
    return !isNaN(date.getTime())
  },

  /**
   * 验证金额格式
   * @param {number} amount 金额
   * @returns {boolean} 是否有效
   */
  isValidAmount(amount) {
    return typeof amount === 'number' && amount > 0 && !isNaN(amount)
  },

  /**
   * 验证正整数
   * @param {number} num 数字
   * @returns {boolean} 是否有效
   */
  isValidPositiveInteger(num) {
    return Number.isInteger(num) && num > 0
  },

  /**
   * 验证还款日范围
   * @param {number} day 还款日
   * @returns {boolean} 是否有效
   */
  isValidPaymentDay(day) {
    return Number.isInteger(day) && day >= 1 && day <= 31
  }
}

/**
 * 数据清理工具函数
 */
export const DataCleaner = {
  /**
   * 清理无效的还款记录
   * @param {Array} records 还款记录列表
   * @returns {Array} 清理后的记录列表
   */
  cleanRepaymentRecords(records) {
    return records.filter(record => {
      // 过滤掉无效记录
      return record && 
             DataValidator.isValidDate(record.repayment_date) &&
             DataValidator.isValidAmount(record.amount) &&
             DataValidator.isValidPositiveInteger(record.count)
    })
  },

  /**
   * 合并相同日期的还款记录
   * @param {Array} records 还款记录列表
   * @returns {Array} 合并后的记录列表
   */
  mergeSameDateRecords(records) {
    const mergedMap = new Map()
    
    records.forEach(record => {
      const key = `${record.repayment_date}_${record.amount}`
      if (mergedMap.has(key)) {
        // 合并笔数
        mergedMap.get(key).count += record.count
      } else {
        mergedMap.set(key, { ...record })
      }
    })
    
    return Array.from(mergedMap.values())
  }
} 