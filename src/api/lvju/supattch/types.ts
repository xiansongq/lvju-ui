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
   * ossId
   */
  ossId: string | number;

  /**
   * 文件名称
   */
  typeName: string;

  /**
   * 文件类型值
   */
  typeValue: number;

  /**
   * 是否删除
   */
  ideleted: string | number;

  /**
   * 创建时间
   */
  createTime: string;

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
   * ossId
   */
  ossId?: string | number;

  /**
   * 文件名称
   */
  typeName?: string;

  /**
   * 文件类型值
   */
  typeValue?: number;

  /**
   * 是否删除
   */
  ideleted?: string | number;

  /* 法人还是个人 */
  peopleType?: string| number;

}

export interface SupattchQuery extends PageQuery {

  /**
   * 用户ID
   */
  userid?: string | number;

  /**
   * ossId
   */
  ossId?: string | number;

  /**
   * 文件名称
   */
  typeName?: string;

  /**
   * 文件类型值
   */
  typeValue?: number;

  /**
   * 是否删除
   */
  ideleted?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
      /* 法人还是个人 */
  peopleType?: string| number;
}

export interface InfoVo {
  id?:string|number;
   typeName?: string;
   typeValue?: string|number;
   status?: string | number;
   ossId?: string|number;
   createTime?: string|number;
   ideleted?: string | number;
}


