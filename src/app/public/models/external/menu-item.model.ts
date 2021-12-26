import { NAV_ITEM } from '../../../core/common/enum/operator';
import { SubmenuItemModel } from './submenu-item.model';

export interface MenuItemModel {
  navItem: NAV_ITEM;
  title: string;
  defaultIconClass?: string;
  activeIconClass?: string;
  canActivate?: string[];
  subItems?: SubmenuItemModel[];
  path?: string;
  queryParams?: any;
}
