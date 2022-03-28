import { Injectable } from '@angular/core';
import {
  ApplicationDocumentControllerService as ComApplicationDocumentControllerService,
  CreateApplicationDocumentRequest,
  CreateApplicationDocumentTypeRequest,
  UpdateApplicationDocumentRequest,
  UpdateApplicationDocumentTypeRequest,
} from '../../../../../../../open-api-modules/com-api-docs';
import { ApplicationDocumentControllerService as DashboardApplicationDocumentControllerService } from '../../../../../../../open-api-modules/dashboard-api-docs';
import {
  ApplicationDocumentsService as MonexCoreApplicationDocumentControllerService,
  CreateApplicationDocumentDto,
  CreateApplicationDocumentTypeDto,
  UpdateAdtMapAdDto,
  UpdateApplicationDocumentDto,
  UpdateApplicationDocumentTypeDto,
} from '../../../../../../../open-api-modules/monexcore-api-docs';
import { QUERY_CONDITION_TYPE } from '../../../../../core/common/enum/operator';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ConfigDocumentListService {
  constructor(
    private dashboardApplicationDocumentControllerService: DashboardApplicationDocumentControllerService,
    private monexCoreApplicationDocumentControllerService: MonexCoreApplicationDocumentControllerService
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
    return this.monexCoreApplicationDocumentControllerService.applicationDocumentControllerDeleteApplicationDocument(
      id
    );
  }

  public deleteApplicationDocumentType(id: string) {
    return this.monexCoreApplicationDocumentControllerService.applicationDocumentControllerDeleteApplicationDocumentType(
      id
    );
  }

  public createApplicationDocument(
    createApplicationDocumentRequest: CreateApplicationDocumentDto
  ) {
    return this.monexCoreApplicationDocumentControllerService.applicationDocumentControllerCreateApplicationDocument(
      createApplicationDocumentRequest
    );
  }

  public updateApplicationDocument(
    id: string,
    updateApplicationDocumentRequest: UpdateApplicationDocumentDto
  ) {
    return this.monexCoreApplicationDocumentControllerService.applicationDocumentControllerUpdateApplicationDocument(
      id,
      updateApplicationDocumentRequest
    );
  }

  public createApplicationDocumentType(
    createApplicationDocumentTypeRequest: CreateApplicationDocumentTypeDto
  ) {
    return this.monexCoreApplicationDocumentControllerService.applicationDocumentControllerCreateApplicationDocumentType(
      createApplicationDocumentTypeRequest
    );
  }

  public updateApplicationDocumentType(
    id: string,
    updateApplicationDocumentTypeRequest: UpdateApplicationDocumentTypeDto
  ) {
    return this.monexCoreApplicationDocumentControllerService.applicationDocumentControllerUpdateApplicationDocumentType(
      id,
      updateApplicationDocumentTypeRequest
    );
  }

  public updateDocumentTypeApplicationDocument(
    id,
    appendApplicationDocumentTypeIds,
    descApplicationDocumentTypeIds
  ) {
    let updateAdtMapAdDto: UpdateAdtMapAdDto = {};
    if (
      appendApplicationDocumentTypeIds &&
      appendApplicationDocumentTypeIds.length > 0
    ) {
      updateAdtMapAdDto.appendApplicationDocumentTypeIds =
        appendApplicationDocumentTypeIds;
    }
    if (
      descApplicationDocumentTypeIds &&
      descApplicationDocumentTypeIds.length > 0
    ) {
      updateAdtMapAdDto.descApplicationDocumentTypeIds =
        descApplicationDocumentTypeIds;
    }
    return this.monexCoreApplicationDocumentControllerService.applicationDocumentControllerUpdateAdtAd(
      id,
      updateAdtMapAdDto
    );
  }
}
