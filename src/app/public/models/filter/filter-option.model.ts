import { FILTER_TYPE } from 'src/app/core/common/enum/operator';
import { FilterItemModel } from './filter-item.model';

export interface FilterOptionModel {
  title: string;
  type: FILTER_TYPE;
  controlName: string;
  value: any;
  multiple?: boolean;
  titleAction?: string;
  actionControlName?: any;
  actionIconClass?: string;
  showAction?: boolean;
  showIconAction?: boolean;
  hidden?: boolean;
  options?: FilterItemModel[];
  searchPlaceholder?: string;
  emptyResultText?: string;
}
