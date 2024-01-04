import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BsroomVO, BsroomForm, BsroomQuery } from '@/api/lvju/bsroom/types';

/**
 * 查询房间详细信息列表
 * @param query
 * @returns {*}
 */

export const listBsroom = (query?: BsroomQuery): AxiosPromise<BsroomVO[]> => {
  return request({
    url: '/lvju/bsroom/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询房间详细信息详细
 * @param id
 */
export const getBsroom = (id: string | number): AxiosPromise<BsroomVO> => {
  return request({
    url: '/lvju/bsroom/' + id,
    method: 'get'
  });
};

/**
 * 新增房间详细信息
 * @param data
 */
export const addBsroom = (data: BsroomForm) => {
  return request({
    url: '/lvju/bsroom',
    method: 'post',
    data: data
  });
};

/**
 * 修改房间详细信息
 * @param data
 */
export const updateBsroom = (data: BsroomForm) => {
  return request({
    url: '/lvju/bsroom',
    method: 'put',
    data: data
  });
};

/**
 * 删除房间详细信息
 * @param id
 */
export const delBsroom = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/bsroom/' + id,
    method: 'delete'
  });
};
