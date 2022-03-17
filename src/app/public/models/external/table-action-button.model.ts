import {TABLE_ACTION_TYPE} from "../../../core/common/enum/operator";

export interface TableActionButtonModel {
  imageSrc?: string;
  classImgSrc?: string;
  action: TABLE_ACTION_TYPE;
  color: string;
  content?: string;
  tooltip?: string;
  style?: string;
  hidden?: boolean;
}
