<template>
  <!-- 个人供应商 -->
  <div v-if="agentType==2">
    <!-- <span>个人</span> -->
    <div v-if="stype==1">
      <!-- <span>供应商</span> -->
      <el-card>
        <template #header>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5"> </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>
        </template>
        <el-table :data="supattchList">
          <el-table-column label="文件名称" align="center" prop="typeName">
            <!-- <span v-for="(item, index) in lvju_file_type" :key="index">
            {{ item.label }}
          </span> -->
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <dict-tag :options="lvju_fileupload_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="上传时间" align="center" prop="createTime">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-tooltip content="下载" placement="top">
                <el-button link type="primary" icon="Download" @click="handleDownload(scope.row)" v-hasPermi="['lvju:supplier:edit']"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" @click="handDelete(scope.row)" v-hasPermi="['lvju:supplier:edit']"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div v-if="stype==2">
      <!-- <p>代理商</p> -->

      <el-card>
        <template #header>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5"> </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>
        </template>
        <el-table :data="supattchList">
          <el-table-column label="文件名称" align="center" prop="typeName">
            <!-- <span v-for="(item, index) in lvju_file_type" :key="index">
            {{ item.label }}
          </span> -->
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <dict-tag :options="lvju_fileupload_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="上传时间" align="center" prop="createTime">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-tooltip content="下载" placement="top">
                <el-button link type="primary" icon="Download" @click="handleDownload(scope.row)" v-hasPermi="['lvju:supplier:edit']"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" @click="handDelete(scope.row)" v-hasPermi="['lvju:supplier:edit']"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
  <!-- 企业供应商 -->
  <div v-if="agentType==1">
    <!-- <p>法人</p> -->
    <div v-if="stype==1">
      <!-- <p>供应商</p> -->

      <el-card>
        <template #header>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5"> </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>
        </template>
        <el-table :data="supattchList">
          <el-table-column label="文件名称" align="center" prop="typeName">
            <!-- <span v-for="(item, index) in lvju_file_type" :key="index">
            {{ item.label }}
          </span> -->
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <dict-tag :options="lvju_fileupload_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="上传时间" align="center" prop="createTime">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-tooltip content="下载" placement="top">
                <el-button link type="primary" icon="Download" @click="handleDownload(scope.row)" v-hasPermi="['lvju:supplier:edit']"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" @click="handDelete(scope.row)" v-hasPermi="['lvju:supplier:edit']"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <div v-if="stype==2">
      <!-- <p>代理商</p> -->

      <el-card>
        <template #header>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5"> </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
          </el-row>
        </template>
        <el-table :data="supattchList">
          <el-table-column label="文件名称" align="center" prop="typeName">
            <!-- <span v-for="(item, index) in lvju_file_type" :key="index">
            {{ item.label }}
          </span> -->
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status">
            <template #default="scope">
              <dict-tag :options="lvju_fileupload_status" :value="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column label="上传时间" align="center" prop="createTime">
            <template #default="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="scope">
              <el-tooltip content="下载" placement="top">
                <el-button link type="primary" icon="Download" @click="handleDownload(scope.row)" v-hasPermi="['lvju:supplier:edit']"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button link type="primary" icon="Delete" @click="handDelete(scope.row)" v-hasPermi="['lvju:supplier:edit']"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup name="filetable">
import { useRouter } from 'vue-router';
import { listSupattch, getSupattch, delSupattch, addSupattch, updateSupattch, allSupattch, deleteFunction } from '@/api/lvju/supattch';
import { SupattchVO, SupattchQuery, SupattchForm, InfoVo } from '@/api/lvju/supattch/types';
const router = useRouter();
import Vue from 'vue';
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { lvjv_supfile_type } = toRefs<any>(proxy?.useDict('lvjv_supfile_type'));
const { lvju_file_type } = toRefs<any>(proxy?.useDict('lvju_file_type'));
const { lvju_fileupload_status } = toRefs<any>(proxy?.useDict('lvju_fileupload_status'));

const userid = ref();
const stype = ref();
const agentType = ref();
const loading = ref(true);
const loading1 = ref(true);
const total = ref(0);
const fileList = ref([]);
const showSearch = ref(true);
const supattchList = ref<InfoVo[]>([]);
const agentpList = ref<InfoVo[]>([]);
const agentfList = ref<InfoVo[]>([]);
const filetype = ref(lvju_file_type);

const initFormData: SupattchForm = {
  id: undefined,
  userid: undefined,
  ossId: undefined,
  typeName: undefined,
  typeValue: undefined,
  peopleType: undefined,
  ideleted: undefined
};
const data = reactive<PageData<SupattchForm, SupattchQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userid: undefined,
    ossId: undefined,
    typeName: undefined,
    typeValue: undefined,
    ideleted: undefined,
    peopleType: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    userid: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
    ossId: [{ required: true, message: 'ossId不能为空', trigger: 'blur' }],
    typeName: [{ required: true, message: '文件名称不能为空', trigger: 'blur' }],
    typeValue: [{ required: true, message: '文件类型值不能为空', trigger: 'blur' }],
    ideleted: [{ required: true, message: '是否删除不能为空', trigger: 'change' }]
  }
});
const { queryParams, form, rules } = toRefs(data);

/* 处理个人文件列表 */
const opagentp = () => {
  /* 字典数据 因为类型是 ObjectRefImpl 所以只有通过监听变化的方式才能 */
  watch(lvju_file_type, (newVal: ObjectRefImpl) => {
    for (var i = 0; i < newVal.length; i++) {
      /* 添加数据 */
      agentpList.value.push({
        typeName: newVal[i].label,
        typeValue: newVal[i].value,
        status: '',
        ossId: '',
        createTime: ''
      });
    }
  });
  /* 做文件的匹配 */
  for (var i = 0; i < agentpList.value.length; i++) {
    var flag = 0;
    for (var j = 0; j < supattchList.value.length; j++) {
      if (agentpList.value[i].typeValue === supattchList.value[j].typeValue) {
        agentpList.value[i].status = 1;
        agentpList.value[i].ossId = supattchList.value[j].ossId;
        agentpList.value[i].createTime = supattchList.value[j].createTime;
        flag = 1;
      }
    }

    if (flag == 0) agentpList.value[i].status = 0;
  }

  //
};

/** 查询供应商资质证明材料列表 */
const getList = async () => {
  loading.value = true;
  const res = await allSupattch(queryParams.value);
  supattchList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/* 下载文件 */
const handleDownload = (row?: InfoVo) => {
  if (row?.id === null) {
    proxy?.$modal.msgError('当前文件没上传');
    return;
  }
  var ossId = row?.ossId;
  if (ossId == undefined) {
    proxy?.$modal.msgError('ossId不存在');
  } else {
    proxy?.$download.oss(ossId);
  }
};
/* 删除文件 */
const handDelete = async (row?: InfoVo) => {
  if (row?.id === null) {
    proxy?.$modal.msgError('当前文件没上传');
    return;
  }
  await proxy?.$modal.confirm('是否确认删除编号为"' + row?.id + '"的数据项？').finally(() => (loading.value = false));
  loading.value = true;
  const data = {
    id: row?.id,
    ossId: row?.ossId
  };

  await deleteFunction(data).finally(() => (loading.value = false));
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};
onMounted(async () => {
  // 首先获取传递过来的参数
  if (router.currentRoute.value.query.stype && router.currentRoute.value.query.userid && router.currentRoute.value.query.agentType) {
    stype.value = router.currentRoute.value.query.stype;
    userid.value = router.currentRoute.value.query.userid;
    agentType.value = router.currentRoute.value.query.agentType;
  }
  queryParams.value.userid = userid.value;
  queryParams.value.peopleType = agentType.value;
  getList();
  //   opagentp();
});
</script>