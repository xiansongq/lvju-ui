export interface RoomVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 房源id
   */
  houseid: string | number;

  /**
   * 楼栋
   */
  houseno: string;

  /**
   * 楼层
   */
  houselv: string;

  /**
   * 房号
   */
  roomno: string;

  /**
   * 房型
   */
  apartment: string;

  /**
   * 面积
   */
  area: string;

  /**
   * 房间状态
   */
  status: number;

  /**
   * 房间描述
   */
  describe: string;

  /**
   * 房间关键字
   */
  keys: string;

  /**
   * 备注
   */
  remarks: string;

  /**
   * 创建时间
   */
  createTime: string;

  /* 房源名称 */
  housename:string;

}

export interface RoomForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 房源id
   */
  houseid?: string | number;

  /**
   * 楼栋
   */
  houseno?: string;

  /**
   * 楼层
   */
  houselv?: string;

  /**
   * 房号
   */
  roomno?: string;

  /**
   * 房型
   */
  apartment?: string;

  /**
   * 面积
   */
  area?: string;

  /**
   * 房间状态
   */
  status?: number;

  /**
   * 房间描述
   */
  describe?: string;

  /**
   * 房间关键字
   */
  keys?: string;

  /**
   * 备注
   */
  remarks?: string;

}

export interface RoomQuery extends PageQuery {

  /**
   * 房源id
   */
  houseid?: string | number;

  /**
   * 楼栋
   */
  houseno?: string;

  /**
   * 楼层
   */
  houselv?: string;

  /**
   * 房号
   */
  roomno?: string;

  /**
   * 房型
   */
  apartment?: string;

  /**
   * 面积
   */
  area?: string;

  /**
   * 房间状态
   */
  status?: number;

  /**
   * 房间描述
   */
  describe?: string;

  /**
   * 房间关键字
   */
  keys?: string;

  /**
   * 备注
   */
  remarks?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



