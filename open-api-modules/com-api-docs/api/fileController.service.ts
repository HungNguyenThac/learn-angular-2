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

import { ApiResponseObject } from '../model/models';
import { DownloadFileRequest } from '../model/models';
import { UploadFileRequest } from '../model/models';
import { UploadMultiFileRequest } from '../model/models';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';



@Injectable({
  providedIn: 'root'
})
export class FileControllerService {

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
     * @param downloadFileRequest
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public downloadFile(downloadFileRequest: DownloadFileRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/octet-stream'}): Observable<Blob>;
    public downloadFile(downloadFileRequest: DownloadFileRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/octet-stream'}): Observable<HttpResponse<Blob>>;
    public downloadFile(downloadFileRequest: DownloadFileRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/octet-stream'}): Observable<HttpEvent<Blob>>;
    public downloadFile(downloadFileRequest: DownloadFileRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/octet-stream'}): Observable<any> {
        if (downloadFileRequest === null || downloadFileRequest === undefined) {
            throw new Error('Required parameter downloadFileRequest was null or undefined when calling downloadFile.');
        }

        let headers = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/octet-stream'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', localVarHttpHeaderAcceptSelected);
        }


        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected !== undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post(`${this.configuration.basePath}/v1/file/download-file`,
            downloadFileRequest,
            {
                responseType: "blob",
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getServiceToken(observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<ApiResponseObject>;
    public getServiceToken(observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpResponse<ApiResponseObject>>;
    public getServiceToken(observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpEvent<ApiResponseObject>>;
    public getServiceToken(observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*'}): Observable<any> {

        let headers = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                '*/*'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', localVarHttpHeaderAcceptSelected);
        }


        let responseType_: 'text' | 'json' = 'json';
        if(localVarHttpHeaderAcceptSelected && localVarHttpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<ApiResponseObject>(`${this.configuration.basePath}/v1/file/get-service-token`,
            null,
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
     * @param requestBody
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public uploadCoreDocument(requestBody: { [key: string]: string; }, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json;charset&#x3D;UTF-8'}): Observable<ApiResponseObject>;
    public uploadCoreDocument(requestBody: { [key: string]: string; }, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json;charset&#x3D;UTF-8'}): Observable<HttpResponse<ApiResponseObject>>;
    public uploadCoreDocument(requestBody: { [key: string]: string; }, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json;charset&#x3D;UTF-8'}): Observable<HttpEvent<ApiResponseObject>>;
    public uploadCoreDocument(requestBody: { [key: string]: string; }, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json;charset&#x3D;UTF-8'}): Observable<any> {
        if (requestBody === null || requestBody === undefined) {
            throw new Error('Required parameter requestBody was null or undefined when calling uploadCoreDocument.');
        }

        let headers = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json;charset=UTF-8'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', localVarHttpHeaderAcceptSelected);
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
        if(localVarHttpHeaderAcceptSelected && localVarHttpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<ApiResponseObject>(`${this.configuration.basePath}/v1/file/upload-document-core`,
            requestBody,
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
     * @param uploadMultiFileRequest
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public uploadMultiFile(uploadMultiFileRequest?: UploadMultiFileRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<ApiResponseObject>;
    public uploadMultiFile(uploadMultiFileRequest?: UploadMultiFileRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpResponse<ApiResponseObject>>;
    public uploadMultiFile(uploadMultiFileRequest?: UploadMultiFileRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpEvent<ApiResponseObject>>;
    public uploadMultiFile(uploadMultiFileRequest?: UploadMultiFileRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*'}): Observable<any> {

        let headers = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                '*/*'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', localVarHttpHeaderAcceptSelected);
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
        if(localVarHttpHeaderAcceptSelected && localVarHttpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<ApiResponseObject>(`${this.configuration.basePath}/v1/file/multi-file`,
            uploadMultiFileRequest,
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
     * @param documentType
     * @param file
     * @param customerId
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public uploadSingleFile(documentType: string, file: Blob, customerId: string, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<ApiResponseObject>;
    public uploadSingleFile(documentType: string, file: Blob, customerId: string, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpResponse<ApiResponseObject>>;
    public uploadSingleFile(documentType: string, file: Blob, customerId: string, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: 'application/json'}): Observable<HttpEvent<ApiResponseObject>>;
    public uploadSingleFile(documentType: string, file: Blob, customerId: string, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: 'application/json'}): Observable<any> {
        if (documentType === null || documentType === undefined) {
            throw new Error('Required parameter documentType was null or undefined when calling uploadSingleFile.');
        }
        if (file === null || file === undefined) {
            throw new Error('Required parameter file was null or undefined when calling uploadSingleFile.');
        }
        if (customerId === null || customerId === undefined) {
            throw new Error('Required parameter customerId was null or undefined when calling uploadSingleFile.');
        }

        let headers = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                'application/json'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', localVarHttpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'multipart/form-data'
        ];

        const canConsumeForm = this.canConsumeForm(consumes);

        let localVarFormParams: { append(param: string, value: any): any; };
        let localVarUseForm = false;
        let localVarConvertFormParamsToString = false;
        if (localVarUseForm) {
            localVarFormParams = new FormData();
        } else {
            localVarFormParams = new HttpParams({encoder: this.encoder});
        }


        let responseType_: 'text' | 'json' = 'json';
        if(localVarHttpHeaderAcceptSelected && localVarHttpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<ApiResponseObject>(`${this.configuration.basePath}/v1/file/single-file`,
            localVarConvertFormParamsToString ? localVarFormParams.toString() : localVarFormParams,
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
     * @param uploadFileRequest
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public uploadSinglePublicFile(uploadFileRequest?: UploadFileRequest, observe?: 'body', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<ApiResponseObject>;
    public uploadSinglePublicFile(uploadFileRequest?: UploadFileRequest, observe?: 'response', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpResponse<ApiResponseObject>>;
    public uploadSinglePublicFile(uploadFileRequest?: UploadFileRequest, observe?: 'events', reportProgress?: boolean, options?: {httpHeaderAccept?: '*/*'}): Observable<HttpEvent<ApiResponseObject>>;
    public uploadSinglePublicFile(uploadFileRequest?: UploadFileRequest, observe: any = 'body', reportProgress: boolean = false, options?: {httpHeaderAccept?: '*/*'}): Observable<any> {

        let headers = this.defaultHeaders;

        let localVarHttpHeaderAcceptSelected: string | undefined = options && options.httpHeaderAccept;
        if (localVarHttpHeaderAcceptSelected === undefined) {
            // to determine the Accept header
            const httpHeaderAccepts: string[] = [
                '*/*'
            ];
            localVarHttpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        }
        if (localVarHttpHeaderAcceptSelected !== undefined) {
            headers = headers.set('Accept', localVarHttpHeaderAcceptSelected);
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
        if(localVarHttpHeaderAcceptSelected && localVarHttpHeaderAcceptSelected.startsWith('text')) {
            responseType_ = 'text';
        }

        return this.httpClient.post<ApiResponseObject>(`${this.configuration.basePath}/v1/file/single-public-file`,
            uploadFileRequest,
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
