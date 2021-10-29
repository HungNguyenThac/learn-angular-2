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
      let startTime = params.startTime
        ? new Date(
            new Date(params.startTime).getTime() + 25200000
          ).toISOString()
        : null;
      let endTime = params.endTime
        ? new Date(new Date(params.endTime).getTime() + 25200000).toISOString()
        : null;

      //If is same day filter between 00:00:00 and 23:59:59
      if (
        !_.isEmpty(startTime) &&
        !_.isEmpty(endTime) &&
        startTime == endTime
      ) {
        endTime = new Date(
          new Date(endTime).getTime() + 86400000 - 1
        ).toISOString();
      }

      requestBody['createdAt' + QUERY_CONDITION_TYPE.BETWEEN] = {
        start: startTime,
        end: endTime,
      };
    }

    return this.customerControllerService.getCustomers(
      params.limit,
      params.pageIndex,
      requestBody,
      params.orderBy,
      params.descending
    );
  }
}
