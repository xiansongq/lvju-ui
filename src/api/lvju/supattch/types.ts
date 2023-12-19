export interface SupattchVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 用户ID
   */
  userid: string | number;

  /**
   * 附件编号
   */
  supplierid: string | number;

  /**
   * 附件名称
   */
  name: string;

  /**
   * 文件路径
   */
  path: string;

  /**
   * 文件类型/多种类型存放在字典
   */
  stype: number;

  /**
   * 是否删除
   */
  ideleted: string | number;

}

export interface SupattchForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 用户ID
   */
  userid?: string | number;

  /**
   * 附件编号
   */
  supplierid?: string | number;

  /**
   * 附件名称
   */
  name?: string;

  /**
   * 文件路径
   */
  path?: string;

  /**
   * 文件类型/多种类型存放在字典
   */
  stype?: number;

  /**
   * 是否删除
   */
  ideleted?: string | number;

}

export interface SupattchQuery extends PageQuery {

  /**
   * 用户ID
   */
  userid?: string | number;

  /**
   * 附件编号
   */
  supplierid?: string | number;

  /**
   * 附件名称
   */
  name?: string;

  /**
   * 文件路径
   */
  path?: string;

  /**
   * 文件类型/多种类型存放在字典
   */
  stype?: number;

  /**
   * 是否删除
   */
  ideleted?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



