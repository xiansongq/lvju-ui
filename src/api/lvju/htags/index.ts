import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { HtagsVO, HtagsForm, HtagsQuery } from '@/api/lvju/htags/types';

/**
 * 查询房源标签信息列表
 * @param query
 * @returns {*}
 */

export const listHtags = (query?: HtagsQuery): AxiosPromise<HtagsVO[]> => {
  return request({
    url: '/lvju/htags/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询房源标签信息详细
 * @param id
 */
export const getHtags = (id: string | number): AxiosPromise<HtagsVO> => {
  return request({
    url: '/lvju/htags/' + id,
    method: 'get'
  });
};

/**
 * 新增房源标签信息
 * @param data
 */
export const addHtags = (data: HtagsForm) => {
  return request({
    url: '/lvju/htags',
    method: 'post',
    data: data
  });
};

/**
 * 修改房源标签信息
 * @param data
 */
export const updateHtags = (data: HtagsForm) => {
  return request({
    url: '/lvju/htags',
    method: 'put',
    data: data
  });
};

/**
 * 删除房源标签信息
 * @param id
 */
export const delHtags = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/htags/' + id,
    method: 'delete'
  });
};
