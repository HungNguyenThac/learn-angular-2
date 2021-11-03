import { FILTER_TYPE } from 'src/app/core/common/enum/operator';

export interface FilterEventModel {
  type: FILTER_TYPE;
  controlName: string;
  value: any;
}
