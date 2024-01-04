import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TenantsVO, TenantsForm, TenantsQuery } from '@/api/lvju/tenants/types';

/**
 * 查询租客用户信息列表
 * @param query
 * @returns {*}
 */

export const listTenants = (query?: TenantsQuery): AxiosPromise<TenantsVO[]> => {
  return request({
    url: '/lvju/tenants/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询租客用户信息详细
 * @param id
 */
export const getTenants = (id: string | number): AxiosPromise<TenantsVO> => {
  return request({
    url: '/lvju/tenants/' + id,
    method: 'get'
  });
};

/**
 * 新增租客用户信息
 * @param data
 */
export const addTenants = (data: TenantsForm) => {
  return request({
    url: '/lvju/tenants',
    method: 'post',
    data: data
  });
};

/**
 * 修改租客用户信息
 * @param data
 */
export const updateTenants = (data: TenantsForm) => {
  return request({
    url: '/lvju/tenants',
    method: 'put',
    data: data
  });
};

/**
 * 删除租客用户信息
 * @param id
 */
export const delTenants = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/tenants/' + id,
    method: 'delete'
  });
};
