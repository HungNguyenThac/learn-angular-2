/**
 * contract-service API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0-SNAPSHOT
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { CompanyName } from './companyName';
import { DocumentType } from './documentType';
import { SigningPositionRequest } from './signingPositionRequest';


export interface CreateSigningPositionRequest { 
    documentType: DocumentType;
    companyName: CompanyName;
    page: number;
    positionBorrower: SigningPositionRequest;
    positionInvestor?: SigningPositionRequest;
    positionEpay?: SigningPositionRequest;
}

