import { FilterSubItemsModel } from './filter-sub-items.model';

export interface FilterItemModel {
  title: string;
  value: any;
  showAction?: boolean;
  actionTitle?: string;
  actionIconClass?: string;
  subTitle?: string;
  subOptions?: FilterSubItemsModel[];
  disabled?: boolean;
  count?: number;
}
