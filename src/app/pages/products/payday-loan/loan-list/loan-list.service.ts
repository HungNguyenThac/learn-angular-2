import { ApplicationTngControllerService } from '../../../../../../open-api-modules/dashboard-api-docs';
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
    private applicationTngControllerService: ApplicationTngControllerService,
    private applicationHmgControllerService: ApplicationHmgControllerService,
    private customerControllerService: CustomerControllerService
  ) {}

  public getLoanDataHmg(params) {
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
    requestBody['status'] = params.status;
    requestBody['loanCode'] = params.loanCode;
    requestBody['mobileNumber'] = params.mobileNumber;
    if (!params.status) delete requestBody['status'];
    if (params.keyword) {
      requestBody['loanCode' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['mobileNumber' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['emailAddress' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['officeCode' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['identityNumberOne' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
    }
    console.log('requestBody--------------------------------', requestBody);
     requestBody = {}

    return this.applicationHmgControllerService.findApplications1(
      requestBody,
      params.pageSize,
      params.pageNumber,
      params.orderBy,
      params.sortDirection === 'desc'
    );
  }

  public getLoanDataTng(params) {
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

    let queryParams = {
      status: params.status,
      loanCode: params.loanCode,
      mobileNumber: params.mobileNumber,
    };
    if (!params.status) delete queryParams.status;
    return this.applicationTngControllerService.findApplications(
      queryParams,
      params.pageSize,
      params.pageNumber,
      params.orderBy,
      params.sortDirection === 'desc'
    );
  }
}
