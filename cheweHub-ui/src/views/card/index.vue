<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-50 text-black">
    <!--内容-->
    <div class="w-full  px-4" style="min-height: 500px; ">
      <RepaymentCalendar ref="repaymentCalendar" @data-updated="loadDataFromServer"/>
    </div>

    <div class="flex flex-row gap-4 mt-4">
      <div class="w-80">
        <button
            @click="showModal = true"
            class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          生成还款计划
        </button>
      </div>
      <div class="w-80">
        <button
            @click="showManageModal = true"
            class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          管理还款数据
        </button>
      </div>
      <div class="w-80">
        <div class="p-4 rounded bg-gray-100 text-black">
          <h3 class="font-bold mb-2">还款统计</h3>
          <p>总还款金额: ¥{{ totalAmount.toLocaleString() }}</p>
          <p>还款次数: {{ totalCount }}</p>
        </div>
      </div>
    </div>

    <!-- 弹出表单 -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="p-6 rounded-lg w-96 bg-white text-black">
        <!-- 标签切换 -->
        <div class="flex mb-4 border-b border-gray-200">
          <button
              @click="activeTab = 'plan'"
              class="flex-1 py-2 px-4 text-center transition-colors"
              :class="activeTab === 'plan' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
          >
            生成还款计划
          </button>
          <button
              @click="activeTab = 'single'"
              class="flex-1 py-2 px-4 text-center transition-colors"
              :class="activeTab === 'single' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
          >
            添加单笔账单
          </button>
        </div>

        <!-- 生成还款计划表单 -->
        <div v-if="activeTab === 'plan'">
          <div class="mb-4">
            <label
                class="block text-sm font-medium mb-2 text-gray-700">待还名称</label>
            <input
                v-model="formData.planName"
                type="text"
                placeholder="请输入待还名称"
                class="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
          <div class="mb-4">
            <label
                class="block text-sm font-medium mb-2 text-gray-700">首笔还款时间</label>
            <input
                v-model="formData.firstPaymentDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div class="mb-4">
            <label
                class="block text-sm font-medium mb-2 text-gray-700">待还笔数</label>
            <input
                v-model="formData.totalCount"
                type="number"
                min="1"
                placeholder="请输入待还笔数"
                class="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 transition-colors">每期金额
              (元)</label>
            <input
                v-model="formData.amountPerPeriod"
                type="number"
                step="0.01"
                placeholder="请输入每期金额"
                class="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>

        <!-- 添加单笔账单表单 -->
        <div v-if="activeTab === 'single'">
          <div class="mb-4">
            <label
                class="block text-sm font-medium mb-2 text-gray-700">还款日期</label>
            <input
                v-model="formData.singleDate"
                type="date"
                class="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 transition-colors">还款金额
              (元)</label>
            <input
                v-model="formData.singleAmount"
                type="number"
                step="0.01"
                placeholder="请输入还款金额"
                class="w-full px-3 py-2 border border-gray-300 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
          </div>
        </div>

        <div class="flex gap-2">
          <button
              @click="addPayment"
              :disabled="loading"
              class="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {{ loading ? '处理中...' : (activeTab === 'plan' ? '生成还款计划' : '添加账单') }}
          </button>
          <button
              @click="showModal = false"
              class="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            取消
          </button>
        </div>
      </div>
    </div>

    <!-- 管理还款数据弹窗 -->
    <div v-if="showManageModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
          class="p-6 rounded-lg w-4xl max-h-96 overflow-y-auto bg-white text-black">
        <h2 class="text-xl font-bold mb-4">管理还款数据</h2>

        <div class="mb-4">
          <div class="flex gap-2 mb-2">
            <button
                @click="loadDataFromServer"
                :disabled="loading"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {{ loading ? '加载中...' : '刷新数据' }}
            </button>
          </div>
        </div>

        <div class="mb-4">
          <h3 class="font-bold mb-2">还款计划列表：</h3>
          <div
              class="max-h-64 overflow-y-auto border border-gray-300 rounded p-2">
            <div v-if="plansList.length === 0" class="text-gray-500">
              暂无还款计划
            </div>
            <div v-else>
              <div v-for="plan in plansList" :key="plan.id"
                   class="py-2 border-b border-gray-200">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="font-medium">{{ plan.planName }}</div>
                    <div class="text-sm text-gray-600">
                      首笔还款: {{ formatDate(plan.startDate) }} | 总期数: {{ plan.totalCount }}期 | 每期: ¥{{
                        plan.amountPerPeriod
                      }}
                    </div>
                    <div class="text-sm text-gray-600">
                      总金额: ¥{{ plan.totalAmount }} | 状态: {{ plan.status === 1 ? '正常' : '已结束' }}
                    </div>
                  </div>
                  <button
                      @click="deletePlan(plan.id)"
                      :disabled="loading"
                      class="bg-red-500 hover:bg-red-700 text-white text-xs px-2 py-1 rounded disabled:opacity-50 ml-2"
                  >
                    删除计划
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div class="flex gap-2">
          <button
              @click="showManageModal = false"
              class="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RepaymentCalendar from "./components/CalendarChart.vue";
import {
  addPlans,
  addSinglePayment,
  delPlans,
  getCalendarData,
  getStartAndEndDate,
  getStatistics
} from '@/api/business/plans';

export default {
  data() {
    return {
      showModal: false,
      activeTab: 'plan',
      formData: {
        planName: '',
        firstPaymentDate: new Date().toISOString().split('T')[0],
        totalCount: '',
        amountPerPeriod: '',
        singleDate: new Date().toISOString().split('T')[0],
        singleAmount: ''
      },
      showManageModal: false,
      loading: false,
      statistics: {},
      plansList: [],
      startData: '',
      endData: ''
    }
  },
  components: {RepaymentCalendar},
  computed: {
    totalAmount() {
      return this.statistics.totalAmount || 0;
    },
    totalCount() {
      return this.statistics.totalCount || 0;
    },

  },
  methods: {
    getStartAndEndTime() {
      getStartAndEndDate().then(res => {
        if (res.code === 200) {
          this.startData = res.data.startDate;
          this.endData = res.data.endDate;
        }
      }).catch(error => {
        console.error('获取开始和结束日期失败:', error);
      });
    },
    addPayment() {
      if (this.activeTab === 'plan') {
        this.addRepaymentPlan();
      } else {
        this.addSinglePayment();
      }
    },
    addRepaymentPlan() {
      // 验证表单数据
      if (!this.formData.planName || !this.formData.firstPaymentDate || !this.formData.totalCount || !this.formData.amountPerPeriod) {
        this.$message.error('请填写完整的还款计划信息');
        return;
      }

      this.loading = true;
      addPlans(this.formData).then(res => {
        if (res.code === 200) {
          this.$message.success('还款计划生成成功');
          this.resetForm();
          this.showModal = false;
          // 重新加载数据
          this.loadDataFromServer();
          // 刷新统计数据
          this.loadStatistics();
        } else {
          this.$message.error(res.msg || '生成还款计划失败');
        }
      }).catch(error => {
        console.error('生成还款计划失败:', error);
        this.$message.error('生成还款计划失败：' + error.message);
      }).finally(() => {
        this.loading = false;
      });
    },

    async addSinglePayment() {
      if (!this.formData.singleDate || !this.formData.singleAmount) {
        this.$message.error('请填写完整信息');
        return;
      }

      const amount = parseFloat(this.formData.singleAmount);

      if (amount <= 0) {
        this.$message.error('还款金额必须大于0');
        return;
      }

      this.loading = true;
      try {
        // 将日期字符串转换为Date对象
        const repaymentDate = new Date(this.formData.singleDate);

        const response = await addSinglePayment({
          repaymentDate: repaymentDate,
          amount: amount
        });

        if (response.code === 200) {
          // 重新加载数据
          await this.loadDataFromServer();

          this.resetForm();
          this.showModal = false;
          this.$message.success('添加成功');

          // 刷新统计数据
          await this.loadStatistics();
        } else {
          this.$message.error(response.msg || '添加失败');
        }
      } catch (error) {
        console.error('添加失败:', error);
        this.$message.error('添加失败：' + error.message);
      } finally {
        this.loading = false;
      }
    },


    resetForm() {
      this.formData = {
        planName: '',
        firstPaymentDate: new Date().toISOString().split('T')[0],
        totalCount: '',
        amountPerPeriod: '',
        singleDate: new Date().toISOString().split('T')[0],
        singleAmount: ''
      };
    },

    // 从服务器加载数据
    async loadDataFromServer() {
      this.loading = true;
      try {
        const response = await getCalendarData();
        console.log('API响应数据:', response);
        
        if (response.code === 200) {
          // 处理新的数据结构：将plans和repaymentRecords转换为日历数据格式
          const calendarData = this.convertPlansToCalendarData(response.data);
          
          // 统计总待还金额和笔数
          const totalPendingAmount = calendarData.reduce((sum, item) => sum + item[1], 0);
          const totalPendingCount = calendarData.length;
          
          console.log('总待还金额:', totalPendingAmount);
          console.log('总待还笔数:', totalPendingCount);
          
          await this.$refs.repaymentCalendar.setRepaymentData(calendarData, response.data);
          this.$message.success(`数据加载成功 - 共${totalPendingCount}笔待还，总金额¥${totalPendingAmount.toLocaleString()}`);
          await this.loadStatistics();
        } else {
          this.$message.error(response.msg || '加载数据失败');
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        this.$message.error('加载数据失败：' + error.message);
      } finally {
        this.loading = false;
      }
    },

    // 将plans数据转换为日历数据格式
    convertPlansToCalendarData(plansData) {
      const calendarData = [];

      if (Array.isArray(plansData)) {
        // 保存plans列表到data中
        this.plansList = plansData;

        plansData.forEach(plan => {
          if (plan.repaymentRecordsList && Array.isArray(plan.repaymentRecordsList)) {
            plan.repaymentRecordsList.forEach(record => {
              // 只处理有效的还款记录（金额大于0）
              if (record.amount && record.amount > 0) {
                // 查找是否已存在相同日期和状态的记录
                const existingIndex = calendarData.findIndex(item => 
                  item[0] === record.repaymentDate && item[3] === record.status
                );

                if (existingIndex >= 0) {
                  // 如果存在相同日期和状态的记录，累加金额和笔数
                  calendarData[existingIndex][1] += record.amount;
                  calendarData[existingIndex][2] += 1;
                } else {
                  // 如果不存在，添加新记录 [日期, 金额, 笔数, 状态]
                  calendarData.push([record.repaymentDate, record.amount, 1, record.status]);
                }
              }
            });
          }
        });
      } else {
        this.plansList = [];
      }

      // 按日期排序
      calendarData.sort((a, b) => new Date(a[0]) - new Date(b[0]));

      console.log('转换后的日历数据:', calendarData);
      console.log('原始计划数据:', plansData);
      
      return calendarData;
    },


    // 删除还款计划
    async deletePlan(planId) {
      if (!confirm('确定要删除这个还款计划吗？此操作不可恢复！')) {
        return;
      }

      this.loading = true;
      try {
        const response = await delPlans(planId);
        if (response.code === 200) {
          this.$message.success('还款计划删除成功');
          await this.loadDataFromServer();
        } else {
          this.$message.error(response.msg || '删除还款计划失败');
        }
      } catch (error) {
        console.error('删除还款计划失败:', error);
        this.$message.error('删除还款计划失败：' + error.message);
      } finally {
        this.loading = false;
      }
    },

    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    },

    // 加载统计数据
    async loadStatistics() {
      try {
        const statisticsResponse = await getStatistics();

        if (statisticsResponse.code === 200) {
          this.statistics = statisticsResponse.data;
        }
      } catch (error) {
        console.error('加载统计数据失败:', error);
      }
    }
  },

  async mounted() {
    // 页面加载时从服务器加载数据
    await this.loadDataFromServer();
    this.getStartAndEndTime();
  }
}
</script>
<style scoped lang="scss">

</style>


