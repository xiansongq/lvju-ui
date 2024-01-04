export interface BsroomVO {
  /**
   * 房间编号
   */
  roomid: string | number;

  /**
   * 设施名称
   */
  name: string;

  /**
   * 信息类型
   */
  rtype: string;

  /**
   * 设施值
   */
  val: string;

}

export interface BsroomForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 房间编号
   */
  roomid?: string | number;

  /**
   * 设施名称
   */
  name?: string;

  /**
   * 信息类型
   */
  rtype?: string;

  /**
   * 设施值
   */
  val?: string;

}

export interface BsroomQuery extends PageQuery {

  /**
   * 房间编号
   */
  roomid?: string | number;

  /**
   * 设施名称
   */
  name?: string;

  /**
   * 信息类型
   */
  rtype?: string;

  /**
   * 设施值
   */
  val?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



