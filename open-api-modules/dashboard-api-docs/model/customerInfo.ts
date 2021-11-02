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
import { TngInformationResponse } from './tngInformationResponse';
import { KalapaResponse } from './kalapaResponse';


export interface CustomerInfo { 
    id?: string;
    firstName?: string;
    gender?: string;
    dateOfBirth?: string;
    identityNumberSix?: string;
    emailAddress?: string;
    mobileNumber?: string;
    addressTwoLine1?: string;
    addressOneLine1?: string;
    borrowerDetailTextVariable1?: string;
    maritalStatus?: string;
    educationType?: string;
    coreUserId?: string;
    note?: string;
    idDocumentType?: string;
    identityNumberOne?: string;
    idIssuePlace?: string;
    idIssueDate?: string;
    idFeatures?: string;
    idExpiredDate?: string;
    idOrigin?: string;
    companyId?: string;
    officeCode?: string;
    organizationName?: string;
    officeName?: string;
    annualIncome?: number;
    workingDay?: number;
    borrowerEmploymentHistoryTextVariable1?: string;
    stepOne?: string;
    stepTwoIndividual?: string;
    stepThreeEmployment?: string;
    paydayLoanStatus?: string;
    errorGetTngInfo?: boolean;
    collateralDocument?: string;
    salaryDocument1?: string;
    salaryDocument2?: string;
    salaryDocument3?: string;
    approvalLetterId?: string;
    frontId?: string;
    frontIdTwo?: string;
    backId?: string;
    backIdTwo?: string;
    selfie?: string;
    bankName?: string;
    bankCode?: string;
    accountNumber?: string;
    tngData?: TngInformationResponse;
    kalapaData?: KalapaResponse;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
}

