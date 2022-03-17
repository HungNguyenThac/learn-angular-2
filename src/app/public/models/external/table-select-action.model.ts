import {MULTIPLE_ELEMENT_ACTION_TYPE} from "../../../core/common/enum/operator";

export interface TableSelectActionModel {
  imageSrc?: string;
  classImgSrc?: string;
  action: MULTIPLE_ELEMENT_ACTION_TYPE;
  color: string;
  content: string;
  style?: string;
  hidden?: boolean;
}
