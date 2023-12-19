export interface SupplierVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 用户编号
   */
  userid: string | number;

  /**
   * 公司名称
   */
  company: string;

  /**
   * 联系人
   */
  name: string;

  /**
   * 身份证号
   */
  sdnum: string;

  /**
   * 联系电话
   */
  iphone: string;

  /**
   * 1：供应商 2：代理商 3：个人
   */
  stype: number;

  /**
   * 创建时间
   */
  createTime: string;

}

export interface SupplierForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 用户编号
   */
  userid?: string | number;

  /**
   * 公司名称
   */
  company?: string;

  /**
   * 联系人
   */
  name?: string;

  /**
   * 身份证号
   */
  sdnum?: string;

  /**
   * 联系电话
   */
  iphone?: string;

  /**
   * 1：供应商 2：代理商 3：个人
   */
  stype?: number;

}

export interface SupplierQuery extends PageQuery {

  /**
   * 用户编号
   */
  userid?: string | number;

  /**
   * 公司名称
   */
  company?: string;

  /**
   * 联系人
   */
  name?: string;

  /**
   * 身份证号
   */
  sdnum?: string;

  /**
   * 联系电话
   */
  iphone?: string;

  /**
   * 1：供应商 2：代理商 3：个人
   */
  stype?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



