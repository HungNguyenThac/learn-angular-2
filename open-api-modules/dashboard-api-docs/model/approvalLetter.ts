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


export interface ApprovalLetter { 
    id?: string;
    provider?: string;
    idRequest?: number;
    idDocument?: number;
    customerId?: string;
    path?: string;
    customerSignDone?: boolean;
    created_at?: string;
    updatedAt?: string;
    updatedBy?: string;
}
