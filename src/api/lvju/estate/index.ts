import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { EstateVO, EstateForm, EstateQuery } from '@/api/lvju/estate/types';

/**
 * 查询小区信息操作列表
 * @param query
 * @returns {*}
 */

export const listEstate = (query?: EstateQuery): AxiosPromise<EstateVO[]> => {
  return request({
    url: '/lvju/estate/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询小区信息操作详细
 * @param id
 */
export const getEstate = (id: string | number): AxiosPromise<EstateVO> => {
  return request({
    url: '/lvju/estate/' + id,
    method: 'get'
  });
};

/**
 * 新增小区信息操作
 * @param data
 */
export const addEstate = (data: EstateForm) => {
  return request({
    url: '/lvju/estate',
    method: 'post',
    data: data
  });
};

/**
 * 修改小区信息操作
 * @param data
 */
export const updateEstate = (data: EstateForm) => {
  return request({
    url: '/lvju/estate',
    method: 'put',
    data: data
  });
};

/**
 * 删除小区信息操作
 * @param id
 */
export const delEstate = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/estate/' + id,
    method: 'delete'
  });
};
