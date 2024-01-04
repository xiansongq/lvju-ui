
export interface OssVO extends BaseEntity {
  ossId: string | number;
  fileName: string;
  originalName: string;
  fileSuffix: string;
  url: string;
  createByName: string;
  service: string;
}

export interface HattchVO extends OssVO{
  /**
   * id
   */
  id: string | number;

  /**
   * 房源id
   */
  houseid: string | number;

  ossId: string | number;

  /**
   * 文件类型 0图片 1视频
   */
  htype: string;

  /**
   * 创建时间
   */
  createTime: string;

  /* 旧路径 */
  oldPath: string;

}

export interface HattchForm extends BaseEntity , OssVO {
  /**
   * id
   */
  id?: string | number;

  /**
   * 房源id
   */
  houseid?: string | number;

  /* OOSID */

  ossId?: string | number;
  /**
   * 原始名称
   */
  name?: string;

  /**
   * 保存路径
   */
  path?: string;

  /**
   * 文件类型 0图片 1视频
   */
  htype?: string;

}

export interface HattchQuery extends PageQuery {

  /**
   * 房源id
   */
  houseid?: string | number;


  
  /* OOSID */

  ossId?: string | number;


  /**
   * 文件类型 0图片 1视频
   */
  htype?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



