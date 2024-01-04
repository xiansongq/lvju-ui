export interface RoombookVO {
  /**
   * 房间编号
   */
  roomid: string | number;

  /**
   * 客户名称
   */
  customerid: string | number;

  /**
   * 供应商
   */
  supplierid: string | number;

  /**
   * 价格
   */
  price: string;

  /**
   * 预定编号
   */
  roomstusid: string | number;

  /**
   * 起始时间
   */
  startdate: string;

  /**
   * 结束时间
   */
  enddate: string;

  /**
   * 总天数
   */
  totaldays: number;

}

export interface RoombookForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 房间编号
   */
  roomid?: string | number;

  /**
   * 用户编号
   */
  userid?: string | number;

  /**
   * 客户名称
   */
  customerid?: string | number;

  /**
   * 供应商
   */
  supplierid?: string | number;

  /**
   * 价格
   */
  price?: string;

  /**
   * 备注信息
   */
  remarks?: string;

  /**
   * 预定编号
   */
  roomstusid?: string | number;

  /**
   * 起始时间
   */
  startdate?: string;

  /**
   * 结束时间
   */
  enddate?: string;

  /**
   * 总天数
   */
  totaldays?: number;

}

export interface RoombookQuery extends PageQuery {

  /**
   * 房间编号
   */
  roomid?: string | number;

  /**
   * 客户名称
   */
  customerid?: string | number;

  /**
   * 供应商
   */
  supplierid?: string | number;

  /**
   * 价格
   */
  price?: string;

  /**
   * 起始时间
   */
  startdate?: string;

  /**
   * 结束时间
   */
  enddate?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



