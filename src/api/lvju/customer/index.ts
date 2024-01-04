import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { CustomerVO, CustomerForm, CustomerQuery } from '@/api/lvju/customer/types';

/**
 * 查询客户信息管理列表
 * @param query
 * @returns {*}
 */

export const listCustomer = (query?: CustomerQuery): AxiosPromise<CustomerVO[]> => {
  return request({
    url: '/lvju/customer/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询客户信息管理详细
 * @param id
 */
export const getCustomer = (id: string | number): AxiosPromise<CustomerVO> => {
  return request({
    url: '/lvju/customer/' + id,
    method: 'get'
  });
};

/**
 * 新增客户信息管理
 * @param data
 */
export const addCustomer = (data: CustomerForm) => {
  return request({
    url: '/lvju/customer',
    method: 'post',
    data: data
  });
};

/**
 * 修改客户信息管理
 * @param data
 */
export const updateCustomer = (data: CustomerForm) => {
  return request({
    url: '/lvju/customer',
    method: 'put',
    data: data
  });
};

/**
 * 删除客户信息管理
 * @param id
 */
export const delCustomer = (id: string | number | Array<string | number>) => {
  return request({
    url: '/lvju/customer/' + id,
    method: 'delete'
  });
};
