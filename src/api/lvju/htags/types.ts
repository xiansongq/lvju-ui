export interface HtagsVO {
  /**
   * 房源编号
   */
  houseid: string | number;

  /**
   * 标签名称
   */
  name: string;

  /**
   * 状态
   */
  status: number;

}

export interface HtagsForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 房源编号
   */
  houseid?: string | number;

  /**
   * 标签名称
   */
  name?: string;

  /**
   * 状态
   */
  status?: number;

}

export interface HtagsQuery extends PageQuery {

  /**
   * 房源编号
   */
  houseid?: string | number;

  /**
   * 标签名称
   */
  name?: string;

  /**
   * 状态
   */
  status?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



