export enum NAV_ITEM {
  DASHBOARD = 'DASHBOARD',
  LOANAPP = 'LOANAPP',
  CUSTOMER = 'CUSTOMER',
  INSURANCE = 'INSURANCE',
  SAVING = 'SAVING',
}

export enum DOCUMENT_BTN_TYPE {
  UPLOAD = 'UPLOAD',
  UPDATE = 'UPDATE',
  DOWNLOAD = 'DOWNLOAD',
  DELETE = 'DELETE',
}

export enum QUERY_CONDITION_TYPE {
  GREATER_THAN = '__gt',
  GREATER_THAN_OR_EQUAL = '__ge',
  LESS_THAN = '__lt',
  LESS_THAN_OR_EQUAL = '__le',
  BETWEEN = '__bw',
  START_WITH = '__sw',
  END_WITH = '__ew',
  NOT_EQUAL = '__ne',
  EQUAL = '__e',
  IN = '__in',
  LIKE = '__~',
}

export enum DATA_CELL_TYPE {
  TEXT = 'TEXT',
  DATETIME = 'DATETIME',
  STATUS = 'STATUS',
}

export enum DATA_STATUS_TYPE {
  PL_UI_STATUS = 'PL_UI_STATUS',
  PL_HMG_STATUS = 'PL_HMG_STATUS',
  PL_TNG_STATUS = 'PL_TNG_STATUS',
}
