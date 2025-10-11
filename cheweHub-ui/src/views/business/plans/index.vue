<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="计划名称" prop="planName">
        <el-input
          v-model="queryParams.planName"
          placeholder="请输入计划名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="还款日" prop="paymentDay">
        <el-input
          v-model="queryParams.paymentDay"
          placeholder="请输入还款日"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="总期数" prop="totalCount">
        <el-input
          v-model="queryParams.totalCount"
          placeholder="请输入总期数"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="每期金额" prop="amountPerPeriod">
        <el-input
          v-model="queryParams.amountPerPeriod"
          placeholder="请输入每期金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="总金额" prop="totalAmount">
        <el-input
          v-model="queryParams.totalAmount"
          placeholder="请输入总金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始日期" prop="startDate">
        <el-date-picker clearable
          v-model="queryParams.startDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束日期" prop="endDate">
        <el-date-picker clearable
          v-model="queryParams.endDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['business:plans:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['business:plans:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['business:plans:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['business:plans:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="plansList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="计划ID" align="center" prop="id" />
      <el-table-column label="计划名称" align="center" prop="planName" />
      <el-table-column label="还款日" align="center" prop="paymentDay" />
      <el-table-column label="总期数" align="center" prop="totalCount" />
      <el-table-column label="每期金额" align="center" prop="amountPerPeriod" />
      <el-table-column label="总金额" align="center" prop="totalAmount" />
      <el-table-column label="开始日期" align="center" prop="startDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.startDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束日期" align="center" prop="endDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态：0-已取消，1-进行中，2-已完成" align="center" prop="status" />
      <el-table-column label="计划描述" align="center" prop="description" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['business:plans:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['business:plans:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改还款计划对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="plansRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="计划名称" prop="planName">
          <el-input v-model="form.planName" placeholder="请输入计划名称" />
        </el-form-item>
        <el-form-item label="还款日" prop="paymentDay">
          <el-input v-model="form.paymentDay" placeholder="请输入还款日" />
        </el-form-item>
        <el-form-item label="总期数" prop="totalCount">
          <el-input v-model="form.totalCount" placeholder="请输入总期数" />
        </el-form-item>
        <el-form-item label="每期金额" prop="amountPerPeriod">
          <el-input v-model="form.amountPerPeriod" placeholder="请输入每期金额" />
        </el-form-item>
        <el-form-item label="总金额" prop="totalAmount">
          <el-input v-model="form.totalAmount" placeholder="请输入总金额" />
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker clearable
            v-model="form.startDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker clearable
            v-model="form.endDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="计划描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-divider content-position="center">还款记录信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="Plus" @click="handleAddRepaymentRecords">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="Delete" @click="handleDeleteRepaymentRecords">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="repaymentRecordsList" :row-class-name="rowRepaymentRecordsIndex" @selection-change="handleRepaymentRecordsSelectionChange" ref="repaymentRecords">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="还款日期" prop="repaymentDate" width="240">
            <template #default="scope">
              <el-date-picker clearable
                v-model="scope.row.repaymentDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择还款日期">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column label="还款金额" prop="amount" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.amount" placeholder="请输入还款金额" />
            </template>
          </el-table-column>
          <el-table-column label="还款笔数" prop="count" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.count" placeholder="请输入还款笔数" />
            </template>
          </el-table-column>
          <el-table-column label="记录类型：1-计划还款，2-单笔还款" prop="recordType" width="150">
            <template #default="scope">
              <el-select v-model="scope.row.recordType" placeholder="请选择记录类型：1-计划还款，2-单笔还款">
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="状态：0-已取消，1-正常" prop="status" width="150">
            <template #default="scope">
              <el-select v-model="scope.row.status" placeholder="请选择状态：0-已取消，1-正常">
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" width="150">
            <template #default="scope">
              <el-input v-model="scope.row.remark" placeholder="请输入备注" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Plans">
import { listPlans, getPlans, delPlans, addPlans, updatePlans } from "@/api/business/plans"

const { proxy } = getCurrentInstance()

const plansList = ref([])
const repaymentRecordsList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const checkedRepaymentRecords = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    planName: null,
    paymentDay: null,
    totalCount: null,
    amountPerPeriod: null,
    totalAmount: null,
    startDate: null,
    endDate: null,
    status: null,
    description: null,
  },
  rules: {
    planName: [
      { required: true, message: "计划名称不能为空", trigger: "blur" }
    ],
    paymentDay: [
      { required: true, message: "还款日不能为空", trigger: "blur" }
    ],
    totalCount: [
      { required: true, message: "总期数不能为空", trigger: "blur" }
    ],
    amountPerPeriod: [
      { required: true, message: "每期金额不能为空", trigger: "blur" }
    ],
    totalAmount: [
      { required: true, message: "总金额不能为空", trigger: "blur" }
    ],
    startDate: [
      { required: true, message: "开始日期不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询还款计划列表 */
function getList() {
  loading.value = true
  listPlans(queryParams.value).then(response => {
    plansList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    planName: null,
    paymentDay: null,
    totalCount: null,
    amountPerPeriod: null,
    totalAmount: null,
    startDate: null,
    endDate: null,
    status: null,
    description: null,
    createTime: null,
    updateTime: null
  }
  repaymentRecordsList.value = []
  proxy.resetForm("plansRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加还款计划"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getPlans(_id).then(response => {
    form.value = response.data
    repaymentRecordsList.value = response.data.repaymentRecordsList
    open.value = true
    title.value = "修改还款计划"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["plansRef"].validate(valid => {
    if (valid) {
      form.value.repaymentRecordsList = repaymentRecordsList.value
      if (form.value.id != null) {
        updatePlans(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addPlans(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除还款计划编号为"' + _ids + '"的数据项？').then(function() {
    return delPlans(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 还款记录序号 */
function rowRepaymentRecordsIndex({ row, rowIndex }) {
  row.index = rowIndex + 1
}

/** 还款记录添加按钮操作 */
function handleAddRepaymentRecords() {
  let obj = {}
  obj.repaymentDate = ""
  obj.amount = ""
  obj.count = ""
  obj.recordType = ""
  obj.status = ""
  obj.remark = ""
  repaymentRecordsList.value.push(obj)
}

/** 还款记录删除按钮操作 */
function handleDeleteRepaymentRecords() {
  if (checkedRepaymentRecords.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的还款记录数据")
  } else {
    const repaymentRecordss = repaymentRecordsList.value
    const checkedRepaymentRecordss = checkedRepaymentRecords.value
    repaymentRecordsList.value = repaymentRecordss.filter(function(item) {
      return checkedRepaymentRecordss.indexOf(item.index) == -1
    })
  }
}

/** 复选框选中数据 */
function handleRepaymentRecordsSelectionChange(selection) {
  checkedRepaymentRecords.value = selection.map(item => item.index)
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('business/plans/export', {
    ...queryParams.value
  }, `plans_${new Date().getTime()}.xlsx`)
}

getList()
</script>
