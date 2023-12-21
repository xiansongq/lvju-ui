export interface HouseVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 用户编号
   */
  userid: string | number;

  /**
   * 供应商编号
   */
  supplierid: string | number;

  /**
   * 名称
   */
  name: string;

  /**
   * 城市
   */
  cityid: string | number;

  /**
   * 小区
   */
  estateid: string | number;

  /**
   * 描述
   */
  describe: string;

  /**
   * 商业描述
   */
  busdescribe: string;

  /**
   * 地址
   */
  address: string;

  /**
   * 房间数量
   */
  num: number;

  /**
   * 创建时间
   */
  createTime: string;

  /* 城市名称 */

  cityname:string;

  /* 小区名称 */
  estatename:string;

}

export interface HouseForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 用户编号
   */
  userid?: string | number;

  /**
   * 供应商编号
   */
  supplierid?: string | number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 城市
   */
  cityid?: string | number;

  /**
   * 小区
   */
  estateid?: string | number;

  /**
   * 描述
   */
  describe?: string;

  /**
   * 商业描述
   */
  busdescribe?: string;

  /**
   * 地址
   */
  address?: string;

  /**
   * 房间数量
   */
  num?: number;

}

export interface HouseQuery extends PageQuery {

  /**
   * 用户编号
   */
  userid?: string | number;

  /**
   * 供应商编号
   */
  supplierid?: string | number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 城市
   */
  cityid?: string | number;

  /**
   * 小区
   */
  estateid?: string | number;

  /**
   * 描述
   */
  describe?: string;

  /**
   * 商业描述
   */
  busdescribe?: string;

  /**
   * 地址
   */
  address?: string;

  /**
   * 房间数量
   */
  num?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



