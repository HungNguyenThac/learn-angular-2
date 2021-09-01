export enum PAYDAY_LOAN_STATUS {
  NOT_VERIFY_YET = "NOT_VERIFY_YET",
  FUNDED = "FUNDED",
  DOCUMENT_AWAITING = "DOCUMENT_AWAITING",
  INITIALIZED = "INITIALIZED",
  AWAITING_APPROVAL = "AWAITING_APPROVAL",
  DOCUMENTATION_COMPLETE = "DOCUMENTATION_COMPLETE",
  REJECTED = "REJECTED",
  WITHDRAW = "WITHDRAW",
  AUCTION = "AUCTION",
  CONTRACT_ACCEPTED = "CONTRACT_ACCEPTED",
  AWAITING_DISBURSEMENT = "AWAITING_DISBURSEMENT",
  DISBURSED = "DISBURSED",
  IN_REPAYMENT = "IN_REPAYMENT",
  COMPLETED = "COMPLETED",
  OVERDUE_L2 = "OVERDUE_L2",
  CONTRACT_REJECTED = "CONTRACT_REJECTED",
  UNKNOWN_STATUS = "UNKNOWN_STATUS",
  CALLBACK_PAYMENT_RESULT = "CALLBACK_PAYMENT_RESULT"
}

export enum PAYDAY_LOAN_UI_STATUS {
  NOT_COMPLETE_EKYC_YET = "NOT_COMPLETE_EKYC_YET",
  NOT_COMPLETE_FILL_EKYC_YET = "NOT_COMPLETE_FILL_EKYC_YET",
  NOT_ACCEPTING_TERM_YET = "NOT_ACCEPTING_TERM_YET",
  NOT_COMPLETE_CDE_YET = "NOT_COMPLETE_CDE_YET",
  COMPLETED_CDE = "COMPLETED_CDE"
}

export enum PAYDAY_LOAN_STATUS_PAGE {
  NOT_COMPLETE_EKYC_YET = "PlEKYC",
  NOT_COMPLETE_FILL_EKYC_YET = "PlConfirmInformation",
  NOT_ACCEPTING_TERM_YET = "PlContractTermsOfService",
  NOT_COMPLETE_CDE_YET = "PlAdditionalInformation",
  COMPLETED_CDE = "PlChooseAmountToBorrow"
}

export enum PAYDAY_LOAN_STEP {
  ELECTRONIC_IDENTIFIERS = 1,
  CONFIRM_INFORMATION = 2,
  ADDITIONAL_INFORMATION = 3,
  CHOOSE_AMOUNT_TO_BORROW = 4,
  CONTRACT_SIGNING = 5
}

export enum PAYDAY_LOAN_UI_STATUS_ORDER_NUMBER {
  NOT_COMPLETE_EKYC_YET = 1,
  NOT_COMPLETE_FILL_EKYC_YET = 2,
  NOT_ACCEPTING_TERM_YET = 3,
  NOT_COMPLETE_CDE_YET = 4,
  COMPLETED_CDE = 5
}

export enum DOCUMENT_TYPE {
  ID_CARD = "ID_CARD",
  FRONT_ID_CARD = "FRONT_ID_CARD",
  BACK_ID_CARD = "BACK_ID_CARD",
  SELFIE = "SELFIE",
  BANK_BOOK = "BANK_BOOK",
  PAY_SLIP = "PAY_SLIP",
  UN_KNOWN = "UN_KNOWN",
  CONTRACT = "CONTRACT",
  LETTER_OF_ACCEPTANCE = "LETTER_OF_ACCEPTANCE",
  VEHICLE_REGISTRATION = "VEHICLE_REGISTRATION",
  SALARY_INFORMATION_ONE = "SALARY_INFORMATION_ONE",
  SALARY_INFORMATION_TWO = "SALARY_INFORMATION_TWO",
  SALARY_INFORMATION_THREE = "SALARY_INFORMATION_THREE"
}
