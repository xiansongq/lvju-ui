<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="是否热门城市" prop="ishot">
            <el-input v-model="queryParams.ishot" placeholder="请输入是否热门城市" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <!-- <el-form-item label="父城市id" prop="parentid">
            <el-input v-model="queryParams.parentid" placeholder="请输入父城市id" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item> -->
          <el-form-item label="经度" prop="logtude">
            <el-input v-model="queryParams.logtude" placeholder="请输入经度" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="维度" prop="latttude">
            <el-input v-model="queryParams.latttude" placeholder="请输入维度" clearable style="width: 240px" @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd()" v-hasPermi="['lvju:city:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" plain icon="Sort" @click="handleToggleExpandAll">展开/折叠</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>
      <el-table
        v-loading="loading"
        :data="cityList"
        row-key="id"
        :default-expand-all="isExpandAll"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        ref="cityTableRef"
      >
        <el-table-column label="名称" prop="name" />
        <el-table-column label="是否热门城市" align="center" prop="ishot" />
        <el-table-column label="父城市id" align="center" prop="parentid" />
        <el-table-column label="经度" align="center" prop="logtude" />
        <el-table-column label="维度" align="center" prop="latttude" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lvju:city:edit']" />
            </el-tooltip>
            <el-tooltip content="新增" placement="top">
              <el-button link type="primary" icon="Plus" @click="handleAdd(scope.row)" v-hasPermi="['lvju:city:add']" />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lvju:city:remove']" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加或修改城市信息管理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="cityFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="是否热门城市" prop="ishot">
          <el-input v-model="form.ishot" placeholder="请输入是否是热门城市：1是 0不是" />
        </el-form-item>
        <el-form-item label="父城市id" prop="parentid">
          <el-tree-select
            v-model="form.parentid"
            :data="cityOptions"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            value-key="id"
            placeholder="请选择父城市id"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="经度" prop="logtude">
          <el-input v-model="form.logtude" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="维度" prop="latttude">
          <el-input v-model="form.latttude" placeholder="请输入维度" />
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

<script setup name="City" lang="ts">
import { listCity, getCity, delCity, addCity, updateCity } from "@/api/lvju/city";
import { CityVO, CityQuery, CityForm } from '@/api/lvju/city/types';

type CityOption = {
  id: number;
  name: string;
  children?: CityOption[];
}

const { proxy } = getCurrentInstance() as ComponentInternalInstance;;


const cityList = ref<CityVO[]>([]);
const cityOptions = ref<CityOption[]>([]);
const buttonLoading = ref(false);
const showSearch = ref(true);
const isExpandAll = ref(true);
const loading = ref(false);

const queryFormRef = ref<ElFormInstance>();
const cityFormRef = ref<ElFormInstance>();
const cityTableRef = ref<ElTableInstance>()

const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
});


const initFormData: CityForm = {
    id: undefined,
    name: undefined,
    ishot: undefined,
    parentid: undefined,
    logtude: undefined,
    latttude: undefined,
}

const data = reactive<PageData<CityForm, CityQuery>>({
  form: {...initFormData},
  queryParams: {
    name: undefined,
    ishot: undefined,
    parentid: undefined,
    logtude: undefined,
    latttude: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "id不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    ishot: [
      { required: true, message: "是否热门城市", trigger: "blur" }
    ],
    parentid: [
      { required: true, message: "父城市id不能为空", trigger: "blur" }
    ],
    logtude: [
      { required: true, message: "经度不能为空", trigger: "blur" }
    ],
    latttude: [
      { required: true, message: "维度不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询城市信息管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCity(queryParams.value);
  const data = proxy?.handleTree<CityVO>(res.data, "id", "parentid");
  if (data) {
    cityList.value = data;
    loading.value = false;
  }
}

/** 查询城市信息管理下拉树结构 */
const getTreeselect = async () => {
  const res = await listCity();
  cityOptions.value = [];
  const data: CityOption = { id: 0, name: '顶级节点', children: [] };
  data.children = proxy?.handleTree<CityOption>(res.data, "id", "parentid");
  cityOptions.value.push(data);
}

// 取消按钮
const cancel = () => {
  reset();
  dialog.visible = false;
}

// 表单重置
const reset = () => {
  form.value = {...initFormData}
  cityFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}
 
/** 新增按钮操作 */
const handleAdd = (row?: CityVO) => {
  reset();
  console.log(row);
  getTreeselect();
  if (row != null && row.id) {
      form.value.parentid = row.id;
  } else {
      form.value.parentid = 0;
  }
  dialog.visible = true;
  dialog.title = "添加城市信息管理";
}

/** 展开/折叠操作 */
const handleToggleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value;
  toggleExpandAll(cityList.value, isExpandAll.value)
}

/** 展开/折叠操作 */
const toggleExpandAll = (data: CityVO[], status: boolean) => {
  data.forEach((item) => {
    cityTableRef.value?.toggleRowExpansion(item, status)
    if (item.children && item.children.length > 0) toggleExpandAll(item.children, status)
  })
}

/** 修改按钮操作 */
const handleUpdate = async (row: CityVO) => {
  reset();
  console.log(row);

  await getTreeselect();
  if (row != null) {
    form.value.parentid = row.parentid;
  }
  const res = await getCity(row.id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改城市信息管理";
}

/** 提交按钮 */
const submitForm = () => {
  cityFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateCity(form.value).finally(() => buttonLoading.value = false);
      } else {
        await addCity(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row: CityVO) => {
  await proxy?.$modal.confirm('是否确认删除城市信息管理编号为"' + row.id + '"的数据项？');
  loading.value = true;
  await delCity(row.id).finally(() => loading.value = false);
  await getList();
  proxy?.$modal.msgSuccess("删除成功");
}

onMounted(() => {
  getList();
});
</script>
