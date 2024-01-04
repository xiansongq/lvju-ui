<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="房间编号" prop="roomid">
            <el-input v-model="queryParams.roomid" placeholder="请输入房间编号" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="客户姓名" prop="customerid">
            <el-input v-model="queryParams.customerid" placeholder="请输入客户姓名" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="起始时间" prop="startdate">
            <el-date-picker clearable
              v-model="queryParams.startdate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择起始时间"
            />
          </el-form-item>
          <el-form-item label="结束时间" prop="enddate">
            <el-date-picker clearable
              v-model="queryParams.enddate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择结束时间"
            />
          </el-form-item>
          <el-form-item label="预定价格" prop="bookprice">
            <el-input v-model="queryParams.bookprice" placeholder="请输入预定价格" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['lvju:roomstus:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['lvju:roomstus:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['lvju:roomstus:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['lvju:roomstus:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="roomstusList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="房间编号" align="center" prop="roomid" />
        <el-table-column label="客户姓名" align="center" prop="customerid" />
        <el-table-column label="房间状态" align="center" prop="status" />
        <el-table-column label="起始时间" align="center" prop="startdate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.startdate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="enddate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.enddate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预定价格" align="center" prop="bookprice" />
        <el-table-column label="总金额" align="center" prop="totalprice" />
        <el-table-column label="总天数" align="center" prop="totaldays" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lvju:roomstus:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lvju:roomstus:remove']"></el-button>
            </el-tooltip>
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
    </el-card>
    <!-- 添加或修改房间预定信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="roomstusFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="房间编号" prop="roomid">
          <el-input v-model="form.roomid" placeholder="请输入房间编号" />
        </el-form-item>
        <el-form-item label="客户编号" prop="userid">
          <el-input v-model="form.userid" placeholder="请输入客户编号" />
        </el-form-item>
        <el-form-item label="客户姓名" prop="customerid">
          <el-input v-model="form.customerid" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="起始时间" prop="startdate">
          <el-date-picker clearable
            v-model="form.startdate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择起始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="enddate">
          <el-date-picker clearable
            v-model="form.enddate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预定价格" prop="bookprice">
          <el-input v-model="form.bookprice" placeholder="请输入预定价格" />
        </el-form-item>
        <el-form-item label="总金额" prop="totalprice">
          <el-input v-model="form.totalprice" placeholder="请输入总金额" />
        </el-form-item>
        <el-form-item label="总天数" prop="totaldays">
          <el-input v-model="form.totaldays" placeholder="请输入总天数" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Roomstus" lang="ts">
import { listRoomstus, getRoomstus, delRoomstus, addRoomstus, updateRoomstus } from '@/api/lvju/roomstus';
import { RoomstusVO, RoomstusQuery, RoomstusForm } from '@/api/lvju/roomstus/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const roomstusList = ref<RoomstusVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const roomstusFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: RoomstusForm = {
  id: undefined,
  roomid: undefined,
  userid: undefined,
  customerid: undefined,
  status: undefined,
  startdate: undefined,
  enddate: undefined,
  bookprice: undefined,
  totalprice: undefined,
  totaldays: undefined
}
const data = reactive<PageData<RoomstusForm, RoomstusQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    roomid: undefined,
    customerid: undefined,
    status: undefined,
    startdate: undefined,
    enddate: undefined,
    bookprice: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "id不能为空", trigger: "blur" }
    ],
    roomid: [
      { required: true, message: "房间编号不能为空", trigger: "blur" }
    ],
    userid: [
      { required: true, message: "客户编号不能为空", trigger: "blur" }
    ],
    customerid: [
      { required: true, message: "客户姓名不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "房间状态不能为空", trigger: "change" }
    ],
    startdate: [
      { required: true, message: "起始时间不能为空", trigger: "blur" }
    ],
    enddate: [
      { required: true, message: "结束时间不能为空", trigger: "blur" }
    ],
    bookprice: [
      { required: true, message: "预定价格不能为空", trigger: "blur" }
    ],
    totalprice: [
      { required: true, message: "总金额不能为空", trigger: "blur" }
    ],
    totaldays: [
      { required: true, message: "总天数不能为空", trigger: "blur" }
    ]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询房间预定信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listRoomstus(queryParams.value);
  roomstusList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  roomstusFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: RoomstusVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加房间预定信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: RoomstusVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getRoomstus(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改房间预定信息";
}

/** 提交按钮 */
const submitForm = () => {
  roomstusFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateRoomstus(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addRoomstus(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: RoomstusVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除房间预定信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delRoomstus(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('lvju/roomstus/export', {
    ...queryParams.value
  }, `roomstus_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
