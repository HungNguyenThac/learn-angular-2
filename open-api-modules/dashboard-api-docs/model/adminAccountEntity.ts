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
import { GroupEntity } from './groupEntity';


export interface AdminAccountEntity { 
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updateBy?: string;
    id?: string;
    username?: string;
    secretHash?: string;
    fullName?: string;
    email?: string;
    mobile?: string;
    note?: string;
    position?: string;
    userStatus?: AdminAccountEntity.UserStatusEnum;
    unLockTime?: string;
    groupEntity?: GroupEntity;
    groupId?: string;
}
export namespace AdminAccountEntity {
    export type UserStatusEnum = 'ACTIVE' | 'LOCKED';
    export const UserStatusEnum = {
        Active: 'ACTIVE' as UserStatusEnum,
        Locked: 'LOCKED' as UserStatusEnum
    };
}


