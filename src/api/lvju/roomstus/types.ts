export interface RoomstusVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 房间编号
   */
  roomid: string | number;

  /**
   * 客户姓名
   */
  customerid: string | number;

  /**
   * 房间状态
   */
  status: number;

  /**
   * 起始时间
   */
  startdate: string;

  /**
   * 结束时间
   */
  enddate: string;

  /**
   * 预定价格
   */
  bookprice: number;

  /**
   * 总金额
   */
  totalprice: number;

  /**
   * 总天数
   */
  totaldays: number;

}

export interface RoomstusForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 房间编号
   */
  roomid?: string | number;

  /**
   * 客户编号
   */
  userid?: string | number;

  /**
   * 客户姓名
   */
  customerid?: string | number;

  /**
   * 房间状态
   */
  status?: number;

  /**
   * 起始时间
   */
  startdate?: string;

  /**
   * 结束时间
   */
  enddate?: string;

  /**
   * 预定价格
   */
  bookprice?: number;

  /**
   * 总金额
   */
  totalprice?: number;

  /**
   * 总天数
   */
  totaldays?: number;

}

export interface RoomstusQuery extends PageQuery {

  /**
   * 房间编号
   */
  roomid?: string | number;

  /**
   * 客户姓名
   */
  customerid?: string | number;

  /**
   * 房间状态
   */
  status?: number;

  /**
   * 起始时间
   */
  startdate?: string;

  /**
   * 结束时间
   */
  enddate?: string;

  /**
   * 预定价格
   */
  bookprice?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



