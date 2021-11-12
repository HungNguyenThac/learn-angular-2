import { FILTER_ACTION_TYPE } from 'src/app/core/common/enum/operator';

export interface FilterActionEventModel {
  type: FILTER_ACTION_TYPE;
  controlName: string;
  value: any;
}
