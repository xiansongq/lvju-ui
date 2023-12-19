import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { SupattchVO, SupattchForm, SupattchQuery } from '@/api/lvju/supattch/types';

/**
 * 查询供应商资质证明材料列表
 * @param query
 * @returns {*}
 */

export const listSupattch = (query?: SupattchQuery): AxiosPromise<SupattchVO[]> => {
  return request({
    url: '/lvju/supattch/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询供应商资质证明材料详细
 * @param id
 */
export const getSupattch = (id: string | number): AxiosPromise<SupattchVO> => {
  return request({
    url: '/lvju/supattch/' + id,
    method: 'get'
  });
};

/**
 * 新增供应商资质证明材料
 * @param data
 */
export const addSupattch = (data: SupattchForm) => {
  return request({
    url: '/lvju/supattch',
    method: 'post',
    data: data
  });
};

/**
 * 修改供应商资质证明材料
 * @param data
 */
export const updateSupattch = (data: SupattchForm) => {
  return request({
    url: '/lvju/supattch',
    method: 'put',
    data: data
  });
};

/**
 * 删除供应商资质证明材料
 * @param id
 */
export const delSupattch = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/supattch/' + id,
    method: 'delete'
  });
};

/* 
* 根据userid 查询list数据
* @param userid
*/

export const getByuserid = (userid: string |number )=>{
  return request({
    url:'lvju/supattch/'+userid,
    method:'get'
  });
};

