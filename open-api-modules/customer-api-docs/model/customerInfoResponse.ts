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
import { PersonalData } from './personalData';
import { KalapaResponse } from './kalapaResponse';
import { TNGInformationResponse } from './tNGInformationResponse';
import { FinancialData } from './financialData';


export interface CustomerInfoResponse { 
    personalData?: PersonalData;
    financialData?: FinancialData;
    kalapaData?: KalapaResponse;
    tngData?: TNGInformationResponse;
}

