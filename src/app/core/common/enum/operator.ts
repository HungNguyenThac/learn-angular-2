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
  LIKE_KEYWORD = '__lk',
}

export enum DATA_CELL_TYPE {
  TEXT = 'TEXT',
  DATETIME = 'DATETIME',
  STATUS = 'STATUS',
  CURRENCY = 'CURRENCY',
}

export enum DATA_STATUS_TYPE {
  PL_UI_STATUS = 'PL_UI_STATUS',
  PL_HMG_STATUS = 'PL_HMG_STATUS',
  PL_TNG_STATUS = 'PL_TNG_STATUS',
  PL_OTHER_STATUS = 'PL_OTHER_STATUS',
  PL_REPAYMENT_STATUS = 'PL_REPAYMENT_STATUS',
  PL_RATING_STATUS = 'PL_RATING_STATUS',
}

export enum FILTER_TYPE {
  SELECT = 'SELECT',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  DATETIME = 'DATETIME',
}

export enum FILTER_ACTION_TYPE {
  ITEM_ACTION = 'ITEM_ACTION',
  FILTER_EXTRA_ACTION = 'FILTER_EXTRA_ACTION',
  SUB_ITEM_ACTION = 'SUB_ITEM_ACTION',
}

export enum FILTER_DATETIME_TYPE {
  TIME_FRAME = 'TIME_FRAME',
  TIME_RANGE = 'TIME_RANGE',
}

export enum RESPONSE_CODE {
  SUCCESS = 200,
  ERROR = 400,
}

export enum BUTTON_TYPE {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

export enum LOCK_TITLES {
  BY_HOUR = 'lock_title.by_hour',
  BY_DAY = 'lock_title.by_day',
  PERMANENT = 'lock_title.permanent',
}

export enum LOCK_TIME_OPTIONS {
  ONE_HOUR = 3600,
  TWO_HOUR = 7200,
  FOUR_HOUR = 14400,
  EIGHT_HOUR = 28800,
  ONE_DAY = 86400,
  SEVEN_DAY = 604800,
  THIRTY_DAY = 2592000,
  PERMANENT = 'PERMANENT',
}

export enum LOCK_TIME_TEXT_OPTIONS {
  ONE_HOUR = 'lock_time_options.1_hour',
  TWO_HOUR = 'lock_time_options.2_hour',
  FOUR_HOUR = 'lock_time_options.4_hour',
  EIGHT_HOUR = 'lock_time_options.8_hour',
  ONE_DAY = 'lock_time_options.1_day',
  SEVEN_DAY = 'lock_time_options.7_day',
  THIRTY_DAY = 'lock_time_options.30_day',
  PERMANENT = 'lock_time_options.permanent',
}
