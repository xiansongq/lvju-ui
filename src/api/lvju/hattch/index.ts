import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { HattchVO, HattchForm, HattchQuery } from '@/api/lvju/hattch/types';

/**
 * 查询房源附件信息列表
 * @param query
 * @returns {*}
 */

export const listHattch = (query?: HattchQuery): AxiosPromise<HattchVO[]> => {
  return request({
    url: '/lvju/hattch/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询房源附件信息详细
 * @param id
 */
export const getHattch = (id: string | number): AxiosPromise<HattchVO> => {
  return request({
    url: '/lvju/hattch/' + id,
    method: 'get'
  });
};

/**
 * 新增房源附件信息
 * @param data
 */
export const addHattch = (data: HattchForm) => {
  return request({
    url: '/lvju/hattch',
    method: 'post',
    data: data
  });
};

/**
 * 修改房源附件信息
 * @param data
 */
export const updateHattch = (data: HattchForm) => {
  return request({
    url: '/lvju/hattch',
    method: 'put',
    data: data
  });
};

/**
 * 删除房源附件信息
 * @param id
 */
export const delHattch = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/hattch/' + id,
    method: 'delete'
  });
};
