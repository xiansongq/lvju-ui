export interface TenantsVO {
  /**
   * 预定房间编号
   */
  roomstusid: string | number;

  /**
   * 租客名称
   */
  name: string;

  /**
   * 身份证
   */
  sdno: string;

  /**
   * 电话号码
   */
  iphone: string;

}

export interface TenantsForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 客户编号
   */
  customerid?: string | number;

  /**
   * 预定房间编号
   */
  roomstusid?: string | number;

  /**
   * 租客名称
   */
  name?: string;

  /**
   * 身份证
   */
  sdno?: string;

  /**
   * 电话号码
   */
  iphone?: string;

}

export interface TenantsQuery extends PageQuery {

  /**
   * 预定房间编号
   */
  roomstusid?: string | number;

  /**
   * 租客名称
   */
  name?: string;

  /**
   * 身份证
   */
  sdno?: string;

  /**
   * 电话号码
   */
  iphone?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



