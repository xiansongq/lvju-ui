export interface TempfileVO {
  /**
   * id
   */
  id: string | number;

  /**
   * 模板名称
   */
  tempName: string;

  /**
   * 文件存储id
   */
  ossId: string | number;

  /**
   * 法人/个人
   */
  agentType: number;

  /**
   * 创建时间
   */
  createTime: string;

}

export interface TempfileForm extends BaseEntity {
  /**
   * id
   */
  id?: string | number;

  /**
   * 模板名称
   */
  tempName?: string;

  /**
   * 文件存储id
   */
  ossId?: string | number;

  /**
   * 法人/个人
   */
  agentType?: number;

}

export interface TempfileQuery extends PageQuery {

  /**
   * 模板名称
   */
  tempName?: string;

  /**
   * 文件存储id
   */
  ossId?: string | number;

  /**
   * 法人/个人
   */
  agentType?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



