<template>
  <div v-if="usertype === 1">
    <p>供应商资质材料上传</p>
    <el-radio-group v-model="radiovalue">
      <el-radio v-model="radiovalue" label="1">个人申请</el-radio>
      <el-radio v-model="radiovalue" label="2">法人申请</el-radio>
    </el-radio-group>
    <el-table :data="listdata">
      <el-table-column label="文件序号" prop="key"></el-table-column>
      <el-table-column label="文件名称" prop="label"></el-table-column>
      <el-table-column label="模板下载"></el-table-column>
      <el-table-column label="文件状态"></el-table-column>
    </el-table>
  </div>
  <div v-else-if="usertype === 2">
    <p>代理商资质材料上传</p>
    <!-- <el-radio-group v-model="radiovalue"> -->
      <el-radio v-model="radiovalue" label="1">个人申请</el-radio>
      <el-radio v-model="radiovalue" label="2">法人申请</el-radio>
    <!-- </el-radio-group> -->
    <div v-if="radiovalue===1"><p>123</p></div>
    <div v-else-if="radiovalue===2 "><p>321</p></div>
    <el-table :data="listdata">
      <el-table-column label="文件序号" prop="key"></el-table-column>
      <el-table-column label="文件名称" prop="label"></el-table-column>
      <el-table-column label="文件状态"></el-table-column>
    </el-table>
  </div>
</template>

<script setup name="filetable" lang="ts">
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { lvju_supfile_type } = toRefs<any>(proxy?.useDict('lvju_supfile_type'));

import { defineComponent, reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { listSupattch, getSupattch, delSupattch, addSupattch, updateSupattch, getByuserid } from '@/api/lvju/supattch';
import { SupattchVO, SupattchQuery, SupattchForm } from '@/api/lvju/supattch/types';
const usertype = ref(0);
const router = useRouter();
const userid = ref(0);

const supattchList = ref<SupattchVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const radiovalue = ref(1);
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
  ideleted: undefined
};
const data = reactive<PageData<SupattchForm, SupattchQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userid: undefined,
    supplierid: undefined,
    name: undefined,
    path: undefined,
    stype: undefined,
    ideleted: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: 'id不能为空', trigger: 'blur' }],
    userid: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
    supplierid: [{ required: true, message: '附件编号不能为空', trigger: 'blur' }],
    name: [{ required: true, message: '附件名称不能为空', trigger: 'blur' }],
    path: [{ required: true, message: '文件路径不能为空', trigger: 'blur' }],
    stype: [{ required: true, message: '文件类型/多种类型存放在字典不能为空', trigger: 'change' }],
    ideleted: [{ required: true, message: '是否删除不能为空', trigger: 'change' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

const tabledata = ref({
  num: '',
  filename: ' ',
  filemodel: '',
  filestatus: ''
});

const listdata = ref([tabledata.value]);

/* 获取当前用户所有已经上传文件的信息 */
const getInfo = async () => {
  const res = await listSupattch(queryParams.value);
  console.log(res);
};
onMounted(() => {
  if (router.currentRoute.value.query.type && router.currentRoute.value.query.userid) {
    usertype.value = parseInt(router.currentRoute.value.query.type);
    userid.value = parseInt(router.currentRoute.value.query.userid);
  }
  queryParams.value.userid = userid.value;
  getInfo();
});
</script>
