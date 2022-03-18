import { Injectable } from '@angular/core';
import { MerchantControllerService } from 'open-api-modules/dashboard-api-docs';
import * as _ from 'lodash';
import { QUERY_CONDITION_TYPE } from '../../../../core/common/enum/operator';

@Injectable({
  providedIn: 'root',
})
export class MerchantListService {
  constructor(private merchantControllerService: MerchantControllerService) {}

  public getData(params) {
    let requestBody = this._buildRequestBodyGetList(params);

    return this.merchantControllerService.getMerchants(
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
      requestBody['code' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['name' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['email' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['mobile' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
    }

    console.log('requestBody----', requestBody);
    console.log('params----', params);
    return requestBody;
  }
}
