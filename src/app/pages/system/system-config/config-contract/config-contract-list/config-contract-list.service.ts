import { Injectable } from '@angular/core';
import {
  CdeControllerService,
  ContractTemplateControllerService,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { QUERY_CONDITION_TYPE } from '../../../../../core/common/enum/operator';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class ConfigContractListService {
  constructor(
    private contractTemplateControllerService: ContractTemplateControllerService
  ) {}

  public getData(params) {
    let requestBody = this._buildRequestBodyGetList(params);

    return this.contractTemplateControllerService.getContractTemplates(
      params.limit,
      params.pageIndex,
      requestBody,
      params.orderBy,
      params.sortDirection === 'desc'
    );
  }

  private _buildRequestBodyGetList(params) {
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
      requestBody['name' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
    }

    console.log('requestBody----', requestBody);
    console.log('params----', params);
    return requestBody;
  }
}
