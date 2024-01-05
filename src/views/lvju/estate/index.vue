<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="城市名" prop="cityname">
            <el-input v-model="queryParams.cityname" placeholder="请输入城市" clearable style="width: 240px" @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['lvju:estate:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['lvju:estate:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['lvju:estate:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['lvju:estate:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="estateList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="城市" align="center" prop="cityname" />
        <el-table-column label="经度" align="center" prop="logtude" />
        <el-table-column label="纬度" align="center" prop="lattude" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lvju:estate:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lvju:estate:remove']"></el-button>
            </el-tooltip>
            <el-tooltip content="查看房源" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleShowHouse(scope.row)" v-hasPermi="['lvju:estate:edit']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改小区信息操作对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="estateFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="城市" prop="cityid">
          <el-select v-model="form.cityid" placeholder="请选择">
            <el-option v-for="item in citylist" :key="item.id" :label="item.name" :value="item.id"> </el-option>
          </el-select>
          <!-- <el-input v-model="form.cityid" placeholder="请输入城市" /> -->
        </el-form-item>
        <el-form-item label="经度" prop="logtude">
          <el-input v-model="form.logtude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度" prop="lattude">
          <el-input v-model="form.lattude" placeholder="请输入纬度" />
        </el-form-item>
        <el-form-item label="描述" prop="describe">
          <el-input v-model="form.describe" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="商业介绍" prop="busdescribe">
          <el-input v-model="form.busdescribe" type="textarea" placeholder="请输入内容" />
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

<script setup name="Estate" lang="ts">
import { listEstate, getEstate, delEstate, addEstate, updateEstate } from '@/api/lvju/estate';
import { EstateVO, EstateQuery, EstateForm } from '@/api/lvju/estate/types';
import { CityVO } from '@/api/lvju/city/types';
import { listCity } from '@/api/lvju/city';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const estateList = ref<EstateVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const citylist = ref<CityVO[]>([]);

const queryFormRef = ref<ElFormInstance>();
const estateFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: EstateForm = {
  id: undefined,
  name: undefined,
  cityid: undefined,
  cityname: undefined,

  logtude: undefined,
  lattude: undefined,
  describe: undefined,
  busdescribe: undefined
};
const data = reactive<PageData<EstateForm, EstateQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    cityid: undefined,
    cityname: undefined,
    logtude: undefined,
    lattude: undefined,
    createTime: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
    cityid: [{ required: true, message: '城市不能为空', trigger: 'blur' }],
    logtude: [{ required: true, message: '经度不能为空', trigger: 'blur' }],
    lattude: [{ required: true, message: '纬度不能为空', trigger: 'blur' }],
    describe: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
    busdescribe: [{ required: true, message: '商业介绍不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

// const getCityName =(cityId?:string | number)=>{
//   for(var i=0;i<citylist.value.length;i++){

//     if(citylist.value[i].id===cityId){
//       return citylist.value[i].name;
//     }
//   }
// }

/** 查询小区信息操作列表 */
const getList = async () => {
  loading.value = true;
  const res = await listEstate(queryParams.value);
  estateList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/* 查看所属小区的房源 */
const handleShowHouse = async (row?: EstateVO) => {
  // 获取小区id
  var estateid = row?.id;
  // 跳转
  proxy?.$router.push({ path: '/houselist', query: { estateid: estateid, name: row?.name, cityid: row?.cityid } });
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/* 获取城市数据 */
const getCityList = async () => {
  loading.value = true;
  const res = await listCity();
  citylist.value = res.data;
  loading.value = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  estateFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  // 将其中的 cityname 转为对应的cityid
  if (queryParams.value.cityname != null) {
    for (var i = 0; i < citylist.value.length; i++) {
      if (citylist.value[i].name == queryParams.value.cityname) queryParams.value.cityid = citylist.value[i].id;
    }
  }
  if (queryParams.value.cityid === undefined) {
    proxy?.$modal.alertWarning('当前城市未开通！');
    return;
  }
  console.log(queryParams.value);
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: EstateVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加小区信息操作';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: EstateVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getEstate(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改小区信息操作';
};

/** 提交按钮 */
const submitForm = () => {
  estateFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateEstate(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addEstate(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('修改成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: EstateVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除小区信息操作编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delEstate(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'lvju/estate/export',
    {
      ...queryParams.value
    },
    `estate_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getCityList();
  getList();
});
</script>
