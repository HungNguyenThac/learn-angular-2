import { TABLE_ACTION_TYPE } from '../../../core/common/enum/operator';

export interface TableActionEventModel {
  element: any;
  action: TABLE_ACTION_TYPE;
}
