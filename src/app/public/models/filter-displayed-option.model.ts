import { FilterItemModel } from './filter-item.model';

export interface FilterDisplayedOptionModel {
  filterItem: FilterItemModel;
  selected?: boolean;
}
