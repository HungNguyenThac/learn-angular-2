export enum PAYDAY_LOAN_TNG_STATUS {
  NOT_VERIFY_YET = 'NOT_VERIFY_YET',
  FUNDED = 'FUNDED',
  DOCUMENT_AWAITING = 'DOCUMENT_AWAITING',
  INITIALIZED = 'INITIALIZED',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  DOCUMENTATION_COMPLETE = 'DOCUMENTATION_COMPLETE',
  REJECTED = 'REJECTED',
  WITHDRAW = 'WITHDRAW',
  AUCTION = 'AUCTION',
  CONTRACT_AWAITING = 'CONTRACT_AWAITING',
  CONTRACT_ACCEPTED = 'CONTRACT_ACCEPTED',
  AWAITING_DISBURSEMENT = 'AWAITING_DISBURSEMENT',
  DISBURSED = 'DISBURSED',
  IN_REPAYMENT = 'IN_REPAYMENT',
  COMPLETED = 'COMPLETED',
  OVERDUE_L2 = 'OVERDUE_L2',
  CONTRACT_REJECTED = 'CONTRACT_REJECTED',
  UNKNOWN_STATUS = 'UNKNOWN_STATUS',
  CALLBACK_PAYMENT_RESULT = 'CALLBACK_PAYMENT_RESULT',
}

export enum PAYDAY_LOAN_HMG_STATUS {
  NOT_VERIFY_YET = 'NOT_VERIFY_YET',
  FUNDED = 'FUNDED',
  DOCUMENT_AWAITING = 'DOCUMENT_AWAITING',
  INITIALIZED = 'INITIALIZED',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  DOCUMENTATION_COMPLETE = 'DOCUMENTATION_COMPLETE',
  REJECTED = 'REJECTED',
  WITHDRAW = 'WITHDRAW',
  AUCTION = 'AUCTION',
  CONTRACT_AWAITING = 'CONTRACT_AWAITING',
  CONTRACT_ACCEPTED = 'CONTRACT_ACCEPTED',
  AWAITING_DISBURSEMENT = 'AWAITING_DISBURSEMENT',
  DISBURSED = 'DISBURSED',
  IN_REPAYMENT = 'IN_REPAYMENT',
  COMPLETED = 'COMPLETED',
  OVERDUE_L2 = 'OVERDUE_L2',
  CONTRACT_REJECTED = 'CONTRACT_REJECTED',
  UNKNOWN_STATUS = 'UNKNOWN_STATUS',
  CALLBACK_PAYMENT_RESULT = 'CALLBACK_PAYMENT_RESULT',
}

export enum DOCUMENT_TYPE {
  ID_CARD = 'ID_CARD',
  FRONT_ID_CARD = 'FRONT_ID_CARD',
  BACK_ID_CARD = 'BACK_ID_CARD',
  FRONT_ID_CARD_TWO = 'FRONT_ID_CARD_TWO',
  BACK_ID_CARD_TWO = 'BACK_ID_CARD_TWO',
  SELFIE = 'SELFIE',
  BANK_BOOK = 'BANK_BOOK',
  PAY_SLIP = 'PAY_SLIP',
  UN_KNOWN = 'UN_KNOWN',
  CONTRACT = 'CONTRACT',
  LETTER_OF_ACCEPTANCE = 'LETTER_OF_ACCEPTANCE',
  VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION',
  SALARY_INFORMATION_ONE = 'SALARY_INFORMATION_ONE',
  SALARY_INFORMATION_TWO = 'SALARY_INFORMATION_TWO',
  SALARY_INFORMATION_THREE = 'SALARY_INFORMATION_THREE',
}

export enum ERROR_CODE {
  ACCOUNT_EXISTED = 'ACCOUNT_EXISTED',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  ACCOUNT_NOT_EXIST = 'ACCOUNT_NOT_EXIST',
  MISS_PARAM = 'MISS_PARAM',
  DATA_ERROR = 'DATA_ERROR',
  WRONG_PASSWORD = 'WRONG_PASSWORD',
  OTP_EXPIRE_TIME = 'OTP_EXPIRE_TIME',
  OTP_INVALID = 'OTP_INVALID',
  OTP_CONFIRM_MAXIMUM = 'OTP_CONFIRM_MAXIMUM',
  SESSION_SIGN_ALREADY_EXIST = 'SESSION_SIGN_ALREADY_EXIST',
  LOCK_CREATE_NEW_SESSION = 'LOCK_CREATE_NEW_SESSION',
  DO_NOT_EXIST_VIRTUAL_ACCOUNT = 'DO_NOT_EXIST_VIRTUAL_ACCOUNT',
  NOT_CURRENT_LOAN_REPAYMENT_ERROR = 'NOT_CURRENT_LOAN_REPAYMENT_ERROR',
  MISSING_ANUAL_INCOME = 'MISSING_ANUAL_INCOME',
  COMPANY_NOT_EXIST = 'COMPANY_NOT_EXIST',
  APPROVAL_LETTER_NOT_EXIST = 'APPROVAL_LETTER_NOT_EXIST',
  DO_NOT_ACTIVE_LOAN_ERROR = 'DO_NOT_ACTIVE_LOAN_ERROR',
  NOT_FOUND_SESSION = 'NOT_FOUND_SESSION',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  CORE_ERROR = 'CORE_ERROR',
  VERIFICATION_FAILED = 'VERIFICATION_FAILED',
  WRONG_CREDENTIAL = 'WRONG_CREDENTIAL',
}

export enum ERROR_CODE_KEY {
  ACCOUNT_EXISTED = 'error_code.account_existed',
  EMAIL_ALREADY_EXISTS = 'error_code.email_already_exists',
  ACCOUNT_NOT_EXIST = 'error_code.account_not_exist',
  MISS_PARAM = 'error_code.miss_param',
  DATA_ERROR = 'error_code.data_error',
  WRONG_PASSWORD = 'error_code.wrong_password',
  OTP_EXPIRE_TIME = 'error_code.otp_expire_time',
  OTP_INVALID = 'error_code.otp_invalid',
  OTP_CONFIRM_MAXIMUM = 'error_code.otp_confirm_maximum',
  SESSION_SIGN_ALREADY_EXIST = 'error_code.session_sign_already_exist',
  LOCK_CREATE_NEW_SESSION = 'error_code.lock_create_new_session',
  DO_NOT_EXIST_VIRTUAL_ACCOUNT = 'error_code.do_not_exist_virtual_account',
  NOT_CURRENT_LOAN_REPAYMENT_ERROR = 'error_code.not_current_loan_repayment_error',
  MISSING_ANUAL_INCOME = 'error_code.missing_anual_income',
  COMPANY_NOT_EXIST = 'error_code.company_not_exist',
  APPROVAL_LETTER_NOT_EXIST = 'error_code.approval_letter_not_exist',
  DO_NOT_ACTIVE_LOAN_ERROR = 'error_code.do_not_active_loan_error',
  NOT_FOUND_SESSION = 'error_code.not_found_session',
  INTERNAL_SERVER_ERROR = 'error_code.internal_server_error',
  CORE_ERROR = 'error_code.core_error',
  VERIFICATION_FAILED = 'error_code.verification_failed',
  WRONG_CREDENTIAL = 'error_code.wrong_credential',
}

export enum SIGN_STATUS {
  ACCEPTED = 'ACCEPTED',
  AWAITING_BORROWER_SIGNATURE = 'AWAITING_BORROWER_SIGNATURE',
  AWAITING_EPAY_SIGNATURE = 'AWAITING_EPAY_SIGNATURE',
  DONE = 'DONE',
}

export enum GPAY_RESULT_STATUS {
  ORDER_PENDING = 'ORDER_PENDING',
  ORDER_PROCESSING = 'ORDER_PROCESSING',
  ORDER_SUCCESS = 'ORDER_SUCCESS',
  ORDER_FAILED = 'ORDER_FAILED',
  ORDER_CANCEL = 'ORDER_CANCEL',
  ORDER_VERIFYING = 'ORDER_VERIFYING',
}

export enum REPAYMENT_STATUS {
  OVERDUE = 'OVERDUE',
}

export enum APPLICATION_TYPE {
  PAYDAYLOAN_TNG = 'PaydayLoan-TNG',
  PAYDAYLOAN_HMG = 'PaydayLoan-HMG',
  INSURANCE = 'Insurance',
}

// export enum RATING_STATUS {
//   NOT_SATISFIED = 'NOT_SATISFIED',
//   SEMI_SATISFIED = 'SEMI_SATISFIED',
//   NORMAL = 'NORMAL',
//   SATISFIED = 'SATISFIED',
//   VERY_SATISFIED = 'VERY_SATISFIED',
// }

export enum COMPANY_NAME {
  HMG = 'HMG',
  TNG = 'TNG',
}

export enum PAYDAY_LOAN_UI_STATUS {
  NOT_COMPLETE_EKYC_YET = 'NOT_COMPLETE_EKYC_YET',
  NOT_COMPLETE_FILL_EKYC_YET = 'NOT_COMPLETE_FILL_EKYC_YET',
  NOT_ACCEPTING_TERM_YET = 'NOT_ACCEPTING_TERM_YET',
  NOT_COMPLETE_CDE_YET = 'NOT_COMPLETE_CDE_YET',
  COMPLETED_CDE = 'COMPLETED_CDE',
}

export enum PAYDAY_LOAN_UI_STATUS_TEXT {
  NOT_COMPLETE_EKYC_YET = 'Chưa EKYC',
  NOT_COMPLETE_FILL_EKYC_YET = 'Chưa xác thực thông tin',
  NOT_ACCEPTING_TERM_YET = 'Chưa ký thư chấp thuận',
  NOT_COMPLETE_CDE_YET = 'Chưa bổ sung thông tin',
  COMPLETED_CDE = 'Đã bổ sung thông tin',
}
