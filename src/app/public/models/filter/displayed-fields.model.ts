import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from '../../../core/common/enum/operator';

export interface DisplayedFieldsModel {
  key: string;
  title: string;
  type?: DATA_CELL_TYPE;
  format?: DATA_STATUS_TYPE;
  showed: boolean;
}
