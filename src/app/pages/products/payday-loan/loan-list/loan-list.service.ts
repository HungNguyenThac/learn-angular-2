import {
  APPLICATION_TYPE,
  PAYDAY_LOAN_STATUS,
  REPAYMENT_STATUS,
} from './../../../../core/common/enum/payday-loan';
import {
  ApplicationHmgControllerService,
  ApplicationControllerService,
} from '../../../../../../open-api-modules/dashboard-api-docs';
import {
  ContractControllerService as ContractHmgControllerService,
  PaydayLoanControllerService,
} from '../../../../../../open-api-modules/loanapp-hmg-api-docs';
import {ContractControllerService as ComSignContractAutomation} from 'open-api-modules/com-api-docs';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {CustomerControllerService} from 'open-api-modules/dashboard-api-docs';
import * as _ from 'lodash';
import {QUERY_CONDITION_TYPE} from '../../../../core/common/enum/operator';
import {
  ApiResponseContract,
  ContractControllerService,
  PaydayLoanControllerService as PaydayLoanTngControllerService,
} from '../../../../../../open-api-modules/loanapp-tng-api-docs';
import {FileControllerService} from '../../../../../../open-api-modules/com-api-docs';
import {SignDocumentControllerService} from '../../../../../../open-api-modules/contract-api-docs';
import {ACCOUNT_CLASSIFICATION} from 'src/app/core/common/enum/payday-loan';
import {GlobalConstants} from '../../../../core/common/global-constants';

@Injectable({
  providedIn: 'root',
})
export class LoanListService {
  constructor(
    private paydayLoanControllerService: PaydayLoanControllerService,
    private paydayLoanTngControllerService: PaydayLoanTngControllerService,
    private applicationTngControllerService: ApplicationControllerService,
    private applicationHmgControllerService: ApplicationHmgControllerService,
    private customerControllerService: CustomerControllerService,
    private contractControllerService: ContractControllerService,
    private comSignContractAutomation: ComSignContractAutomation,
    private contractHmgControllerService: ContractHmgControllerService,
    private signContractAutomation: SignDocumentControllerService,
    private fileControllerService: FileControllerService
  ) {
  }

  private _buildRequestBodyGetList(params) {
    let requestBody = {};
    if (!params.status) delete requestBody['status'];
    if (params.status === REPAYMENT_STATUS.OVERDUE) {
      params.status = PAYDAY_LOAN_STATUS.IN_REPAYMENT;
      requestBody['repaymentStatus__e'] = REPAYMENT_STATUS.OVERDUE;
    } else if (params.status === PAYDAY_LOAN_STATUS.IN_REPAYMENT) {
      requestBody['repaymentStatus__ne'] = REPAYMENT_STATUS.OVERDUE;
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
    // requestBody['status'] = params.status;

    if (params.keyword) {
      requestBody['loanCode' + QUERY_CONDITION_TYPE.LIKE_KEYWORD] =
        params.keyword;
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
      'customerInfo.organizationName' + QUERY_CONDITION_TYPE.LIKE_KEYWORD
        ] = params.keyword;
      requestBody[
      'customerInfo.identityNumberOne' + QUERY_CONDITION_TYPE.LIKE_KEYWORD
        ] = params.keyword;
    }

    switch (params.accountClassification) {
      case ACCOUNT_CLASSIFICATION.ALL:
        delete requestBody['customerInfo.mobileNumber'];
        break;

      case ACCOUNT_CLASSIFICATION.TEST:
        requestBody[
        'customerInfo.mobileNumber' + QUERY_CONDITION_TYPE.START_WITH
          ] = GlobalConstants.PL_VALUE_DEFAULT.PREFIX_MOBILE_NUMBER_TEST;
        break;
      case ACCOUNT_CLASSIFICATION.REAL:
      default:
        requestBody[
        'customerInfo.mobileNumber' + QUERY_CONDITION_TYPE.NOT_START_WITH
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
      APPLICATION_TYPE.PDL_TNG,
      requestBody,
      params.orderBy,
      params.sortDirection === 'desc'
    );
  }

  public getContractData(loanId: string, groupName: string) {
    if (groupName === 'TNG') {
      return this.paydayLoanTngControllerService
        .getLoanContractByLoanId(loanId)
        .pipe(
          map((results: ApiResponseContract) => {
            return results;
          }),

          catchError((err) => {
            throw err;
          })
        );
    }

    if (groupName === 'HMG') {
      return this.paydayLoanControllerService
        .getLoanContractByLoanId(loanId)
        .pipe(
          map((results: ApiResponseContract) => {
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
      .adminSignContract({customerId, idRequest, idDocument})
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
      .downloadFile({documentPath, customerId})
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
    let blob = new Blob([data], {type: type});
    let url = window.URL.createObjectURL(blob);
    return url;
  }
}
