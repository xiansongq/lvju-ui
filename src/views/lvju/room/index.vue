<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="房源id" prop="houseid">
            <el-input v-model="queryParams.houseid" placeholder="请输入房源id" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>

          <el-form-item label="楼层" prop="houselv">
            <el-input v-model="queryParams.houselv" placeholder="请输入楼层" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="房号" prop="roomno">
            <el-input v-model="queryParams.roomno" placeholder="请输入房号" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="房型" prop="apartment">
            <el-input v-model="queryParams.apartment" placeholder="请输入房型" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="面积" prop="area">
            <el-input v-model="queryParams.area" placeholder="请输入面积" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="房间状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="请选择房间状态" clearable>
              <el-option v-for="dict in lvju_room_status" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['lvju:room:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['lvju:room:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['lvju:room:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['lvju:room:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="roomList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="id" align="center" prop="id" v-if="true" /> -->
        <el-table-column label="房源" align="center" prop="housename" />
        <el-table-column label="楼栋" align="center" prop="houseno" />
        <el-table-column label="楼层" align="center" prop="houselv" />
        <el-table-column label="房号" align="center" prop="roomno" />
        <el-table-column label="房型" align="center" prop="apartment" />
        <el-table-column label="面积" align="center" prop="area" />
        <el-table-column label="房间状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="lvju_room_status" :value="scope.row.status" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lvju:room:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lvju:room:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改房间信息管理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="roomFormRef" :model="form" :rules="rules" label-width="80px">
   
        <el-form-item label="房源id" prop="houseid">
          <el-select v-model="form.houseid" filterable placeholder="请选择">
          <el-option v-for="item in houseList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
          <!-- <el-input v-model="form.houseid" placeholder="请输入房源id" /> -->
        </el-form-item>
        <el-form-item label="楼栋" prop="houseno">
          <el-input v-model="form.houseno" placeholder="请输入楼栋" />
        </el-form-item>
        <el-form-item label="楼层" prop="houselv">
          <el-input v-model="form.houselv" placeholder="请输入楼层" />
        </el-form-item>
        <el-form-item label="房号" prop="roomno">
          <el-input v-model="form.roomno" placeholder="请输入房号" />
        </el-form-item>
        <el-form-item label="房型" prop="apartment">
          <el-input v-model="form.apartment" placeholder="请输入房型" />
        </el-form-item>
        <el-form-item label="面积" prop="area">
          <el-input v-model="form.area" placeholder="请输入面积" />
        </el-form-item>
        <el-form-item label="房间状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择房间状态">
            <el-option v-for="dict in lvju_room_status" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间描述" prop="describe">
          <el-input v-model="form.describe" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="房间关键字" prop="keys">
          <el-input v-model="form.keys" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入内容" />
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

<script setup name="Room" lang="ts">
import { listRoom, getRoom, delRoom, addRoom, updateRoom } from '@/api/lvju/room';
import { RoomVO, RoomQuery, RoomForm } from '@/api/lvju/room/types';
import { listHouse, getHouse } from '@/api/lvju/house';
import { HouseVO } from '@/api/lvju/house/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { lvju_room_status } = toRefs<any>(proxy?.useDict('lvju_room_status'));

const roomList = ref<RoomVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const houseList = ref<HouseVO[]>([]);
const queryFormRef = ref<ElFormInstance>();
const roomFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: RoomForm = {
  id: undefined,
  houseid: undefined,
  houseno: undefined,
  houselv: undefined,
  roomno: undefined,
  apartment: undefined,
  area: undefined,
  status: undefined,
  describe: undefined,
  keys: undefined,
  remarks: undefined
};
const data = reactive<PageData<RoomForm, RoomQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    houseid: undefined,
    houseno: undefined,
    houselv: undefined,
    roomno: undefined,
    apartment: undefined,
    area: undefined,
    status: undefined,
    describe: undefined,
    keys: undefined,
    remarks: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    houseid: [{ required: true, message: '房源id不能为空', trigger: 'blur' }],
    houseno: [{ required: true, message: '楼栋不能为空', trigger: 'blur' }],
    houselv: [{ required: true, message: '楼层不能为空', trigger: 'blur' }],
    roomno: [{ required: true, message: '房号不能为空', trigger: 'blur' }],
    apartment: [{ required: true, message: '房型不能为空', trigger: 'blur' }],
    area: [{ required: true, message: '面积不能为空', trigger: 'blur' }],
    status: [{ required: true, message: '房间状态不能为空', trigger: 'change' }],
    describe: [{ required: true, message: '房间描述不能为空', trigger: 'blur' }],
    // keys: [{ required: true, message: '房间关键字不能为空', trigger: 'blur' }],
    // remarks: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/* 获取房源信息 */
const getHouseInfo = async (houseid?: string | number) => {
  const res = await getHouse(houseid);
  // console.log(res);
  return res.data.name;
};

/* 获取房源列表 */
const getHouseList = async () => {
  const res = await listHouse(queryParams.value);
  houseList.value = res.rows;
};

/** 查询房间信息管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listRoom(queryParams.value);
  // console.log(res)
  roomList.value = res.rows;
  for (var i = 0; i < res.rows.length; i++) {
    roomList.value[i].housename = await getHouseInfo(roomList.value[i].houseid);
  }
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  roomFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: RoomVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  getHouseList();
  dialog.visible = true;
  dialog.title = '添加房间信息管理';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: RoomVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getRoom(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改房间信息管理';
};

/** 提交按钮 */
const submitForm = () => {
  roomFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateRoom(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addRoom(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('修改成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: RoomVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除房间信息管理编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delRoom(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'lvju/room/export',
    {
      ...queryParams.value
    },
    `room_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
