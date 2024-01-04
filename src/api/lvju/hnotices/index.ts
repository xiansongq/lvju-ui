import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { HnoticesVO, HnoticesForm, HnoticesQuery } from '@/api/lvju/hnotices/types';

/**
 * 查询房源预定须知列表
 * @param query
 * @returns {*}
 */

export const listHnotices = (query?: HnoticesQuery): AxiosPromise<HnoticesVO[]> => {
  return request({
    url: '/lvju/hnotices/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询房源预定须知详细
 * @param id
 */
export const getHnotices = (id: string | number): AxiosPromise<HnoticesVO> => {
  return request({
    url: '/lvju/hnotices/' + id,
    method: 'get'
  });
};

/**
 * 新增房源预定须知
 * @param data
 */
export const addHnotices = (data: HnoticesForm) => {
  return request({
    url: '/lvju/hnotices',
    method: 'post',
    data: data
  });
};

/**
 * 修改房源预定须知
 * @param data
 */
export const updateHnotices = (data: HnoticesForm) => {
  return request({
    url: '/lvju/hnotices',
    method: 'put',
    data: data
  });
};

/**
 * 删除房源预定须知
 * @param id
 */
export const delHnotices = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/hnotices/' + id,
    method: 'delete'
  });
};
