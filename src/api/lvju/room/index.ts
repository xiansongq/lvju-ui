import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RoomVO, RoomForm, RoomQuery } from '@/api/lvju/room/types';

/**
 * 查询房间信息管理列表
 * @param query
 * @returns {*}
 */

export const listRoom = (query?: RoomQuery): AxiosPromise<RoomVO[]> => {
  return request({
    url: '/lvju/room/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询房间信息管理详细
 * @param id
 */
export const getRoom = (id: string | number): AxiosPromise<RoomVO> => {
  return request({
    url: '/lvju/room/' + id,
    method: 'get'
  });
};

/**
 * 新增房间信息管理
 * @param data
 */
export const addRoom = (data: RoomForm) => {
  return request({
    url: '/lvju/room',
    method: 'post',
    data: data
  });
};

/**
 * 修改房间信息管理
 * @param data
 */
export const updateRoom = (data: RoomForm) => {
  return request({
    url: '/lvju/room',
    method: 'put',
    data: data
  });
};

/**
 * 删除房间信息管理
 * @param id
 */
export const delRoom = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/room/' + id,
    method: 'delete'
  });
};
