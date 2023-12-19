@import {CityVO} from "@api/lvju/city/types";

/* 小区信息 */
export interface EstateInfo{
  estate: EstateVO;
  cityname: string;
}


export interface EstateVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 名称
   */
  name: string;

  /**
   * 城市
   */
  cityid: string | number;

  /**
   * 经度
   */
  logtude: number;

  /**
   * 纬度
   */
  lattude: number;

  /**
   * 创建时间
   */
  createTime: string;

  /* 城市名称 */
  cityname:string;

  /* 描述*/
  describe: string;

  /* 商业描述 */
  subdescribe: string;

}

/* 小区表单数据 */
export interface EstateForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 城市
   */
  cityid?: string | number;

  /**
   * 经度
   */
  logtude?: number;

  /**
   * 纬度
   */
  lattude?: number;

  /**
   * 描述
   */
  describe?: string;

  /**
   * 商业介绍
   */
  busdescribe?: string;

}

/* 小区信息查询字段 */
export interface EstateQuery extends PageQuery {

  /**
   * 名称
   */
  name?: string;

  /**
   * 城市
   */
  cityid?: string | number;

  /**
   * 经度
   */
  logtude?: number;

  /**
   * 纬度
   */
  lattude?: number;

  /**
   * 创建时间
   */
  createTime?: string;

    /**
     * 日期范围参数
     */
    params?: any;

    /* 城市名称 */

    cityname?: string;

    
  /* 描述*/
  describe: string;

  /* 商业描述 */
  subdescribe: string;
}



