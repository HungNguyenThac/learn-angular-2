import { Injectable } from '@angular/core';
import {
  ApplicationDocumentControllerService as ComApplicationDocumentControllerService,
  CreateApplicationDocumentRequest,
  CreateApplicationDocumentTypeRequest,
  UpdateApplicationDocumentRequest,
  UpdateApplicationDocumentTypeRequest,
} from '../../../../../../../open-api-modules/com-api-docs';
import { ApplicationDocumentControllerService as DashboardApplicationDocumentControllerService } from '../../../../../../../open-api-modules/dashboard-api-docs';
import { QUERY_CONDITION_TYPE } from '../../../../../core/common/enum/operator';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ConfigDocumentListService {
  constructor(
    private comApplicationDocumentControllerService: ComApplicationDocumentControllerService,
    private dashboardApplicationDocumentControllerService: DashboardApplicationDocumentControllerService
  ) {}

  public getDataApplicationDocuments(params) {
    let requestBody = this._buildRequestBodyGetListApplicationDocument(params);

    return this.dashboardApplicationDocumentControllerService.getApplicationDocuments(
      params.limit,
      params.pageIndex,
      requestBody,
      params.orderBy,
      params.sortDirection === 'desc'
    );
  }

  private _buildRequestBodyGetListApplicationDocument(params) {
    let requestBody = {};

    if (params.filterConditions) {
      for (const [paramName, paramValue] of Object.entries(
        params.filterConditions
      )) {
        if (!_.isEmpty(params[paramName])) {
          requestBody[paramName + paramValue] = params[paramName] || '';
        }
      }
    }

    if (params.startTime || params.endTime) {
      requestBody['createdAt' + QUERY_CONDITION_TYPE.BETWEEN] = {
        start: params.startTime,
        end: params.endTime,
      };
    }

    if (params.keyword) {
      requestBody['name' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] = params.keyword;
      requestBody['description' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
    }

    console.log('requestBody----', requestBody);
    console.log('params----', params);
    return requestBody;
  }

  public getDataApplicationDocumentTypes(params) {
    let requestBody =
      this._buildRequestBodyGetListApplicationDocumentType(params);

    return this.dashboardApplicationDocumentControllerService.getApplicationDocumentTypes(
      params.limit,
      params.pageIndex,
      requestBody,
      params.orderBy,
      params.sortDirection === 'desc'
    );
  }

  private _buildRequestBodyGetListApplicationDocumentType(params) {
    let requestBody = {};

    if (params.filterConditions) {
      for (const [paramName, paramValue] of Object.entries(
        params.filterConditions
      )) {
        if (!_.isEmpty(params[paramName])) {
          requestBody[paramName + paramValue] = params[paramName] || '';
        }
      }
    }

    if (params.startTime || params.endTime) {
      requestBody['createdAt' + QUERY_CONDITION_TYPE.BETWEEN] = {
        start: params.startTime,
        end: params.endTime,
      };
    }

    if (params.keyword) {
      requestBody['name' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] = params.keyword;
      requestBody['description' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
    }

    console.log('requestBody----', requestBody);
    console.log('params----', params);
    return requestBody;
  }

  public deleteApplicationDocument(id: string) {
    return this.comApplicationDocumentControllerService.deleteApplicationDocument(
      id
    );
  }

  public deleteApplicationDocumentType(id: string) {
    return this.comApplicationDocumentControllerService.deleteApplicationDocumentType(
      id
    );
  }

  public createApplicationDocument(
    createApplicationDocumentRequest: CreateApplicationDocumentRequest
  ) {
    return this.comApplicationDocumentControllerService.createApplicationDocument(
      createApplicationDocumentRequest
    );
  }

  public updateApplicationDocument(
    id: string,
    updateApplicationDocumentRequest: UpdateApplicationDocumentRequest
  ) {
    return this.comApplicationDocumentControllerService.updateApplicationDocument(
      id,
      updateApplicationDocumentRequest
    );
  }

  public createApplicationDocumentType(
    createApplicationDocumentTypeRequest: CreateApplicationDocumentTypeRequest
  ) {
    return this.comApplicationDocumentControllerService.createApplicationDocumentType(
      createApplicationDocumentTypeRequest
    );
  }

  public updateApplicationDocumentType(
    id: string,
    updateApplicationDocumentTypeRequest: UpdateApplicationDocumentTypeRequest
  ) {
    return this.comApplicationDocumentControllerService.updateApplicationDocumentType(
      id,
      updateApplicationDocumentTypeRequest
    );
  }
}
