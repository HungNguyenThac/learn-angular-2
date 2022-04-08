import { Injectable } from '@angular/core';
import {
  ACCOUNT_CLASSIFICATION,
  DEBT_STATUS,
  PAYDAY_LOAN_STATUS,
  REPAYMENT_STATUS,
} from '../../../../core/common/enum/payday-loan';
import { QUERY_CONDITION_TYPE } from '../../../../core/common/enum/operator';
import { environment } from '../../../../../environments/environment';
import { BnplApplicationControllerService } from '../../../../../../open-api-modules/dashboard-api-docs';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class BnplListService {
  constructor(
    private bnplApplicationControllerService: BnplApplicationControllerService
  ) {}

  private _buildRequestBodyGetList(params) {
    let requestBody = {};
    if (!params.status) delete requestBody['status'];
    console.log('params.status', params.status);
    switch (params.status) {
      case REPAYMENT_STATUS.OVERDUE:
        params.status = PAYDAY_LOAN_STATUS.IN_REPAYMENT;
        requestBody['defaultStatus__ne'] = true;
        requestBody['repaymentStatus__e'] = REPAYMENT_STATUS.OVERDUE;
        break;
      case DEBT_STATUS.BADDEBT:
        requestBody['defaultStatus'] = true;
        requestBody['repaymentStatus__e'] = REPAYMENT_STATUS.OVERDUE;
        params.status = PAYDAY_LOAN_STATUS.IN_REPAYMENT;
        break;
      case PAYDAY_LOAN_STATUS.IN_REPAYMENT:
        requestBody['repaymentStatus__ne'] = REPAYMENT_STATUS.OVERDUE;
        break;
      default:
        break;
    }

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
      requestBody[
        'customerInfo.firstName' + QUERY_CONDITION_TYPE.LIKE_KEYWORD
      ] = params.keyword;
      requestBody[
        'customerInfo.mobileNumber' + QUERY_CONDITION_TYPE.LIKE_KEYWORD
      ] = params.keyword;
      requestBody[
        'customerInfo.emailAddress' + QUERY_CONDITION_TYPE.LIKE_KEYWORD
      ] = params.keyword;
      requestBody[
        'merchant.name' + QUERY_CONDITION_TYPE.LIKE_KEYWORD
      ] = params.keyword;
    }

    switch (params.accountClassification) {
      case ACCOUNT_CLASSIFICATION.ALL:
        delete requestBody['customerInfo.mobileNumber'];
        break;

      case ACCOUNT_CLASSIFICATION.TEST:
        requestBody[
          'customerInfo.mobileNumber' + QUERY_CONDITION_TYPE.START_WITH
        ] = environment.PREFIX_MOBILE_NUMBER_TEST;
        break;
      case ACCOUNT_CLASSIFICATION.REAL:
      default:
        requestBody[
          'customerInfo.mobileNumber' + QUERY_CONDITION_TYPE.NOT_START_WITH
        ] = environment.PREFIX_MOBILE_NUMBER_TEST;
        requestBody[
          'customerInfo.identityNumberOne' + QUERY_CONDITION_TYPE.NOT_EQUAL
        ] = environment.IDENTITY_NUMBER_ONE_TEST;
        requestBody[
          'customerInfo.organizationName' + QUERY_CONDITION_TYPE.NOT_IN
        ] = environment.ORGANIZATION_NAME_TEST;
        requestBody['status' + QUERY_CONDITION_TYPE.NOT_EQUAL] =
          environment.PAYDAY_LOAN_STATUS_TEST;
        break;
    }
    console.log('requestBody--------------------------------', requestBody);
    return requestBody;
  }

  public getData(params) {
    let requestBody = this._buildRequestBodyGetList(params);

    return this.bnplApplicationControllerService.findBnplApplications(
      params.pageSize,
      params.pageNumber,
      requestBody,
      params.orderBy,
      params.sortDirection === 'desc'
    );
  }


  public convertBlobType(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    return url;
  }
}
