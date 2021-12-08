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
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent, HttpParameterCodec }       from '@angular/common/http';
import { CustomHttpParameterCodec }                          from '../encoder';
import { Observable }                                        from 'rxjs';

import { ApiResponseRepaymentTransaction } from '../model/models';
import { ApiResponseSearchAndPaginationResponseRepaymentTransaction } from '../model/models';
import { ApiResponseSearchAndPaginationResponseVirtualAccount } from '../model/models';
import { ApiResponseVirtualAccount } from '../model/models';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class PaymentControllerService {

    protected basePath = 'http://localhost:8004';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();
    public encoder: HttpParameterCodec;

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (configuration) {
            this.configuration = configuration;
        }
        if (typeof this.configuration.basePath !== 'string') {
            if (typeof basePath !== 'string') {
                basePath = this.basePath;
            }
            this.configuration.basePath = basePath;
        }
        this.encoder = this.configuration.encoder || new CustomHttpParameterCodec();
    }


    private addToHttpParams(httpParams: HttpParams, value: any, key?: string): HttpParams {
        if (typeof value === "object" && value instanceof Date === false) {
            httpParams = this.addToHttpParamsRecursive(httpParams, value);
        } else {
            httpParams = this.addToHttpParamsRecursive(httpParams, value, key);
        }
        return httpParams;
    }

    private addToHttpParamsRecursive(httpParams: HttpParams, value?: any, key?: string): HttpParams {
        if (value == null) {
            return httpParams;
        }

        if (typeof value === "object") {
            if (Array.isArray(value)) {
                (value as any[]).forEach( elem => httpParams = this.addToHttpParamsRecursive(httpParams, elem, key));
            } else if (value instanceof Date) {
                if (key != null) {
                    httpParams = httpParams.append(key,
                        (value as Date).toISOString().substr(0, 10));
                } else {
                   throw Error("key may not be null if value is Date");
                }
            } else {
                Object.keys(value).forEach( k => httpParams = this.addToHttpParamsRecursive(
                    httpParams, value[k], key != null ? `${key}.${k}` : k));
            }
        } else if (key != null) {
            httpParams = httpParams.append(key, value);
        } else {
            throw Error("key may not be null if value is not object or array");
        }
        return httpParams;
    }

    /**
     * @param paymentId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getRepaymentTransactionById(paymentId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<ApiResponseRepaymentTransaction>;
    public getRepaymentTransactionById(paymentId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpResponse<ApiResponseRepaymentTransaction>>;
    public getRepaymentTransactionById(paymentId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpEvent<ApiResponseRepaymentTransaction>>;
    public getRepaymentTransactionById(paymentId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*'}): Observable<any> {
        if (paymentId === null || paymentId === undefined) {
            throw new Error('Required parameter paymentId was null or undefined when calling getRepaymentTransactionById.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                '*/*'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<ApiResponseRepaymentTransaction>(`${this.configuration.basePath}/v1/payments/${encodeURIComponent(String(paymentId))}`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param pageSize 
     * @param pageNumber 
     * @param requestBody 
     * @param orderBy 
     * @param descending 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getTransactions(pageSize: number, pageNumber: number, requestBody: { [key: string]: object; }, orderBy?: string, descending?: boolean, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<ApiResponseSearchAndPaginationResponseRepaymentTransaction>;
    public getTransactions(pageSize: number, pageNumber: number, requestBody: { [key: string]: object; }, orderBy?: string, descending?: boolean, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpResponse<ApiResponseSearchAndPaginationResponseRepaymentTransaction>>;
    public getTransactions(pageSize: number, pageNumber: number, requestBody: { [key: string]: object; }, orderBy?: string, descending?: boolean, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpEvent<ApiResponseSearchAndPaginationResponseRepaymentTransaction>>;
    public getTransactions(pageSize: number, pageNumber: number, requestBody: { [key: string]: object; }, orderBy?: string, descending?: boolean, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*'}): Observable<any> {
        if (pageSize === null || pageSize === undefined) {
            throw new Error('Required parameter pageSize was null or undefined when calling getTransactions.');
        }
        if (pageNumber === null || pageNumber === undefined) {
            throw new Error('Required parameter pageNumber was null or undefined when calling getTransactions.');
        }
        if (requestBody === null || requestBody === undefined) {
            throw new Error('Required parameter requestBody was null or undefined when calling getTransactions.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (pageSize !== undefined && pageSize !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pageSize, 'pageSize');
        }
        if (pageNumber !== undefined && pageNumber !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pageNumber, 'pageNumber');
        }
        if (orderBy !== undefined && orderBy !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>orderBy, 'orderBy');
        }
        if (descending !== undefined && descending !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>descending, 'descending');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                '*/*'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<ApiResponseSearchAndPaginationResponseRepaymentTransaction>(`${this.configuration.basePath}/v1/payments/repayment`,
            requestBody,
            {
                params: queryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param customerId 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getVirtualAccountTransactionById(customerId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<ApiResponseVirtualAccount>;
    public getVirtualAccountTransactionById(customerId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpResponse<ApiResponseVirtualAccount>>;
    public getVirtualAccountTransactionById(customerId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpEvent<ApiResponseVirtualAccount>>;
    public getVirtualAccountTransactionById(customerId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*'}): Observable<any> {
        if (customerId === null || customerId === undefined) {
            throw new Error('Required parameter customerId was null or undefined when calling getVirtualAccountTransactionById.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                '*/*'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.get<ApiResponseVirtualAccount>(`${this.configuration.basePath}/v1/payments/virtualAccount/${encodeURIComponent(String(customerId))}`,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param pageSize 
     * @param pageNumber 
     * @param requestBody 
     * @param orderBy 
     * @param descending 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getVirtualAccountTransactions(pageSize: number, pageNumber: number, requestBody: { [key: string]: object; }, orderBy?: string, descending?: boolean, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<ApiResponseSearchAndPaginationResponseVirtualAccount>;
    public getVirtualAccountTransactions(pageSize: number, pageNumber: number, requestBody: { [key: string]: object; }, orderBy?: string, descending?: boolean, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpResponse<ApiResponseSearchAndPaginationResponseVirtualAccount>>;
    public getVirtualAccountTransactions(pageSize: number, pageNumber: number, requestBody: { [key: string]: object; }, orderBy?: string, descending?: boolean, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpEvent<ApiResponseSearchAndPaginationResponseVirtualAccount>>;
    public getVirtualAccountTransactions(pageSize: number, pageNumber: number, requestBody: { [key: string]: object; }, orderBy?: string, descending?: boolean, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*'}): Observable<any> {
        if (pageSize === null || pageSize === undefined) {
            throw new Error('Required parameter pageSize was null or undefined when calling getVirtualAccountTransactions.');
        }
        if (pageNumber === null || pageNumber === undefined) {
            throw new Error('Required parameter pageNumber was null or undefined when calling getVirtualAccountTransactions.');
        }
        if (requestBody === null || requestBody === undefined) {
            throw new Error('Required parameter requestBody was null or undefined when calling getVirtualAccountTransactions.');
        }

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (pageSize !== undefined && pageSize !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pageSize, 'pageSize');
        }
        if (pageNumber !== undefined && pageNumber !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>pageNumber, 'pageNumber');
        }
        if (orderBy !== undefined && orderBy !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>orderBy, 'orderBy');
        }
        if (descending !== undefined && descending !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>descending, 'descending');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                '*/*'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<ApiResponseSearchAndPaginationResponseVirtualAccount>(`${this.configuration.basePath}/v1/payments/virtualAccount`,
            requestBody,
            {
                params: queryParameters,
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
