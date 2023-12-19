<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="用户ID" prop="userid">
            <el-input v-model="queryParams.userid" placeholder="请输入用户ID" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="附件编号" prop="supplierid">
            <el-input v-model="queryParams.supplierid" placeholder="请输入附件编号" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="附件名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入附件名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="文件路径" prop="path">
            <el-input v-model="queryParams.path" placeholder="请输入文件路径" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="文件类型/多种类型存放在字典" prop="stype">
            <el-select v-model="queryParams.stype" placeholder="请选择文件类型/多种类型存放在字典" clearable>
              <el-option
                v-for="dict in lvjv_supfile_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否删除" prop="ideleted">
            <el-select v-model="queryParams.ideleted" placeholder="请选择是否删除" clearable>
              <el-option
                v-for="dict in lvju_delete_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['lvju:supattch:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['lvju:supattch:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['lvju:supattch:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['lvju:supattch:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="supattchList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="用户ID" align="center" prop="userid" />
        <el-table-column label="附件编号" align="center" prop="supplierid" />
        <el-table-column label="附件名称" align="center" prop="name" />
        <el-table-column label="文件路径" align="center" prop="path" />
        <el-table-column label="文件类型/多种类型存放在字典" align="center" prop="stype">
          <template #default="scope">
            <dict-tag :options="lvjv_supfile_type" :value="scope.row.stype"/>
          </template>
        </el-table-column>
        <el-table-column label="是否删除" align="center" prop="ideleted">
          <template #default="scope">
            <dict-tag :options="lvju_delete_type" :value="scope.row.ideleted"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lvju:supattch:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lvju:supattch:remove']"></el-button>
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
    <!-- 添加或修改供应商资质证明材料对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="supattchFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userid">
          <el-input v-model="form.userid" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="附件编号" prop="supplierid">
          <el-input v-model="form.supplierid" placeholder="请输入附件编号" />
        </el-form-item>
        <el-form-item label="附件名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入附件名称" />
        </el-form-item>
        <el-form-item label="文件路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入文件路径" />
        </el-form-item>
        <el-form-item label="文件类型/多种类型存放在字典" prop="stype">
          <el-select v-model="form.stype" placeholder="请选择文件类型/多种类型存放在字典">
            <el-option
                v-for="dict in lvjv_supfile_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否删除" prop="ideleted">
          <el-select v-model="form.ideleted" placeholder="请选择是否删除">
            <el-option
                v-for="dict in lvju_delete_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
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

<script setup name="Supattch" lang="ts">
import { listSupattch, getSupattch, delSupattch, addSupattch, updateSupattch } from '@/api/lvju/supattch';
import { SupattchVO, SupattchQuery, SupattchForm } from '@/api/lvju/supattch/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { lvjv_supfile_type, lvju_delete_type } = toRefs<any>(proxy?.useDict('lvjv_supfile_type', 'lvju_delete_type'));

const supattchList = ref<SupattchVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const supattchFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: SupattchForm = {
  id: undefined,
  userid: undefined,
  supplierid: undefined,
  name: undefined,
  path: undefined,
  stype: undefined,
  ideleted: undefined,
}
const data = reactive<PageData<SupattchForm, SupattchQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userid: undefined,
    supplierid: undefined,
    name: undefined,
    path: undefined,
    stype: undefined,
    ideleted: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "id不能为空", trigger: "blur" }
    ],
    userid: [
      { required: true, message: "用户ID不能为空", trigger: "blur" }
    ],
    supplierid: [
      { required: true, message: "附件编号不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "附件名称不能为空", trigger: "blur" }
    ],
    path: [
      { required: true, message: "文件路径不能为空", trigger: "blur" }
    ],
    stype: [
      { required: true, message: "文件类型/多种类型存放在字典不能为空", trigger: "change" }
    ],
    ideleted: [
      { required: true, message: "是否删除不能为空", trigger: "change" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询供应商资质证明材料列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSupattch(queryParams.value);
  supattchList.value = res.rows;
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
  supattchFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: SupattchVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加供应商资质证明材料";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SupattchVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getSupattch(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改供应商资质证明材料";
}

/** 提交按钮 */
const submitForm = () => {
  supattchFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateSupattch(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addSupattch(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SupattchVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除供应商资质证明材料编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delSupattch(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('lvju/supattch/export', {
    ...queryParams.value
  }, `supattch_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
