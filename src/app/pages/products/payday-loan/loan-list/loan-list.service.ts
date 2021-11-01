import { ApplicationControllerService } from '../../../../../../open-api-modules/loanapp-hmg-api-docs';
import { ApplicationHmgControllerService } from '../../../../../../open-api-modules/dashboard-api-docs';
import { PaydayLoanControllerService } from '../../../../../../open-api-modules/loanapp-hmg-api-docs';
import { Injectable } from '@angular/core';
import { CustomerControllerService } from 'open-api-modules/dashboard-api-docs';
import * as _ from 'lodash';
import { QUERY_CONDITION_TYPE } from '../../../../core/common/enum/operator';

@Injectable({
  providedIn: 'root',
})
export class LoanListService {
  constructor(
    private paydayLoanControllerService: PaydayLoanControllerService,
    private applicationTngControllerService: ApplicationControllerService,
    private applicationHmgControllerService: ApplicationHmgControllerService,
    private customerControllerService: CustomerControllerService
  ) {}

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

    return this.paydayLoanControllerService.getLoanByStatus(
      params.limit,
      params.pageIndex,
      // requestBody,
      params.orderBy
      // params.descending
    );
  }

  public getLoanDataHmg(params) {
    console.log('getData(params)', params);
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
    let queryParams = {
      status: params.status,
      loanCode: params.loanCode,
      mobileNumber: params.mobileNumber,
    };
    if (!params.status) delete queryParams.status;
    console.log('queryParams', queryParams);
    return this.applicationHmgControllerService
      .findApplication1(
        queryParams,
        params.pageSize,
        params.pageNumber,
        params.orderBy,
        params.desc
      )
  }

  public getLoanDataTng(params) {
    console.log('getData(params)', params);
    let queryParams = {
      status: params.status,
      loanCode: params.loanCode,
      mobileNumber: params.mobileNumber,
    };
    if (params.status === 'ALL') delete queryParams.status;
    return this.applicationHmgControllerService
      .findApplication1(
        queryParams,
        params.pageSize,
        params.pageNumber,
        params.orderBy,
        params.desc
      )
  }
}
