import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CityVO, CityForm, CityQuery } from '@/api/lvju/city/types';

/**
 * 查询城市信息管理列表
 * @param query
 * @returns {*}
 */

export const listCity = (query?: CityQuery): AxiosPromise<CityVO[]> => {
  return request({
    url: '/lvju/city/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询城市信息管理详细
 * @param id
 */
export const getCity = (id: string | number): AxiosPromise<CityVO> => {
  return request({
    url: '/lvju/city/' + id,
    method: 'get'
  });
};

/**
 * 新增城市信息管理
 * @param data
 */
export const addCity = (data: CityForm) => {
  return request({
    url: '/lvju/city',
    method: 'post',
    data: data
  });
};

/**
 * 修改城市信息管理
 * @param data
 */
export const updateCity = (data: CityForm) => {
  return request({
    url: '/lvju/city',
    method: 'put',
    data: data
  });
};

/**
 * 删除城市信息管理
 * @param id
 */
export const delCity = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/city/' + id,
    method: 'delete'
  });
};
