<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="文件名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入文件名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="文件类型" prop="htype">
            <el-select v-model="queryParams.htype" placeholder="请选择文件类型" clearable>
              <el-option v-for="dict in lvju_housefile_type" :key="dict.value" :label="dict.label" :value="dict.value" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['lvju:hattch:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['lvju:hattch:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['lvju:hattch:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['lvju:hattch:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="hattchList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <!-- <el-table-column label="房源id" align="center" prop="houseid" /> -->
        <el-table-column label="原始名称" align="center" prop="ossInfo.originalName" />

        <el-table-column label="保存路径" align="center" prop="path">
          <template #default="scope">
            <el-image v-if="scope.row.htype==0" :src="scope.row.ossInfo.url" min-width="70" height="70" />
            <span v-text="scope.row.ossInfo.url" v-if="scope.row.htype==1" />
          </template>
        </el-table-column>
        <el-table-column label="文件类型" align="center" prop="htype">
          <template #default="scope">
            <dict-tag :options="lvju_housefile_type" :value="scope.row.htype" />
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
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lvju:hattch:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lvju:hattch:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改房源附件信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="hattchFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="保存路径" prop="path">
          <file-upload
            v-model="form.path"
            :disabled="true"
            @upload-success="uploadedSuccessfully"
            :uploadUrl="'/lvju/file/upload'"
            :limit="1"
            :fileSize="5"
            :fileType='["jpg", "png", "jpeg", "txt", "pdf"]'
            :isShowTip="true"
          />
          <!-- 此时在前端配置的上传路径 会被组件中设置的默认地址覆盖 文件全部上传到oos服务商 -->
        </el-form-item>
        <el-form-item label="文件类型" prop="htype">
          <el-select v-model="form.htype" placeholder="请选择文件类型">
            <el-option v-for="dict in lvju_housefile_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
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

<script setup name="Hattch" lang="ts">
import { listHattch, getHattch, delHattch, addHattch, updateHattch } from '@/api/lvju/hattch';
import { HattchVO, HattchQuery, HattchForm } from '@/api/lvju/hattch/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { lvju_housefile_type } = toRefs<any>(proxy?.useDict('lvju_housefile_type'));
const hattchList = ref<HattchVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const houseid = ref(0);
const fileList = ref<any[]>([]);
const queryFormRef = ref<ElFormInstance>();
const hattchFormRef = ref<ElFormInstance>();
const baseUrl = import.meta.env.VITE_APP_BASE_API;

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
import { propTypes } from '@/utils/propTypes';

const initFormData: HattchForm = {
  id: undefined,
  houseid: undefined,
  ossId: undefined,
  htype: undefined
};
const data = reactive<PageData<HattchForm, HattchQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    houseid: undefined,
    htype: undefined,
    params: {}
  },
  rules: {
    htype: [{ required: true, message: '文件类型', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询房源附件信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listHattch(queryParams.value);
  hattchList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/* 上传文件成功响应 */
const uploadedSuccessfully = (res) => {

  fileList.value = res;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  hattchFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: HattchVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();

  dialog.visible = true;
  dialog.title = '添加房源附件信息';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: HattchVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getHattch(_id);
  Object.assign(form.value, res.data);

  dialog.visible = true;
  dialog.title = '修改房源附件信息';
};

/** 提交按钮 */
const submitForm = () => {
  if (form.value.id) {
    /* 修改 */
    if (fileList.value.length != 0) {
      // form.value.name = fileList.value[0].filename;
      // form.value.path = fileList.value[0].filepath;
      form.value.ossId = fileList.value[0].ossId;
      form.value.houseid = houseid.value;
    }
    hattchFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        await updateHattch(form.value).finally(() => (buttonLoading.value = false));

        proxy?.$modal.msgSuccess('修改成功');
        dialog.visible = false;
        await getList();
      }
    });
  } else {
    /* 添加 ，必须上传文件*/
    if (fileList.value.length == 0) {
      proxy?.$modal.msgError('请先上传文件');
      return;
    }
    // form.value.name = fileList.value[0].filename;
    // form.value.path = fileList.value[0].filepath;
    form.value.ossId = fileList.value[0].ossId;
    form.value.houseid = houseid.value;
    hattchFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        await addHattch(form.value).finally(() => (buttonLoading.value = false));
        proxy?.$modal.msgSuccess('上传成功');
        dialog.visible = false;
        await getList();
      }
    });
  }
};

/** 删除按钮操作 */
const handleDelete = async (row?: HattchVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除房源附件信息编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delHattch(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'lvju/hattch/export',
    {
      ...queryParams.value
    },
    `hattch_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  var id = proxy?.$router.currentRoute.value.query.id;
  if (id) {
    queryParams.value.id = id;
    houseid.value = id;
    getList();
  }
});
</script>
