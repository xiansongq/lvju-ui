<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="房间价格" prop="price">
            <el-input v-model="queryParams.price" placeholder="请输入房间价格" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="价格时间" prop="pdate">
            <el-date-picker clearable
              v-model="queryParams.pdate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择价格时间"
            />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['lvju:roomprice:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['lvju:roomprice:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['lvju:roomprice:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['lvju:roomprice:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="roompriceList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="false" />
        <el-table-column label="房间编号" align="center" prop="roomid" />
        <el-table-column label="房间价格" align="center" prop="price" />
        <el-table-column label="优惠力度" align="center" prop="prefeforce" />
        <el-table-column label="价格时间" align="center" prop="pdate" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.pdate, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格是否有效" align="center" prop="isvalid" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lvju:roomprice:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lvju:roomprice:remove']"></el-button>
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
    <!-- 添加或修改房间价格信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="roompriceFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="房间价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入房间价格" />
        </el-form-item>
        <el-form-item label="优惠力度" prop="prefeforce">
          <el-input v-model="form.prefeforce" placeholder="请输入优惠力度" />
        </el-form-item>
        <el-form-item label="价格时间" prop="pdate">
          <el-date-picker clearable
            v-model="form.pdate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择价格时间">
          </el-date-picker>
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

<script setup name="Roomprice" lang="ts">
import { listRoomprice, getRoomprice, delRoomprice, addRoomprice, updateRoomprice } from '@/api/lvju/roomprice';
import { RoompriceVO, RoompriceQuery, RoompriceForm } from '@/api/lvju/roomprice/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const roompriceList = ref<RoompriceVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const roompriceFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: RoompriceForm = {
  id: undefined,
  roomid: undefined,
  price: undefined,
  prefeforce: undefined,
  pdate: undefined,
  isvalid: undefined,
}
const data = reactive<PageData<RoompriceForm, RoompriceQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    roomid: undefined,
    price: undefined,
    pdate: undefined,
    isvalid: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "id不能为空", trigger: "blur" }
    ],
    roomid: [
      { required: true, message: "房间编号不能为空", trigger: "change" }
    ],
    price: [
      { required: true, message: "房间价格不能为空", trigger: "blur" }
    ],
    pdate: [
      { required: true, message: "价格时间不能为空", trigger: "blur" }
    ],
    isvalid: [
      { required: true, message: "价格是否有效不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询房间价格信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listRoomprice(queryParams.value);
  roompriceList.value = res.rows;
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
  roompriceFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: RoompriceVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加房间价格信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: RoompriceVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getRoomprice(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改房间价格信息";
}

/** 提交按钮 */
const submitForm = () => {
  roompriceFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateRoomprice(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addRoomprice(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: RoompriceVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除房间价格信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delRoomprice(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('lvju/roomprice/export', {
    ...queryParams.value
  }, `roomprice_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
