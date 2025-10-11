<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">工作日报</h1>
        <div class="flex items-center justify-between">
          <p class="text-gray-600">工作日报填报</p>
          <div class="flex items-center gap-4">
            <button
              @click="goToPreviousWeek"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              上一周
            </button>
            <button
              @click="showCustomDateModal = true"
              class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              选择日期
            </button>
            <button
              @click="goToCurrentWeek"
              class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              当前周
            </button>
            <span class="text-lg font-medium text-gray-700">
              {{ currentWeekRange }}
            </span>
            <button
              @click="goToNextWeek"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              下一周
            </button>
          </div>
        </div>
      </div>

      <!-- 工作日报表单 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="mb-6">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">本周工作内容：</h2>
          
          <div class="space-y-6">
            <div
              v-for="(day, index) in weekDays"
              :key="index"
              class="border-l-4 border-blue-500 pl-4"
            >
              <!-- 日期标题 -->
              <h3 class="text-lg font-medium text-gray-800 mb-3">
                {{ day.formattedDate }}
              </h3>
              
              <!-- 上午工作内容 -->
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  上午：
                </label>
                <input
                  v-model="day.report.morning"
                  @input="markAsChanged"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="请输入上午工作内容..."
                />
              </div>
              
              <!-- 下午工作内容 -->
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  下午：
                </label>
                <input
                  v-model="day.report.afternoon"
                  @input="markAsChanged"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                  placeholder="请输入下午工作内容..."
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex justify-center gap-4 pt-6 border-t border-gray-200">
          <button
            @click="saveAllReports"
            :disabled="loading"
            class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {{ loading ? '保存中...' : (hasUnsavedChanges ? '保存本周日报*' : '保存本周日报') }}
          </button>
          <button
            @click="loadWeekReports"
            :disabled="loading"
            class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            加载本周日报
          </button>
          <button
            @click="copyToClipboard"
            :disabled="loading"
            class="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            复制日报内容
          </button>
          <button
            @click="togglePreview"
            :disabled="loading"
            class="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
          >
            {{ showPreview ? '隐藏预览' : '显示预览' }}
          </button>
        </div>

        <!-- 保存状态 -->
        <div v-if="saved" class="mt-4 text-center">
          <span class="text-green-600 text-sm">✓ 本周日报已保存</span>
          <span v-if="lastSavedTime" class="text-gray-500 text-xs ml-2">
            ({{ lastSavedTime }})
          </span>
        </div>
        <div v-if="hasUnsavedChanges" class="mt-4 text-center">
          <span class="text-orange-600 text-sm">⚠ 有未保存的更改</span>
        </div>
        <div class="mt-2 text-center">
          <span class="text-gray-500 text-xs">提示：使用 Ctrl+S 快速保存</span>
        </div>
      </div>

      <!-- 预览区域 -->
      <div v-if="showPreview" class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">日报预览：</h3>
        <pre class="bg-gray-100 p-4 rounded-md text-sm text-gray-700 whitespace-pre-wrap">{{ previewContent }}</pre>
      </div>
    </div>

    <!-- 自定义日期选择弹窗 -->
    <div v-if="showCustomDateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <h3 class="text-xl font-bold text-gray-800 mb-4">选择日期</h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            选择该周的任意一天
          </label>
          <input
            v-model="customDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
          />
        </div>
        
        <div class="mb-4">
          <p class="text-sm text-gray-600">
            选择后，系统将自动显示该日期所在的工作周（周一到周五）
          </p>
        </div>
        
        <div class="flex gap-3">
          <button
            @click="applyCustomDate"
            :disabled="!customDate"
            class="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            确定
          </button>
          <button
            @click="showCustomDateModal = false"
            class="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { saveWorkReport, getWorkReport } from '@/api/business/workReport'

// 响应式数据
const currentWeekStart = ref(new Date())
const loading = ref(false)
const saved = ref(false)
const showPreview = ref(false)
const showCustomDateModal = ref(false)
const customDate = ref('')
const hasUnsavedChanges = ref(false)
const lastSavedTime = ref(null)

// 计算当前周的开始日期（周一）
const getWeekStart = (date) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // 调整周日为-6
  return new Date(d.setDate(diff))
}

// 格式化日期显示
const formatDate = (date) => {
  return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`
}

// 计算当前周的日期范围显示
const currentWeekRange = computed(() => {
  const start = getWeekStart(currentWeekStart.value)
  const end = new Date(start)
  end.setDate(start.getDate() + 4) // 周五
  
  return `${formatDate(start)} - ${formatDate(end)}`
})

// 计算本周5个工作日
const weekDays = computed(() => {
  const start = getWeekStart(currentWeekStart.value)
  const days = []
  
  for (let i = 0; i < 5; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    
    const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD格式
    
    days.push({
      date: dateStr,
      formattedDate: formatDate(date),
      report: {
        morning: '',
        afternoon: ''
      }
    })
  }
  
  return days
})

// 生成预览内容
const previewContent = computed(() => {
  let content = '本周工作内容：\n'
  
  weekDays.value.forEach(day => {
    content += `${day.formattedDate}\n`
    content += `上午：${day.report.morning || ''}\n`
    content += `下午：${day.report.afternoon || ''}\n`
    content += '\n'
  })
  
  return content
})

// 检查是否有未保存的更改
const checkUnsavedChanges = () => {
  if (hasUnsavedChanges.value) {
    return confirm('当前有未保存的更改，切换周次将丢失这些更改。是否继续？')
  }
  return true
}

// 切换到上一周
const goToPreviousWeek = () => {
  if (!checkUnsavedChanges()) return
  
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() - 7)
  currentWeekStart.value = newDate
  saved.value = false
  showPreview.value = false
  hasUnsavedChanges.value = false
  lastSavedTime.value = null
  loadWeekReports()
}

// 切换到下一周
const goToNextWeek = () => {
  if (!checkUnsavedChanges()) return
  
  const newDate = new Date(currentWeekStart.value)
  newDate.setDate(newDate.getDate() + 7)
  currentWeekStart.value = newDate
  saved.value = false
  showPreview.value = false
  hasUnsavedChanges.value = false
  lastSavedTime.value = null
  loadWeekReports()
}

// 生成报告ID（格式：年份+月份+开始日期，如20251006）
const generateReportId = (weekStartDate) => {
  const date = new Date(weekStartDate)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

// 验证日报数据
const validateReportData = () => {
  const hasContent = weekDays.value.some(day => 
    (day.report.morning && day.report.morning.trim()) || 
    (day.report.afternoon && day.report.afternoon.trim())
  )
  
  if (!hasContent) {
    return {
      valid: false,
      message: '请至少填写一天的工作内容'
    }
  }
  
  return { valid: true }
}

// 保存所有日报
const saveAllReports = async () => {
  // 数据验证
  const validation = validateReportData()
  if (!validation.valid) {
    alert(validation.message)
    return
  }
  
  loading.value = true
  try {
    // 获取当前周的周一日期
    const weekStart = getWeekStart(currentWeekStart.value)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 4) // 周五
    
    // 生成报告ID
    const reportId = generateReportId(weekStart)
    
    // 准备保存的数据
    const weekData = {
      weekRange: currentWeekRange.value,
      days: weekDays.value.map(day => ({
        date: day.date,
        formattedDate: day.formattedDate,
        morning: day.report.morning ? day.report.morning.trim() : '',
        afternoon: day.report.afternoon ? day.report.afternoon.trim() : ''
      }))
    }
    
    console.log('准备保存的日报数据:', {
      reportId,
      weekStartDate: weekStart.toISOString().split('T')[0],
      weekEndDate: weekEnd.toISOString().split('T')[0],
      reportContent: JSON.stringify(weekData)
    })
    
    // 调用API保存数据
    const response = await saveWorkReport({
      reportId: reportId,
      weekStartDate: weekStart.toISOString().split('T')[0],
      weekEndDate: weekEnd.toISOString().split('T')[0],
      reportContent: JSON.stringify(weekData)
    })
    
    if (response.code === 200) {
      saved.value = true
      hasUnsavedChanges.value = false
      lastSavedTime.value = formatSaveTime(new Date())
      showPreview.value = true
      
      // 使用更友好的提示方式
      const message = `工作日报保存成功！\n报告ID: ${reportId}\n周次: ${currentWeekRange.value}`
      alert(message)
      console.log('日报保存成功，ID:', reportId)
    } else {
      throw new Error(response.msg || '保存失败，请重试')
    }
    
  } catch (error) {
    console.error('保存日报失败:', error)
    
    // 更详细的错误处理
    let errorMessage = '保存失败'
    if (error.response) {
      // 服务器返回的错误
      errorMessage = error.response.data?.msg || error.response.statusText || '服务器错误'
    } else if (error.request) {
      // 网络错误
      errorMessage = '网络连接失败，请检查网络后重试'
    } else {
      // 其他错误
      errorMessage = error.message || '未知错误'
    }
    
    alert(`保存失败：${errorMessage}`)
  } finally {
    loading.value = false
  }
}

// 加载本周日报
const loadWeekReports = async () => {
  loading.value = true
  try {
    // 获取当前周的周一日期
    const weekStart = getWeekStart(currentWeekStart.value)
    const reportId = generateReportId(weekStart)
    
    console.log('加载本周日报:', {
      reportId,
      weekRange: currentWeekRange.value,
      weekStartDate: weekStart.toISOString().split('T')[0]
    })
    
    // 调用API获取数据
    const response = await getWorkReport(reportId)
    
    if (response.code === 200 && response.data) {
      // 解析保存的日报数据
      const savedData = JSON.parse(response.data.reportContent)
      console.log('从后端加载的日报数据:', savedData)
      
      // 填充表单数据
      if (savedData.days && Array.isArray(savedData.days)) {
        weekDays.value.forEach((day, index) => {
          const savedDay = savedData.days.find(d => d.date === day.date)
          if (savedDay) {
            day.report.morning = savedDay.morning || ''
            day.report.afternoon = savedDay.afternoon || ''
          }
        })
        
        // 标记为已保存状态
        saved.value = true
        hasUnsavedChanges.value = false
        lastSavedTime.value = formatSaveTime(new Date(response.data.createTime || response.data.updateTime))
        console.log('日报数据加载成功')
      }
    } else {
      // 没有找到已保存的数据，清空表单
      weekDays.value.forEach(day => {
        day.report.morning = ''
        day.report.afternoon = ''
      })
      saved.value = false
      hasUnsavedChanges.value = false
      lastSavedTime.value = null
      console.log('未找到已保存的日报数据')
    }
    
  } catch (error) {
    console.error('加载日报失败:', error)
    
    // 如果是404错误（未找到数据），这是正常的，不需要显示错误
    if (error.response && error.response.status === 404) {
      console.log('未找到该周的日报数据，这是正常的')
      // 清空表单
      weekDays.value.forEach(day => {
        day.report.morning = ''
        day.report.afternoon = ''
      })
      saved.value = false
      hasUnsavedChanges.value = false
      lastSavedTime.value = null
    } else {
      // 其他错误才显示给用户
      alert('加载日报失败：' + (error.message || '网络错误'))
    }
  } finally {
    loading.value = false
  }
}

// 复制日报内容到剪贴板
const copyToClipboard = async () => {
  try {
    // 生成当前内容的副本
    let content = '本周工作内容：\n'
    
    weekDays.value.forEach(day => {
      content += `${day.formattedDate}\n`
      content += `上午：${day.report.morning || ''}\n`
      content += `下午：${day.report.afternoon || ''}\n`
      content += '\n'
    })
    
    console.log('准备复制的内容:', content)
    console.log('当前weekDays数据:', weekDays.value)
    
    await navigator.clipboard.writeText(content)
    
    // 显示成功消息
    alert('日报内容已复制到剪贴板！')
    console.log('日报内容已复制到剪贴板')
  } catch (error) {
    console.error('复制失败:', error)
    alert('复制失败，请手动复制内容')
  }
}

// 切换预览显示
const togglePreview = () => {
  showPreview.value = !showPreview.value
}

// 应用自定义日期
const applyCustomDate = () => {
  if (customDate.value) {
    if (!checkUnsavedChanges()) return
    
    const selectedDate = new Date(customDate.value)
    currentWeekStart.value = selectedDate
    saved.value = false
    showPreview.value = false
    hasUnsavedChanges.value = false
    lastSavedTime.value = null
    showCustomDateModal.value = false
    customDate.value = ''
    loadWeekReports()
  }
}

// 回到当前周
const goToCurrentWeek = () => {
  currentWeekStart.value = new Date()
  saved.value = false
  showPreview.value = false
  hasUnsavedChanges.value = false
  lastSavedTime.value = null
  loadWeekReports()
}

// 标记为已更改
const markAsChanged = () => {
  hasUnsavedChanges.value = true
  saved.value = false
}

// 格式化保存时间
const formatSaveTime = (date) => {
  const now = new Date(date)
  return now.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 键盘快捷键处理
const handleKeydown = (event) => {
  // Ctrl+S 保存
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault()
    if (!loading.value) {
      saveAllReports()
    }
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadWeekReports()
  
  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeydown)
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped lang="scss">
// 自定义样式
input {
  transition: border-color 0.2s ease-in-out;
  background-color: white !important;
  color: black !important;
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    background-color: white !important;
    color: black !important;
  }
}

button {
  transition: all 0.2s ease-in-out;
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

pre {
  font-family: 'Courier New', monospace;
  line-height: 1.6;
}

// 确保所有文字颜色正确显示
h1, h2, h3, h4, h5, h6 {
  color: #1f2937 !important; // text-gray-800
}

p, span, label {
  color: #374151 !important; // text-gray-700
}
</style>