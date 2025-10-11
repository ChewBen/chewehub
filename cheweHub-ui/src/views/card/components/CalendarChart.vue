<template>
  <div>
    <!-- 多年份日历容器 -->
    <div class="space-y-8">
      <div 
        v-for="(yearData, year) in yearlyData" 
        :key="year"
        class="year-calendar-container"
      >
        <h3 class="text-xl font-bold mb-4 text-center">{{ year }}年还款日历</h3>
        <div class="w-full h-80" :id="`repayment-calendar-${year}`"></div>
        <div class="text-center text-sm text-gray-600 mt-2">
          {{ year }}年总还款: ¥{{ yearData.totalAmount.toLocaleString() }} ({{ yearData.recordCount }}笔)
          <br>
          <span class="text-red-600">待还: ¥{{ yearData.unpaidAmount.toLocaleString() }}</span>
          <span class="text-green-600 ml-4">已还: ¥{{ yearData.paidAmount.toLocaleString() }}</span>
        </div>
      </div>
    </div>

         <!-- 记录详情弹窗 -->
     <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
     <div class="p-6 rounded-lg w-2xl max-h-96 overflow-y-auto bg-white text-black">
      <h2 class="text-xl font-bold mb-4">还款记录详情 - {{ selectedDate }}</h2>
      
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium">总还款金额: ¥{{ selectedDayData.totalAmount?.toLocaleString() }}</span>
          <span class="font-medium">还款笔数: {{ selectedDayData.records?.length || 0 }}</span>
        </div>
      </div>

      <div class="mb-4">
        <h3 class="font-bold mb-2">详细记录：</h3>
                 <div class="max-h-64 overflow-y-auto border border-gray-300 rounded p-2">
           <div v-if="!selectedDayData.records || selectedDayData.records.length === 0" class="text-gray-500">
            暂无详细记录
          </div>
          <div v-else>
                         <div v-for="(record, index) in selectedDayData.records" :key="index"
                  class="py-2 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <div class="flex-1">
                  <div class="font-medium">{{ record.planName || '单笔还款' }}</div>
                                     <div class="text-sm text-gray-600">
                     还款金额: ¥{{ record.amount?.toLocaleString() }}
                   </div>
                   <div class="text-sm text-gray-600">
                    还款时间: {{ formatDateTime(record.repaymentDate) }}
                  </div>
                </div>
                <div class="flex gap-2">
                  <button
                      @click="markAsPaid(record)"
                      :disabled="record.status === 2"
                      class="bg-green-500 hover:bg-green-700 text-white text-xs px-2 py-1 rounded disabled:opacity-50"
                  >
                    {{ record.status === 2 ? '已还款' : '标记已还' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex gap-2">
        <button
            @click="showAddPayment"
            class="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          添加还款
        </button>
        <button
            @click="showDetailModal = false"
            class="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          关闭
        </button>
      </div>
    </div>
  </div>

     <!-- 添加还款弹窗 -->
   <div v-if="showAddPaymentModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
     <div class="p-6 rounded-lg w-96 bg-white text-black">
      <h2 class="text-xl font-bold mb-4">添加还款记录 - {{ selectedDate }}</h2>
      
      <div class="mb-4">
                 <label class="block text-sm font-medium mb-2 text-gray-700">还款金额 (元)</label>
         <input
             v-model="newPayment.amount"
             type="number"
             step="0.01"
             placeholder="请输入还款金额"
             class="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <div class="mb-4">
                 <label class="block text-sm font-medium mb-2 text-gray-700">备注</label>
         <input
             v-model="newPayment.note"
             type="text"
             placeholder="请输入备注信息"
             class="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
      </div>

      <div class="flex gap-2">
        <button
            @click="addPayment"
            :disabled="loading"
            class="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {{ loading ? '处理中...' : '添加还款' }}
        </button>
        <button
            @click="showAddPaymentModal = false"
            class="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          取消
        </button>
      </div>
    </div>
  </div>
  </div>

</template>

<script>
import {createSingleYearCalendarWithStatus} from "@/utils/echarts.js";
import {addSinglePayment, markAsPaid as markAsPaidAPI} from '@/api/business/plans';

export default {
  name: 'RepaymentCalendar',
  data() {
    return {
      repaymentData: [],
      yearlyData: {}, // 按年份分组的数据
      plansData: [], // 存储完整的计划数据
      showDetailModal: false,
      showAddPaymentModal: false,
      selectedDate: '',
      selectedDayData: {},
      newPayment: {
        amount: '',
        note: ''
      },
      loading: false,
      chartInstances: {} // 存储多个图表实例
    }
  },
  components: {},
  mounted() {
    // 初始化时不需要立即更新图表，等待数据传入
  },
  beforeUnmount() {
    // 组件销毁前清理所有图表实例
    Object.values(this.chartInstances).forEach(chart => {
      if (chart) {
        chart.dispose();
      }
    });
    this.chartInstances = {};
  },
  methods: {
    async updateCharts() {
      try {
        // 等待DOM完全渲染
        await this.$nextTick();
        
        // 清理现有的图表实例
        Object.values(this.chartInstances).forEach(chart => {
          if (chart) {
            chart.dispose();
          }
        });
        this.chartInstances = {};
        
        // 为每个年份创建图表
        for (const [year, yearData] of Object.entries(this.yearlyData)) {
          const containerId = `repayment-calendar-${year}`;
          const container = document.getElementById(containerId);
          
          if (!container || container.clientWidth === 0 || container.clientHeight === 0) {
            console.warn(`图表容器 ${containerId} 尺寸为0，延迟初始化`);
            setTimeout(() => this.updateCharts(), 100);
            return;
          }
          
          const chart = await createSingleYearCalendarWithStatus(containerId, yearData.data, year);
          if (chart) {
            // 添加点击事件监听
            chart.on('click', (params) => this.handleChartClick(params, year));
            this.chartInstances[year] = chart;
          }
        }
      } catch (error) {
        console.error('更新图表失败:', error);
      }
    },
    
    // 处理图表点击事件
    handleChartClick(params, year) {
      if (params.seriesType === 'heatmap' && params.value) {
        const clickedDate = params.value[0];
        this.showDayDetails(clickedDate, year);
      }
    },
    
    // 显示某天的详细信息
    showDayDetails(date, year) {
      this.selectedDate = this.formatDate(date);
      this.selectedDayData = this.getDayData(date);
      this.showDetailModal = true;
    },
    
    // 获取某天的数据
    getDayData(date) {
      const dateStr = this.formatDateForComparison(date);
      const dayRecords = [];
      let totalAmount = 0;
      
      // 从计划数据中查找该日期的还款记录
      this.plansData.forEach(plan => {
        if (plan.repaymentRecordsList && Array.isArray(plan.repaymentRecordsList)) {
          plan.repaymentRecordsList.forEach(record => {
            const recordDate = this.formatDateForComparison(record.repaymentDate);
            if (recordDate === dateStr) {
              dayRecords.push({
                ...record,
                planName: plan.planName
              });
              totalAmount += record.amount;
            }
          });
        }
      });
      
      return {
        totalAmount,
        records: dayRecords
      };
    },
    
    // 格式化日期用于比较
    formatDateForComparison(date) {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    },
    
    // 格式化日期显示
    formatDate(date) {
      const d = new Date(date);
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    },
    
    // 格式化日期时间显示
    formatDateTime(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN');
    },
    
    // 标记为已还款
    async markAsPaid(record) {
      console.log(record);
      
      try {
        // 检查记录是否已经是已还款状态
        if (record.status === 2) {
          this.$message.warning('该记录已经是已还款状态');
          return;
        }
        console.log(record);
        // 准备请求数据
        const requestData = {
          date: this.formatDateForComparison(record.repaymentDate),
          amount: record.amount
        };

        // 发送标记已还款请求
        const response = await markAsPaidAPI(requestData);
        
        if (response.code === 200) {
          this.$message.success('标记已还款成功');
          
          // 更新本地数据状态
          record.status = 2;
          
          // 通知父组件刷新数据
          this.$emit('data-updated');
        } else {
          this.$message.error(response.msg || '标记失败');
        }
      } catch (error) {
        console.error('标记已还款失败:', error);
        this.$message.error('标记失败：' + error.message);
      }
    },
    
    // 显示添加还款弹窗
    showAddPayment() {
      this.showAddPaymentModal = true;
      this.newPayment = {
        amount: '',
        note: ''
      };
      // 关闭详情弹窗
      this.showDetailModal = false;
    },
    
    // 添加还款记录
    async addPayment() {
      if (!this.newPayment.amount) {
        this.$message.error('请输入还款金额');
        return;
      }

      const amount = parseFloat(this.newPayment.amount);
      if (amount <= 0) {
        this.$message.error('还款金额必须大于0');
        return;
      }

      this.loading = true;
      try {
        const response = await addSinglePayment({
          repaymentDate: new Date(this.selectedDate),
          amount: amount,
          note: this.newPayment.note
        });

        if (response.code === 200) {
          this.$message.success('还款记录添加成功');
          this.showAddPaymentModal = false;
          
          // 通知父组件刷新数据
          this.$emit('data-updated');
        } else {
          this.$message.error(response.msg || '添加失败');
        }
      } catch (error) {
        console.error('添加还款记录失败:', error);
        this.$message.error('添加失败：' + error.message);
      } finally {
        this.loading = false;
      }
    },
    
    // 设置还款数据的方法
    async setRepaymentData(data, plansData = []) {
      this.repaymentData = data;
      this.plansData = plansData;
      
      // 按年份分组数据
      this.yearlyData = this.groupDataByYear(data);
      
      await this.updateCharts();
    },
    
    // 按年份分组数据
    groupDataByYear(data) {
      const yearlyData = {};
      
      data.forEach(item => {
        const date = item[0];
        const amount = item[1];
        const count = item[2] || 1;
        const status = item[3] || 1; // 添加状态信息
        
        if (date && amount) {
          const year = date.substring(0, 4); // 提取年份
          
          if (!yearlyData[year]) {
            yearlyData[year] = {
              data: [],
              totalAmount: 0,
              recordCount: 0,
              unpaidAmount: 0,
              paidAmount: 0
            };
          }
          
          // 查找是否已存在相同日期的记录
          const existingIndex = yearlyData[year].data.findIndex(existingItem => 
            existingItem[0] === date && existingItem[3] === status
          );
          
          if (existingIndex >= 0) {
            // 如果存在相同日期和状态的记录，累加金额和笔数
            yearlyData[year].data[existingIndex][1] += amount;
            yearlyData[year].data[existingIndex][2] += count;
          } else {
            // 如果不存在，添加新记录 [日期, 金额, 笔数, 状态]
            yearlyData[year].data.push([date, amount, count, status]);
          }
          
          // 更新年份统计
          yearlyData[year].totalAmount += amount;
          yearlyData[year].recordCount += count;
          
          if (status === 2) {
            yearlyData[year].paidAmount += amount;
          } else {
            yearlyData[year].unpaidAmount += amount;
          }
        }
      });
      
      // 按年份排序
      const sortedYearlyData = {};
      Object.keys(yearlyData).sort().forEach(year => {
        // 按日期排序当年的数据
        yearlyData[year].data.sort((a, b) => new Date(a[0]) - new Date(b[0]));
        sortedYearlyData[year] = yearlyData[year];
      });
      
      console.log('按年份分组的数据:', sortedYearlyData);
      return sortedYearlyData;
    },
    
    // 获取还款数据的方法
    getRepaymentData() {
      return this.repaymentData;
    }
  }
}
</script>
<style scoped lang="scss">

</style>
