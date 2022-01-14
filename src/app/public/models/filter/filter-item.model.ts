import { FilterSubItemsModel } from './filter-sub-items.model';

export interface FilterItemModel {
  title: string;
  note?: string;
  id?: string;
  value: any;
  showAction?: boolean;
  actionTitle?: string;
  actionIconClass?: string;
  actionControlName?: string;
  subTitle?: string;
  subOptions?: FilterSubItemsModel[];
  disabled?: boolean;
  hidden?: boolean;
  count?: number;
}
