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


export interface TransactionNotificationEntity { 
    id?: string;
    customerId?: string;
    content?: string;
    title?: string;
    type?: TransactionNotificationEntity.TypeEnum;
    isSeen?: string;
    date?: string;
}
export namespace TransactionNotificationEntity {
    export type TypeEnum = 'EMAIL' | 'SMS' | 'NOTIFICATION';
    export const TypeEnum = {
        Email: 'EMAIL' as TypeEnum,
        Sms: 'SMS' as TypeEnum,
        Notification: 'NOTIFICATION' as TypeEnum
    };
}


