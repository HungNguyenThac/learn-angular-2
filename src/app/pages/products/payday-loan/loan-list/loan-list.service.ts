import { query } from '@angular/animations';
import { ApplicationTngControllerService } from '../../../../../../open-api-modules/dashboard-api-docs';
import { ApplicationHmgControllerService } from '../../../../../../open-api-modules/dashboard-api-docs';
import {
  PaydayLoanControllerService,
  ContractControllerService as ContractHmgControllerService,
} from '../../../../../../open-api-modules/loanapp-hmg-api-docs';
import { ContractControllerService as ComSignContractAutomation } from 'open-api-modules/com-api-docs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { CustomerControllerService } from 'open-api-modules/dashboard-api-docs';
import * as _ from 'lodash';
import { QUERY_CONDITION_TYPE } from '../../../../core/common/enum/operator';
import {
  ApiResponseContract,
  ContractControllerService,
} from '../../../../../../open-api-modules/loanapp-tng-api-docs';
import { FileControllerService } from '../../../../../../open-api-modules/com-api-docs';
import { SignDocumentControllerService } from '../../../../../../open-api-modules/contract-api-docs';
import { ACCOUNT_CLASSIFICATION } from 'src/app/core/common/enum/payday-loan';
import { GlobalConstants } from '../../../../core/common/global-constants';

@Injectable({
  providedIn: 'root',
})
export class LoanListService {
  constructor(
    private paydayLoanControllerService: PaydayLoanControllerService,
    private applicationTngControllerService: ApplicationTngControllerService,
    private applicationHmgControllerService: ApplicationHmgControllerService,
    private customerControllerService: CustomerControllerService,
    private contractControllerService: ContractControllerService,
    private comSignContractAutomation: ComSignContractAutomation,
    private contractHmgControllerService: ContractHmgControllerService,
    private signContractAutomation: SignDocumentControllerService,
    private fileControllerService: FileControllerService
  ) {}

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
    // requestBody['status'] = params.status;

    if (!params.status) delete requestBody['status'];
    if (params.keyword) {
      requestBody['loanCode' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['customerName' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['customerMobileNumber' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody['customerEmail' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
      requestBody[
        'customerOrganizationName' + QUERY_CONDITION_TYPE.LIKE_KEYWORD
      ] = params.keyword;
      requestBody[
        'customerIdentityNumberOne' + QUERY_CONDITION_TYPE.LIKE_KEYWORD
      ] = params.keyword;
    }

    switch (params.accountClassification) {
      case ACCOUNT_CLASSIFICATION.ALL:
        delete requestBody['customerMobileNumber'];
        break;

      case ACCOUNT_CLASSIFICATION.TEST:
        requestBody['customerMobileNumber' + QUERY_CONDITION_TYPE.START_WITH] =
          GlobalConstants.PL_VALUE_DEFAULT.PREFIX_MOBILE_NUMBER_TEST;
        break;
      case ACCOUNT_CLASSIFICATION.REAL:
      default:
        requestBody[
          'customerMobileNumber' + QUERY_CONDITION_TYPE.NOT_START_WITH
        ] = GlobalConstants.PL_VALUE_DEFAULT.PREFIX_MOBILE_NUMBER_TEST;
        break;
    }
    console.log('requestBody--------------------------------', requestBody);
    return requestBody;
  }

  public getLoanDataHmg(params) {
    let requestBody = this._buildRequestBodyGetList(params);

    return this.applicationHmgControllerService.findApplications1(
      params.pageSize,
      params.pageNumber,
      requestBody,
      params.orderBy,
      params.sortDirection === 'desc'
    );
  }

  public getLoanDataTng(params) {
    let requestBody = this._buildRequestBodyGetList(params);

    return this.applicationTngControllerService.findApplications(
      params.pageSize,
      params.pageNumber,
      requestBody,
      params.orderBy,
      params.sortDirection === 'desc'
    );
  }

  public getContractData(
    loanId: string,
    customerId: string,
    groupName: string
  ) {
    if (groupName === 'TNG') {
      return this.contractControllerService
        .getContractByLoanId(loanId, customerId)
        .pipe(
          map((results: ApiResponseContract) => {
            console.log('display ok');
            return results;
          }),

          catchError((err) => {
            throw err;
          })
        );
    }

    if (groupName === 'HMG') {
      return this.contractHmgControllerService
        .getContract(loanId, customerId)
        .pipe(
          map((results: ApiResponseContract) => {
            console.log('display ok');
            return results;
          }),

          catchError((err) => {
            throw err;
          })
        );
    }
  }

  public signContract(
    customerId: string,
    idRequest: number,
    idDocument: number
  ) {
    //contract svc
    // return this.signContractAutomation
    //   .v1SignAdminSignContractPost({ customerId, idRequest, idDocument })
    //   .pipe(
    //     map((results) => {
    //       return results;
    //     }),

    //     catchError((err) => {
    //       throw err;
    //     })
    //   );

    // com svc
    return this.comSignContractAutomation
      .adminSignContract({ customerId, idRequest, idDocument })
      .pipe(
        map((results) => {
          return results;
        }),

        catchError((err) => {
          throw err;
        })
      );
  }

  public downloadSingleFileContract(documentPath: string, customerId: string) {
    return this.fileControllerService
      .downloadFile({ documentPath, customerId })
      .pipe(
        map((results) => {
          return this.convertBlobType(results, 'application/pdf');
        }),

        catchError((err) => {
          throw err;
        })
      );
  }

  public downloadBlobFile(src) {
    const a = document.createElement('a');
    a.setAttribute('target', '_blank');
    a.setAttribute('href', src);
    a.setAttribute('download', src.split('/').pop());
    document.body.appendChild(a);
    a.click();
    a.remove();
    console.log(src);
  }

  public convertBlobType(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    return url;
  }
}
