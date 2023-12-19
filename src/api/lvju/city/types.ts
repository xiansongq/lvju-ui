export interface CityVO {

  /* 
    id: string
  */
  id: string | number;
  /**
   * 名称
   */
  name: string;

  /**
   * 是否是热门城市：1是 0不是
   */
  ishot: number;

  /**
   * 父城市id
   */
  parentid: string | number;

  /**
   * 经度
   */
  logtude: number;

  /**
   * 维度
   */
  latttude: number;

  /**
   * 创建时间
   */
  createTime: string;

    /**
     * 子对象
     */
  children: CityVO[];
}

export interface CityForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 名称
   */
  name?: string;

  /**
   * 是否是热门城市：1是 0不是
   */
  ishot?: number;

  /**
   * 父城市id
   */
  parentid?: string | number;

  /**
   * 经度
   */
  logtude?: number;

  /**
   * 维度
   */
  latttude?: number;

}

export interface CityQuery {

  /**
   * 名称
   */
  name?: string;

  /**
   * 是否是热门城市：1是 0不是
   */
  ishot?: number;

  /**
   * 父城市id
   */
  parentid?: string | number;

  /**
   * 经度
   */
  logtude?: number;

  /**
   * 维度
   */
  latttude?: number;

    /**
     * 日期范围参数
     */
  params?: any;
}



