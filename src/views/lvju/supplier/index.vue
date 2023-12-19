<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="用户编号" prop="userid">
            <el-input v-model="queryParams.userid" placeholder="请输入用户编号" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="公司名称" prop="company">
            <el-input v-model="queryParams.company" placeholder="请输入公司名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="联系人" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入联系人" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="身份证号" prop="sdnum">
            <el-input v-model="queryParams.sdnum" placeholder="请输入身份证号" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="联系电话" prop="iphone">
            <el-input v-model="queryParams.iphone" placeholder="请输入联系电话" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="类型" prop="stype">
            <el-select v-model="queryParams.stype" placeholder="请选择类型" clearable>
              <el-option v-for="dict in lvju_supplier_type" :key="dict.value" :label="dict.label" :value="dict.value" />
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
          <!-- <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['lvju:supplier:add']">新增</el-button>
          </el-col> -->
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['lvju:supplier:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['lvju:supplier:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['lvju:supplier:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="supplierList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="用户编号" align="center" prop="userid" />
        <el-table-column label="公司名称" align="center" prop="company" />
        <el-table-column label="联系人" align="center" prop="name" />
        <el-table-column label="身份证号" align="center" prop="sdnum" />
        <el-table-column label="联系电话" align="center" prop="iphone" />
        <el-table-column label="类型" align="center" prop="stype">
          <template #default="scope">
            <dict-tag :options="lvju_supplier_type" :value="scope.row.stype" />
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
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lvju:supplier:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lvju:supplier:remove']"></el-button>
            </el-tooltip>
            <el-tooltip content="查看资质" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleShowFile(scope.row)" v-hasPermi="['lvju:supplier:showFile']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改供应商信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="supplierFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户编号" prop="userid">
          <el-input v-model="form.userid" placeholder="请输入用户编号" />
        </el-form-item>
        <el-form-item label="公司名称" prop="company">
          <el-input v-model="form.company" placeholder="请输入公司名称" />
        </el-form-item>
        <el-form-item label="联系人" prop="name">
          <el-input v-model="form.name" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="身份证号" prop="sdnum">
          <el-input v-model="form.sdnum" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="联系电话" prop="iphone">
          <el-input v-model="form.iphone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="类型" prop="stype">
          <el-select v-model="form.stype" placeholder="请选择类型">
            <el-option v-for="dict in lvju_supplier_type" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
          </el-select>
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

<script setup name="Supplier" lang="ts">
import { listSupplier, getSupplier, delSupplier, addSupplier, updateSupplier } from '@/api/lvju/supplier';
import { SupplierVO, SupplierQuery, SupplierForm } from '@/api/lvju/supplier/types';
import { ElMessage } from 'element-plus';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { lvju_supplier_type } = toRefs<any>(proxy?.useDict('lvju_supplier_type'));

const supplierList = ref<SupplierVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const supplierFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SupplierForm = {
  id: undefined,
  userid: undefined,
  company: undefined,
  name: undefined,
  sdnum: undefined,
  iphone: undefined,
  stype: undefined
};
const data = reactive<PageData<SupplierForm, SupplierQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userid: undefined,
    company: undefined,
    name: undefined,
    sdnum: undefined,
    iphone: undefined,
    stype: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    userid: [{ required: true, message: '用户编号不能为空', trigger: 'blur' }],
    company: [{ required: true, message: '公司名称不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
    sdnum: [{ required: true, message: '身份证号不能为空', trigger: 'blur' }],
    iphone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
    stype: [{ required: true, message: '1：供应商 2：代理商 3：个人不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询供应商信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSupplier(queryParams.value);
  supplierList.value = res.rows;
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
  supplierFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SupplierVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加供应商信息';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: SupplierVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getSupplier(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改供应商信息';
};

/** 提交按钮 */
const submitForm = () => {
  supplierFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateSupplier(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addSupplier(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('修改成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/* 查看资质文件操作 */
const handleShowFile = async (row?: SupplierVO) => {
  var type = row?.stype;
  var userid = row?.userid;
  if (type == null) {
    ElMessage.error('请先完善供应商基本信息');
    return;
  }

  proxy?.$router.push({ path: 'filetable', query: { type: type, userid: userid } });
};

/** 删除按钮操作 */
const handleDelete = async (row?: SupplierVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除供应商信息编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delSupplier(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'lvju/supplier/export',
    {
      ...queryParams.value
    },
    `supplier_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
