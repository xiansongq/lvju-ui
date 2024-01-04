<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="姓名" prop="sname">
            <el-input v-model="queryParams.sname" placeholder="请输入姓名" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="身份证号码" prop="sdnum">
            <el-input v-model="queryParams.sdnum" placeholder="请输入身份证号码" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="手机号码" prop="iphone">
            <el-input v-model="queryParams.iphone" placeholder="请输入手机号码" clearable style="width: 240px" @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['lvju:customer:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['lvju:customer:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['lvju:customer:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['lvju:customer:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="customerList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="false" />
        <el-table-column label="姓名" align="center" prop="sname" />
        <el-table-column label="身份证号码" align="center" prop="sdnum" />
        <el-table-column label="性别" align="center" prop="ssex" />
        <el-table-column label="手机号码" align="center" prop="iphone" />
        <el-table-column label="紧急联系电话" align="center" prop="imiphone" />
        <el-table-column label="紧急联系人" align="center" prop="imname" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lvju:customer:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lvju:customer:remove']"></el-button>
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
    <!-- 添加或修改客户信息管理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="customerFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="sname">
          <el-input v-model="form.sname" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="身份证号码" prop="sdnum">
          <el-input v-model="form.sdnum" placeholder="请输入身份证号码" />
        </el-form-item>
        <el-form-item label="出生年月日" prop="sbirth">
          <el-input v-model="form.sbirth" placeholder="请输入出生年月日" />
        </el-form-item>
        <el-form-item label="手机号码" prop="iphone">
          <el-input v-model="form.iphone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="紧急联系电话" prop="imiphone">
          <el-input v-model="form.imiphone" placeholder="请输入紧急联系电话" />
        </el-form-item>
        <el-form-item label="紧急联系人" prop="imname">
          <el-input v-model="form.imname" placeholder="请输入紧急联系人" />
        </el-form-item>
        <el-form-item label="照片" prop="sphoto">
          <image-upload v-model="form.sphoto"/>
        </el-form-item>
        <el-form-item label="积分" prop="integral">
          <el-input v-model="form.integral" placeholder="请输入积分" />
        </el-form-item>
        <el-form-item label="住宿时长" prop="classh">
          <el-input v-model="form.classh" placeholder="请输入住宿时长" />
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-input v-model="form.level" placeholder="请输入等级" />
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

<script setup name="Customer" lang="ts">
import { listCustomer, getCustomer, delCustomer, addCustomer, updateCustomer } from '@/api/lvju/customer';
import { CustomerVO, CustomerQuery, CustomerForm } from '@/api/lvju/customer/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const customerList = ref<CustomerVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const customerFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CustomerForm = {
  id: undefined,
  userid: undefined,
  sname: undefined,
  sdnum: undefined,
  ssex: undefined,
  sbirth: undefined,
  iphone: undefined,
  imiphone: undefined,
  imname: undefined,
  sphoto: undefined,
  integral: undefined,
  classh: undefined,
  level: undefined,
  isaudi: undefined,
}
const data = reactive<PageData<CustomerForm, CustomerQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    sname: undefined,
    sdnum: undefined,
    ssex: undefined,
    iphone: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "id不能为空", trigger: "blur" }
    ],
    sname: [
      { required: true, message: "姓名不能为空", trigger: "blur" }
    ],
    sdnum: [
      { required: true, message: "身份证号码不能为空", trigger: "blur" }
    ],
    ssex: [
      { required: true, message: "性别不能为空", trigger: "change" }
    ],
    iphone: [
      { required: true, message: "手机号码不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询客户信息管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCustomer(queryParams.value);
  customerList.value = res.rows;
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
  customerFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: CustomerVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加客户信息管理";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: CustomerVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getCustomer(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改客户信息管理";
}

/** 提交按钮 */
const submitForm = () => {
  customerFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCustomer(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCustomer(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CustomerVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除客户信息管理编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delCustomer(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('lvju/customer/export', {
    ...queryParams.value
  }, `customer_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
