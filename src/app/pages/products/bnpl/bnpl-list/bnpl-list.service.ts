import { Injectable } from '@angular/core';
import {
  ACCOUNT_CLASSIFICATION,
  DEBT_STATUS,
  PAYDAY_LOAN_STATUS,
  REPAYMENT_STATUS,
} from '../../../../core/common/enum/payday-loan';
import { QUERY_CONDITION_TYPE } from '../../../../core/common/enum/operator';
import { environment } from '../../../../../environments/environment';
import * as _ from 'lodash';
import { BNPL_STATUS } from '../../../../core/common/enum/bnpl';
import { BnplApplicationControllerService } from '../../../../../../open-api-modules/dashboard-api-docs';
import {
  AdminControllerService,
  BnplControllerService,
  ChangeLoanStatusRequest,
  CorePaymentRequest,
  UpdateLoanRequestDto,
} from '../../../../../../open-api-modules/bnpl-api-docs';

@Injectable({
  providedIn: 'root',
})
export class BnplListService {
  constructor(
    private dashboardBnplApplicationControllerService: BnplApplicationControllerService,
    private bnplControllerService: BnplControllerService,
    private adminBnplControllerService: AdminControllerService
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
      case BNPL_STATUS.DISBURSE:
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
      requestBody['merchant.name' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
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

    return this.dashboardBnplApplicationControllerService.findBnplApplications(
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

  public updateBnplApplication(
    id,
    updateLoanRequestDto?: UpdateLoanRequestDto
  ) {
    return this.bnplControllerService.v1ApplicationLoanIdPut(
      id,
      updateLoanRequestDto
    );
  }

  public changeStatusBnplApplication(
    id: string,
    changeLoanStatusRequest?: ChangeLoanStatusRequest
  ) {
    return this.adminBnplControllerService.v1AdminApplicationIdChangeStatusPost(
      id,
      changeLoanStatusRequest
    );
  }

  public repaymentBnplApplication(
    id: string,
    corePaymentRequest?: CorePaymentRequest
  ) {
    return this.adminBnplControllerService.v1AdminApplicationIdRepaymentPost(
      id,
      corePaymentRequest
    );
  }
}