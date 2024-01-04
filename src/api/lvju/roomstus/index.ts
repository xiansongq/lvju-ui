import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { RoomstusVO, RoomstusForm, RoomstusQuery } from '@/api/lvju/roomstus/types';

/**
 * 查询房间预定信息列表
 * @param query
 * @returns {*}
 */

export const listRoomstus = (query?: RoomstusQuery): AxiosPromise<RoomstusVO[]> => {
  return request({
    url: '/lvju/roomstus/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询房间预定信息详细
 * @param id
 */
export const getRoomstus = (id: string | number): AxiosPromise<RoomstusVO> => {
  return request({
    url: '/lvju/roomstus/' + id,
    method: 'get'
  });
};

/**
 * 新增房间预定信息
 * @param data
 */
export const addRoomstus = (data: RoomstusForm) => {
  return request({
    url: '/lvju/roomstus',
    method: 'post',
    data: data
  });
};

/**
 * 修改房间预定信息
 * @param data
 */
export const updateRoomstus = (data: RoomstusForm) => {
  return request({
    url: '/lvju/roomstus',
    method: 'put',
    data: data
  });
};

/**
 * 删除房间预定信息
 * @param id
 */
export const delRoomstus = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/roomstus/' + id,
    method: 'delete'
  });
};
