import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RoompriceVO, RoompriceForm, RoompriceQuery } from '@/api/lvju/roomprice/types';

/**
 * 查询房间价格信息列表
 * @param query
 * @returns {*}
 */

export const listRoomprice = (query?: RoompriceQuery): AxiosPromise<RoompriceVO[]> => {
  return request({
    url: '/lvju/roomprice/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询房间价格信息详细
 * @param id
 */
export const getRoomprice = (id: string | number): AxiosPromise<RoompriceVO> => {
  return request({
    url: '/lvju/roomprice/' + id,
    method: 'get'
  });
};

/**
 * 新增房间价格信息
 * @param data
 */
export const addRoomprice = (data: RoompriceForm) => {
  return request({
    url: '/lvju/roomprice',
    method: 'post',
    data: data
  });
};

/**
 * 修改房间价格信息
 * @param data
 */
export const updateRoomprice = (data: RoompriceForm) => {
  return request({
    url: '/lvju/roomprice',
    method: 'put',
    data: data
  });
};

/**
 * 删除房间价格信息
 * @param id
 */
export const delRoomprice = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/roomprice/' + id,
    method: 'delete'
  });
};
