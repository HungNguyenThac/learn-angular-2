import {MULTIPLE_ELEMENT_ACTION_TYPE} from '../../../core/common/enum/operator';

export interface MultipleElementActionEventModel {
  action: MULTIPLE_ELEMENT_ACTION_TYPE;
  selectedList: any;
}
