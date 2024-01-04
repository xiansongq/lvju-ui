export interface HnoticesVO {
  /**
   * 房源编号
   */
  houseid: string | number;

  /**
   * 须知名称
   */
  name: string;

  /**
   * 须知值
   */
  val: string;

  /**
   * 须知类型
   */
  ntype: number;

}

export interface HnoticesForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 房源编号
   */
  houseid?: string | number;

  /**
   * 须知名称
   */
  name?: string;

  /**
   * 须知值
   */
  val?: string;

  /**
   * 须知类型
   */
  ntype?: number;

}

export interface HnoticesQuery extends PageQuery {

  /**
   * 房源编号
   */
  houseid?: string | number;

  /**
   * 须知名称
   */
  name?: string;

  /**
   * 须知类型
   */
  ntype?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



