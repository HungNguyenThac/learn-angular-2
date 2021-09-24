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
import { SigningPositionRequest } from './signingPositionRequest';


export interface CreateSigningPositionRequest { 
    documentType: string;
    companyName: CreateSigningPositionRequest.CompanyNameEnum;
    page: number;
    positionBorrower: SigningPositionRequest;
    positionInvestor?: SigningPositionRequest;
    positionEpay?: SigningPositionRequest;
}
export namespace CreateSigningPositionRequest {
    export type CompanyNameEnum = 'HMG' | 'TNG';
    export const CompanyNameEnum = {
        Hmg: 'HMG' as CompanyNameEnum,
        Tng: 'TNG' as CompanyNameEnum
    };
}

