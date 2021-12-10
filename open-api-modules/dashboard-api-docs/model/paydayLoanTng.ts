/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { Rating } from './rating';
import { CompanyInfo } from './companyInfo';
import { CustomerInfo } from './customerInfo';
import { Voucher } from './voucher';
import { VoucherTransaction } from './voucherTransaction';


export interface PaydayLoanTng { 
    id?: string;
    coreLoanUuid?: string;
    customerId?: string;
    expectedAmount?: number;
    expectedTenure?: number;
    actualAmount?: number;
    status?: string;
    oldStatus?: string;
    appTypeUuid?: string;
    appType?: string;
    loanCode?: string;
    purpose?: string;
    voucherTransactionId?: string;
    repaymentStatus?: string;
    latePenaltyPayment?: number;
    totalServiceFees?: number;
    getSalaryAt?: string;
    createdAt?: string;
    updatedAt?: string;
    note?: string;
    personInChargeId?: string;
    customerInfo?: CustomerInfo;
    companyInfo?: CompanyInfo;
    companyId?: string;
    ratingInfo?: Rating;
    voucherTransaction?: VoucherTransaction;
    voucher?: Voucher;
}

