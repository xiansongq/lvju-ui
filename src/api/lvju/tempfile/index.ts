import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TempfileVO, TempfileForm, TempfileQuery } from '@/api/lvju/tempfile/types';

/**
 * 查询模板文件信息管理列表
 * @param query
 * @returns {*}
 */

export const listTempfile = (query?: TempfileQuery): AxiosPromise<TempfileVO[]> => {
  return request({
    url: '/lvju/tempfile/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询模板文件信息管理详细
 * @param id
 */
export const getTempfile = (id: string | number): AxiosPromise<TempfileVO> => {
  return request({
    url: '/lvju/tempfile/' + id,
    method: 'get'
  });
};

/**
 * 新增模板文件信息管理
 * @param data
 */
export const addTempfile = (data: TempfileForm) => {
  return request({
    url: '/lvju/tempfile',
    method: 'post',
    data: data
  });
};

/**
 * 修改模板文件信息管理
 * @param data
 */
export const updateTempfile = (data: TempfileForm) => {
  return request({
    url: '/lvju/tempfile',
    method: 'put',
    data: data
  });
};

/**
 * 删除模板文件信息管理
 * @param id
 */
export const delTempfile = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/tempfile/' + id,
    method: 'delete'
  });
};
