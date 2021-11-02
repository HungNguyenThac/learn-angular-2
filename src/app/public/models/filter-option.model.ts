import { FILTER_TYPE } from 'src/app/core/common/enum/operator';
import {FilterItemModel} from "./filter-item.model";

export interface FilterOptionModel {
  title: string;
  type: FILTER_TYPE;
  controlName: string;
  value: any;
  titleAction?: string;
  actionIconClass?: string;
  showAction?: boolean;
  options?: FilterItemModel[];
}
