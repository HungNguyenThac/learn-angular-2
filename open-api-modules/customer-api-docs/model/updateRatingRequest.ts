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


export interface UpdateRatingRequest { 
    rate?: UpdateRatingRequest.RateEnum;
    customerOpinion?: string;
}
export namespace UpdateRatingRequest {
    export type RateEnum = 'NOT_SATISFIED' | 'SEMI_SATISFIED' | 'NORMAL' | 'SATISFIED' | 'VERY_SATISFIED';
    export const RateEnum = {
        NotSatisfied: 'NOT_SATISFIED' as RateEnum,
        SemiSatisfied: 'SEMI_SATISFIED' as RateEnum,
        Normal: 'NORMAL' as RateEnum,
        Satisfied: 'SATISFIED' as RateEnum,
        VerySatisfied: 'VERY_SATISFIED' as RateEnum
    };
}


