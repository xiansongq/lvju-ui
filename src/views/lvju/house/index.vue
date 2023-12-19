<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="用户编号" prop="userid">
            <el-input v-model="queryParams.userid" placeholder="请输入用户编号" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="供应商编号" prop="supplierid">
            <el-input v-model="queryParams.supplierid" placeholder="请输入供应商编号" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="城市" prop="cityid">
            <el-input v-model="queryParams.cityid" placeholder="请输入城市" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="小区" prop="estateid">
            <el-input v-model="queryParams.estateid" placeholder="请输入小区" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="描述" prop="describe">
            <el-input v-model="queryParams.describe" placeholder="请输入描述" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="商业描述" prop="busdescribe">
            <el-input v-model="queryParams.busdescribe" placeholder="请输入商业描述" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="queryParams.address" placeholder="请输入地址" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="房间数量" prop="num">
            <el-input v-model="queryParams.num" placeholder="请输入房间数量" clearable style="width: 240px" @keyup.enter="handleQuery" />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['lvju:house:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['lvju:house:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['lvju:house:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['lvju:house:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="houseList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" v-if="true" />
        <el-table-column label="用户编号" align="center" prop="userid" />
        <el-table-column label="供应商编号" align="center" prop="supplierid" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="城市" align="center" prop="cityid" />
        <el-table-column label="小区" align="center" prop="estateid" />
        <el-table-column label="描述" align="center" prop="describe" />
        <el-table-column label="商业描述" align="center" prop="busdescribe" />
        <el-table-column label="地址" align="center" prop="address" />
        <el-table-column label="房间数量" align="center" prop="num" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['lvju:house:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['lvju:house:remove']"></el-button>
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
    <!-- 添加或修改房源信息表对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="houseFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户编号" prop="userid">
          <el-input v-model="form.userid" placeholder="请输入用户编号" />
        </el-form-item>
        <el-form-item label="供应商编号" prop="supplierid">
          <el-input v-model="form.supplierid" placeholder="请输入供应商编号" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="城市" prop="cityid">
          <el-input v-model="form.cityid" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="小区" prop="estateid">
          <el-input v-model="form.estateid" placeholder="请输入小区" />
        </el-form-item>
        <el-form-item label="描述" prop="describe">
            <el-input v-model="form.describe" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="商业描述" prop="busdescribe">
            <el-input v-model="form.busdescribe" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>
        <el-form-item label="房间数量" prop="num">
          <el-input v-model="form.num" placeholder="请输入房间数量" />
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

<script setup name="House" lang="ts">
import { listHouse, getHouse, delHouse, addHouse, updateHouse } from '@/api/lvju/house';
import { HouseVO, HouseQuery, HouseForm } from '@/api/lvju/house/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const houseList = ref<HouseVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const houseFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: HouseForm = {
  id: undefined,
  userid: undefined,
  supplierid: undefined,
  name: undefined,
  cityid: undefined,
  estateid: undefined,
  describe: undefined,
  busdescribe: undefined,
  address: undefined,
  num: undefined,
}
const data = reactive<PageData<HouseForm, HouseQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userid: undefined,
    supplierid: undefined,
    name: undefined,
    cityid: undefined,
    estateid: undefined,
    describe: undefined,
    busdescribe: undefined,
    address: undefined,
    num: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "id不能为空", trigger: "blur" }
    ],
    userid: [
      { required: true, message: "用户编号不能为空", trigger: "blur" }
    ],
    supplierid: [
      { required: true, message: "供应商编号不能为空", trigger: "blur" }
    ],
    name: [
      { required: true, message: "名称不能为空", trigger: "blur" }
    ],
    cityid: [
      { required: true, message: "城市不能为空", trigger: "blur" }
    ],
    estateid: [
      { required: true, message: "小区不能为空", trigger: "blur" }
    ],
    describe: [
      { required: true, message: "描述不能为空", trigger: "blur" }
    ],
    busdescribe: [
      { required: true, message: "商业描述不能为空", trigger: "blur" }
    ],
    address: [
      { required: true, message: "地址不能为空", trigger: "blur" }
    ],
    num: [
      { required: true, message: "房间数量不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询房源信息表列表 */
const getList = async () => {
  loading.value = true;
  const res = await listHouse(queryParams.value);
  houseList.value = res.rows;
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
  houseFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: HouseVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加房源信息表";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: HouseVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getHouse(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改房源信息表";
}

/** 提交按钮 */
const submitForm = () => {
  houseFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateHouse(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addHouse(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: HouseVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除房源信息表编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delHouse(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('lvju/house/export', {
    ...queryParams.value
  }, `house_${new Date().getTime()}.xlsx`)
}

import { useRouter } from 'vue-router';
onMounted(() => {
  var id = (proxy?.$router.currentRoute.value.query.type);
  queryParams.value.estateid=id;
  console.log(queryParams.value.estateid);
  getList();
});
</script>
