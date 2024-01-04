export interface RoompriceVO {
  /**
   * 房间编号
   */
  roomid: string | number;

  /**
   * 房间价格
   */
  price: string;

  /**
   * 优惠力度
   */
  prefeforce: number;

  /**
   * 价格时间
   */
  pdate: string;

  /**
   * 价格是否有效
   */
  isvalid: string | number;

}

export interface RoompriceForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 房间编号
   */
  roomid?: string | number;

  /**
   * 房间价格
   */
  price?: string;

  /**
   * 优惠力度
   */
  prefeforce?: number;

  /**
   * 价格时间
   */
  pdate?: string;

  /**
   * 价格是否有效
   */
  isvalid?: string | number;

}

export interface RoompriceQuery extends PageQuery {

  /**
   * 房间编号
   */
  roomid?: string | number;

  /**
   * 房间价格
   */
  price?: string;

  /**
   * 价格时间
   */
  pdate?: string;

  /**
   * 价格是否有效
   */
  isvalid?: string | number;

    /**
     * 日期范围参数
     */
    params?: any;
}



