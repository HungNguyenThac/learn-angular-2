import { Injectable } from '@angular/core';
import { CustomerControllerService } from 'open-api-modules/dashboard-api-docs';
import * as _ from 'lodash';
import { QUERY_CONDITION_TYPE } from '../../../core/common/enum/operator';

@Injectable({
  providedIn: 'root',
})
export class CustomerListService {
  constructor(private customerControllerService: CustomerControllerService) {}

  public getData(params) {
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
      requestBody['firstName' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['mobileNumber' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['emailAddress' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['organizationName' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
    }
    console.log('requestBody----', requestBody);
    console.log('params----', params);

    return this.customerControllerService.getCustomers(
      params.limit,
      params.pageIndex,
      requestBody,
      params.orderBy,
      params.sortDirection === 'desc'
    );
  }
}
