import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { QUERY_CONDITION_TYPE } from '../../../../../core/common/enum/operator';
import { CdeControllerService } from '../../../../../../../open-api-modules/dashboard-api-docs';

@Injectable({
  providedIn: 'root',
})
export class PdQuestionsListService {
  constructor(private cdeControllerService: CdeControllerService) {}

  public getData(params) {
    let requestBody = this._buildRequestBodyGetList(params);

    return this.cdeControllerService.getQuestions(
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
      requestBody['fullName' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['username' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
    }

    console.log('requestBody----', requestBody);
    console.log('params----', params);
    return requestBody;
  }
}
