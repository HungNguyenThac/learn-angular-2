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

import { ApiResponseCompanyInfo } from '../model/models';
import { ApiResponseListCompanyInfo } from '../model/models';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class CompanyControllerService {

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

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
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
     * @param name 
     * @param groupName 
     * @param avatar 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public createCompany(name: string, groupName: string, avatar: Blob, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<ApiResponseCompanyInfo>;
    public createCompany(name: string, groupName: string, avatar: Blob, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<ApiResponseCompanyInfo>>;
    public createCompany(name: string, groupName: string, avatar: Blob, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<ApiResponseCompanyInfo>>;
    public createCompany(name: string, groupName: string, avatar: Blob, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling createCompany.');
        }
        if (groupName === null || groupName === undefined) {
            throw new Error('Required parameter groupName was null or undefined when calling createCompany.');
        }
        if (avatar === null || avatar === undefined) {
            throw new Error('Required parameter avatar was null or undefined when calling createCompany.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'multipart/form-data'
        ];

        const canConsumeForm = this.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any; };
        let useForm = false;
        let convertFormParamsToString = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        // see https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new HttpParams({encoder: this.encoder});
        }

        if (name !== undefined) {
            formParams = formParams.append('name', <any>name) as any || formParams;
        }
        if (groupName !== undefined) {
            formParams = formParams.append('groupName', <any>groupName) as any || formParams;
        }
        if (avatar !== undefined) {
            formParams = formParams.append('avatar', <any>avatar) as any || formParams;
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<ApiResponseCompanyInfo>(`${this.configuration.basePath}/company/v1/add`,
            convertFormParamsToString ? formParams.toString() : formParams,
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
     * @param id 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCompanyById(id: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<ApiResponseCompanyInfo>;
    public getCompanyById(id: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpResponse<ApiResponseCompanyInfo>>;
    public getCompanyById(id: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpEvent<ApiResponseCompanyInfo>>;
    public getCompanyById(id: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*'}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getCompanyById.');
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

        return this.httpClient.get<ApiResponseCompanyInfo>(`${this.configuration.basePath}/company/v1/${encodeURIComponent(String(id))}`,
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
     * @param groupName 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getListCompany(groupName?: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<ApiResponseListCompanyInfo>;
    public getListCompany(groupName?: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpResponse<ApiResponseListCompanyInfo>>;
    public getListCompany(groupName?: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpEvent<ApiResponseListCompanyInfo>>;
    public getListCompany(groupName?: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*'}): Observable<any> {

        let queryParameters = new HttpParams({encoder: this.encoder});
        if (groupName !== undefined && groupName !== null) {
          queryParameters = this.addToHttpParams(queryParameters,
            <any>groupName, 'groupName');
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

        return this.httpClient.get<ApiResponseListCompanyInfo>(`${this.configuration.basePath}/company/v1/get-list`,
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
     * @param id 
     * @param name 
     * @param groupName 
     * @param avatar 
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateCompany(id: string, name: string, groupName: string, avatar: Blob, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<ApiResponseCompanyInfo>;
    public updateCompany(id: string, name: string, groupName: string, avatar: Blob, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<ApiResponseCompanyInfo>>;
    public updateCompany(id: string, name: string, groupName: string, avatar: Blob, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<ApiResponseCompanyInfo>>;
    public updateCompany(id: string, name: string, groupName: string, avatar: Blob, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling updateCompany.');
        }
        if (name === null || name === undefined) {
            throw new Error('Required parameter name was null or undefined when calling updateCompany.');
        }
        if (groupName === null || groupName === undefined) {
            throw new Error('Required parameter groupName was null or undefined when calling updateCompany.');
        }
        if (avatar === null || avatar === undefined) {
            throw new Error('Required parameter avatar was null or undefined when calling updateCompany.');
        }

        let headers = this.defaultHeaders;

        let httpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (httpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (httpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'multipart/form-data'
        ];

        const canConsumeForm = this.canConsumeForm(consumes);

        let formParams: { append(param: string, value: any): any; };
        let useForm = false;
        let convertFormParamsToString = false;
        // use FormData to transmit files using content-type "multipart/form-data"
        // see https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data
        useForm = canConsumeForm;
        if (useForm) {
            formParams = new FormData();
        } else {
            formParams = new HttpParams({encoder: this.encoder});
        }

        if (name !== undefined) {
            formParams = formParams.append('name', <any>name) as any || formParams;
        }
        if (groupName !== undefined) {
            formParams = formParams.append('groupName', <any>groupName) as any || formParams;
        }
        if (avatar !== undefined) {
            formParams = formParams.append('avatar', <any>avatar) as any || formParams;
        }

        let responseType_: 'text' | 'json' = 'json';
        if(httpHeaderAcceptSelected && httpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.put<ApiResponseCompanyInfo>(`${this.configuration.basePath}/company/v1/${encodeURIComponent(String(id))}`,
            convertFormParamsToString ? formParams.toString() : formParams,
            {
                responseType: <any>responseType_,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
