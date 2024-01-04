export interface CustomerVO {
id: any;
  /**
   * 姓名
   */
  sname: string;

  /**
   * 身份证号码
   */
  sdnum: string;

  /**
   * 性别
   */
  ssex: string;

  /**
   * 手机号码
   */
  iphone: string;

  /**
   * 紧急联系电话
   */
  imiphone: string;

  /**
   * 紧急联系人
   */
  imname: string;

}

export interface CustomerForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 用户
   */
  userid?: string | number;

  /**
   * 姓名
   */
  sname?: string;

  /**
   * 身份证号码
   */
  sdnum?: string;

  /**
   * 性别
   */
  ssex?: string;

  /**
   * 出生年月日
   */
  sbirth?: string;

  /**
   * 手机号码
   */
  iphone?: string;

  /**
   * 紧急联系电话
   */
  imiphone?: string;

  /**
   * 紧急联系人
   */
  imname?: string;

  /**
   * 照片
   */
  sphoto?: string;

  /**
   * 积分
   */
  integral?: number;

  /**
   * 住宿时长
   */
  classh?: number;

  /**
   * 等级
   */
  level?: number;

  /**
   * 是否新会员
   */
  isaudi?: number;

}

export interface CustomerQuery extends PageQuery {

  /**
   * 姓名
   */
  sname?: string;

  /**
   * 身份证号码
   */
  sdnum?: string;

  /**
   * 性别
   */
  ssex?: string;

  /**
   * 手机号码
   */
  iphone?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



