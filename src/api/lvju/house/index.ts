import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { HouseVO, HouseForm, HouseQuery } from '@/api/lvju/house/types';

/**
 * 查询房源信息表列表
 * @param query
 * @returns {*}
 */

export const listHouse = (query?: HouseQuery): AxiosPromise<HouseVO[]> => {
  return request({
    url: '/lvju/house/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询房源信息表详细
 * @param id
 */
export const getHouse = (id: string | number): AxiosPromise<HouseVO> => {
  return request({
    url: '/lvju/house/' + id,
    method: 'get'
  });
};

/**
 * 新增房源信息表
 * @param data
 */
export const addHouse = (data: HouseForm) => {
  return request({
    url: '/lvju/house',
    method: 'post',
    data: data
  });
};

/**
 * 修改房源信息表
 * @param data
 */
export const updateHouse = (data: HouseForm) => {
  return request({
    url: '/lvju/house',
    method: 'put',
    data: data
  });
};

/**
 * 删除房源信息表
 * @param id
 */
export const delHouse = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/house/' + id,
    method: 'delete'
  });
};
