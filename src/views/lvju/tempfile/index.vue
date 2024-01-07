<template>
  <div class="p-2">
    <el-row :gutter="20">
      <el-col :lg="4" :xs="24" style="">
        <el-tree class="mt-2" :data="datas" @node-click="handleNodeClick" default-expand-all="true"> </el-tree>
      </el-col>
      <el-col :lg="20" :xs="24">
        <el-card shadow="never">
          <template #header>
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['lvju:tempfile:add']">新增</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['lvju:tempfile:remove']"
                  >删除</el-button
                >
              </el-col>

              <el-col :span="1.5">
                <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['lvju:tempfile:export']">导出</el-button>
              </el-col>
              <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
          </template>

          <el-table v-loading="loading" :data="tempfileList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <!-- <el-table-column label="id" align="center" prop="id" v-if="true" /> -->
            <el-table-column label="模板名称" align="center" prop="tempName" />
            <!-- <el-table-column label="文件存储id" align="center" prop="ossId" /> -->
            <el-table-column label="法人/个人" align="center" prop="agentType">
              <template #default="scope">
                <dict-tag :options="lvju_agent_type" :value="scope.row.agentType" />
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="180">
              <template #default="scope">
                <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-tooltip content="删除" placement="top">
                  <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lvju:tempfile:remove']"></el-button>
                </el-tooltip>
                <el-tooltip content="下载" placement="top">
                  <el-button link type="primary" icon="Download" @click="handleDownload(scope.row)" v-hasPermi="['lvju:tempfile:remove']"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加或修改模板文件信息管理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="tempfileFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="代理人类型" prop="agentType">
          <el-select v-model="form.agentType" placeholder="请选择法人/个人">
            <el-option v-for="dict in lvju_agent_type" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件名称" prop="tempName">
          <el-select v-if="form.agentType === 1" v-model="form.tempName" placeholder="请选择文件">
            <el-option v-for="dict in lvjv_supfile_type" :key="dict.label" :label="dict.label" :value="dict.label"></el-option>
          </el-select>
          <el-select v-if="form.agentType === 2" v-model="form.tempName" placeholder="请选择文件">
            <el-option v-for="dict in lvju_file_type" :key="dict.label" :label="dict.label" :value="dict.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件上传" prop="ossId">
          <file-upload
            v-model="form.ossId"
            :disabled="true"
            @upload-success="uploadedSuccessfully"
            :limit="1"
            :fileSize="5"
            :fileType='["jpg", "png", "jpeg", "txt", "pdf"]'
            :isShowTip="true"
          />
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

<script setup name="Tempfile" lang="ts">
import { listTempfile, getTempfile, delTempfile, addTempfile, updateTempfile } from '@/api/lvju/tempfile';
import { TempfileVO, TempfileQuery, TempfileForm } from '@/api/lvju/tempfile/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { lvju_agent_type } = toRefs<any>(proxy?.useDict('lvju_agent_type'));
const { lvjv_supfile_type } = toRefs<any>(proxy?.useDict('lvjv_supfile_type'));
const { lvju_file_type } = toRefs<any>(proxy?.useDict('lvju_file_type'));

const tempfileList = ref<TempfileVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const fileInfo = ref<any[]>([]);

const queryFormRef = ref<ElFormInstance>();
const tempfileFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const datas = [
  {
    label: '代理人类型',
    children: [
      {
        label: '法人',
        agentType: '1'
      },
      {
        label: '个人',
        agentType: '2'
      }
    ]
  }
];

const initFormData: TempfileForm = {
  id: undefined,
  tempName: undefined,
  ossId: undefined,
  agentType: undefined
};
const data = reactive<PageData<TempfileForm, TempfileQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    tempName: undefined,
    ossId: undefined,
    agentType: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    tempName: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
    ossId: [{ required: true, message: '文件存储id不能为空', trigger: 'blur' }],
    agentType: [{ required: true, message: '法人/个人不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询模板文件信息管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listTempfile(queryParams.value);
  tempfileList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 节点单击事件 */
const handleNodeClick = (data: TempfileVO) => {
  queryParams.value.agentType = data.agentType;
  handleQuery();
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  tempfileFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: TempfileVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加模板文件信息管理';
};

/* 文件上传回调 */
// const uploadedSuccessfully = async (res) => {
//   console.log(res);
//   fileInfo.value = res;
// };

/** 提交按钮 */
const submitForm = () => {
  // form.value.ossId = fileList.value.ossId;
  tempfileFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      await addTempfile(form.value).finally(() => (buttonLoading.value = false));
      proxy?.$modal.msgSuccess('上传成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: TempfileVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除模板文件信息管理编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delTempfile(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/* 下载按钮操作 */
const handleDownload = async (row?: TempfileVO) => {
  var ossId = row?.ossId;
  proxy?.$download.oss(ossId);
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'lvju/tempfile/export',
    {
      ...queryParams.value
    },
    `tempfile_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
});
</script>
