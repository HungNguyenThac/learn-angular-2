import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from '../../../core/common/enum/operator';

export interface DisplayedFieldsModel {
  key: string;  // Key of main field
  externalKey?: string;  // Key of external field
  title: string;  // Title of column
  width?: number; // Width of column
  type?: DATA_CELL_TYPE;  // Type of display column data
  format?: DATA_STATUS_TYPE | string; // Format data
  showed?: boolean; //Show column: true or false
}
