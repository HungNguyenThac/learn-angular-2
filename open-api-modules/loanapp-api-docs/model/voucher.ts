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


export interface Voucher { 
    id?: string;
    promotionEventId?: string;
    code?: string;
    maxValue?: number;
    percentage?: number;
    maxAmount?: number;
    remainAmount?: number;
    activedTime?: Array<string>;
    description?: string;
    type?: string;
    scope?: string;
    expiredAt?: string;
    limitPerDay?: number;
    createdAt?: string;
}

