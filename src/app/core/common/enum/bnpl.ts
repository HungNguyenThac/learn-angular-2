export enum BNPL_STATUS {
  PENDING = 'PENDING',
  UNDOAPPROVAL = 'UNDOAPPROVAL',
  APPROVE = 'APPROVE',
  DISBURSE = 'DISBURSE',
  CONTRACT_ACCEPTED = 'CONTRACT_ACCEPTED',
  CONTRACT_AWAITING = 'CONTRACT_AWAITING',
  WITHDRAW = 'WITHDRAW',
  COMPLETED = 'COMPLETED',
}

export enum REPAYMENT_STATUS {
  OVERDUE = 'OVERDUE',
  PAYMENT_TERM_1 = 'PAYMENT_TERM_1',
  PAYMENT_TERM_2 = 'PAYMENT_TERM_2',
  PAYMENT_TERM_3 = 'PAYMENT_TERM_3',
}

export enum MERCHANT_SELL_TYPE_TEXT {
  OFFLINE = 'merchant.merchant_sell_type.offline',
  ONLINE = 'merchant.merchant_sell_type.online',
  ALL = 'merchant.merchant_sell_type.all',
}

export enum GPAY_REPAYMENT_STATUS {
  ORDER_SUCCESS = 'success',
  ORDER_PENDING = 'pending',
  ORDER_PROCESSING = 'processing',
  ORDER_FAILED = 'failed',
  ORDER_CANCEL = 'cancel',
  ORDER_VERIFYING = 'verifying',
}
