import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RoombookVO, RoombookForm, RoombookQuery } from '@/api/lvju/roombook/types';

/**
 * 查询房间订单信息列表
 * @param query
 * @returns {*}
 */

export const listRoombook = (query?: RoombookQuery): AxiosPromise<RoombookVO[]> => {
  return request({
    url: '/lvju/roombook/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询房间订单信息详细
 * @param id
 */
export const getRoombook = (id: string | number): AxiosPromise<RoombookVO> => {
  return request({
    url: '/lvju/roombook/' + id,
    method: 'get'
  });
};

/**
 * 新增房间订单信息
 * @param data
 */
export const addRoombook = (data: RoombookForm) => {
  return request({
    url: '/lvju/roombook',
    method: 'post',
    data: data
  });
};

/**
 * 修改房间订单信息
 * @param data
 */
export const updateRoombook = (data: RoombookForm) => {
  return request({
    url: '/lvju/roombook',
    method: 'put',
    data: data
  });
};

/**
 * 删除房间订单信息
 * @param id
 */
export const delRoombook = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/roombook/' + id,
    method: 'delete'
  });
};
