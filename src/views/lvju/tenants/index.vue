<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="预定房间编号" prop="roomstusid">
            <el-input v-model="queryParams.roomstusid" placeholder="请输入预定房间编号" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="租客名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入租客名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="身份证" prop="sdno">
            <el-input v-model="queryParams.sdno" placeholder="请输入身份证" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="电话号码" prop="iphone">
            <el-input v-model="queryParams.iphone" placeholder="请输入电话号码" clearable style="width: 240px" @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['lvju:tenants:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['lvju:tenants:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['lvju:tenants:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['lvju:tenants:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="tenantsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="false" />
        <el-table-column label="预定房间编号" align="center" prop="roomstusid" />
        <el-table-column label="租客名称" align="center" prop="name" />
        <el-table-column label="身份证" align="center" prop="sdno" />
        <el-table-column label="电话号码" align="center" prop="iphone" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lvju:tenants:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lvju:tenants:remove']"></el-button>
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
    <!-- 添加或修改租客用户信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="tenantsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="客户编号" prop="customerid">
          <el-input v-model="form.customerid" placeholder="请输入客户编号" />
        </el-form-item>
        <el-form-item label="预定房间编号" prop="roomstusid">
          <el-input v-model="form.roomstusid" placeholder="请输入预定房间编号" />
        </el-form-item>
        <el-form-item label="租客名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入租客名称" />
        </el-form-item>
        <el-form-item label="身份证" prop="sdno">
          <el-input v-model="form.sdno" placeholder="请输入身份证" />
        </el-form-item>
        <el-form-item label="电话号码" prop="iphone">
          <el-input v-model="form.iphone" placeholder="请输入电话号码" />
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

<script setup name="Tenants" lang="ts">
import { listTenants, getTenants, delTenants, addTenants, updateTenants } from '@/api/lvju/tenants';
import { TenantsVO, TenantsQuery, TenantsForm } from '@/api/lvju/tenants/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const tenantsList = ref<TenantsVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const tenantsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: TenantsForm = {
  id: undefined,
  customerid: undefined,
  roomstusid: undefined,
  name: undefined,
  sdno: undefined,
  iphone: undefined,
}
const data = reactive<PageData<TenantsForm, TenantsQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    roomstusid: undefined,
    name: undefined,
    sdno: undefined,
    iphone: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "id不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "租客名称不能为空", trigger: "blur" }
    ],
    sdno: [
      { required: true, message: "身份证不能为空", trigger: "blur" }
    ],
    iphone: [
      { required: true, message: "电话号码不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询租客用户信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listTenants(queryParams.value);
  tenantsList.value = res.rows;
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
  tenantsFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: TenantsVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加租客用户信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: TenantsVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getTenants(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改租客用户信息";
}

/** 提交按钮 */
const submitForm = () => {
  tenantsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateTenants(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addTenants(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: TenantsVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除租客用户信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delTenants(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('lvju/tenants/export', {
    ...queryParams.value
  }, `tenants_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
