import { Component, OnInit, ViewChild } from '@angular/core';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import {
  ApiResponseCustomerInfoResponse,
  ApprovalLetterControllerService,
  CustomerInfoResponse,
  InfoControllerService,
} from '../../../../../../open-api-modules/customer-api-docs';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  ApiResponseConfirmOTPResponse,
  ApiResponseSignWithOTPResponse,
  ContractControllerService,
  FileControllerService,
  SendContractOTPRequest,
} from '../../../../../../open-api-modules/com-api-docs';
import { ContractControllerService as LoanappContractControllerService } from '../../../../../../open-api-modules/loanapp-api-docs/api/contractController.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from '../../../../core/store';
import * as fromActions from '../../../../core/store';
import { MatDialog } from '@angular/material/dialog';
import * as fromSelectors from '../../../../core/store/selectors';
import {
  COMPANY_NAME,
  DOCUMENT_TYPE,
  ERROR_CODE,
  ERROR_CODE_KEY,
  PAYDAY_LOAN_STATUS,
} from '../../../../core/common/enum/payday-loan';
import { PlPromptComponent } from '../../../../share/components';
import { environment } from '../../../../../environments/environment';
import { GlobalConstants } from '../../../../core/common/global-constants';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import {
  ApiResponsePaydayLoan,
  ApplicationControllerService,
  PaydayLoan,
} from '../../../../../../open-api-modules/loanapp-api-docs';
import {
  ApiResponseAcceptContractResponse,
  BorrowerControllerService,
} from '../../../../../../open-api-modules/core-api-docs';
import { map } from 'rxjs/operators';
import formatSlug from '../../../../core/utils/format-slug';
import { SetNavigationTitle } from '../../../../core/store';

@Component({
  selector: 'app-sign-contract',
  templateUrl: './sign-contract.component.html',
  styleUrls: ['./sign-contract.component.scss'],
})
export class SignContractComponent implements OnInit {
  @ViewChild(PdfViewerComponent, { static: false })
  private pdfComponent: PdfViewerComponent;

  userInfo: CustomerInfoResponse = {};
  currentLoan: PaydayLoan = {};

  linkPdf: any = null;
  page: number = 1;
  responsive: boolean = false;
  contractInfo: any = {};
  isSentOtpOnsign: boolean = false;
  otp: any = [];
  mobile: string = '';
  errorText: string = '';
  disabledOTP: boolean = false;
  idDocument: any = null;
  approvalLetterId: any = null;
  idRequest: any = null;
  contractDocumentPath: any = null;
  displaySignContract: boolean = false;

  customerId: string;
  customerId$: Observable<string>;

  coreToken$: Observable<string>;
  coreToken: string;

  customerMobile$: Observable<string>;

  isSignContractSuccess$: Observable<boolean>;
  isSignContractSuccess: boolean;

  isSentOtpOnsign$: Observable<boolean>;

  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private infoControllerService: InfoControllerService,
    private notificationService: NotificationService,
    private contractControllerService: ContractControllerService,
    private loanappContractControllerService: LoanappContractControllerService,
    private approvalLetterControllerService: ApprovalLetterControllerService,
    private applicationControllerService: ApplicationControllerService,
    private fileControllerService: FileControllerService,
    private borrowerControllerService: BorrowerControllerService,
    private titleService: Title,
    private router: Router,
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {
    this.initHeaderInfo();
    this._initSubscribeState();
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      'Chi tiết hợp đồng' +
        ' - ' +
        GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
    this.onResponsiveInverted();
    window.addEventListener('resize', this.onResponsiveInverted);
    this.initInfo();
  }

  private _initSubscribeState() {
    this.customerMobile$ = this.store.select(
      fromSelectors.getCustomerMobileState
    );
    this.customerId$ = this.store.select(fromSelectors.getCustomerIdState);
    this.isSentOtpOnsign$ = this.store.select(fromSelectors.isSentOtpOnsign);

    this.isSignContractSuccess$ = this.store.select(
      fromSelectors.isSignContractSuccess
    );

    this.coreToken$ = this.store.select(fromStore.getCoreTokenState);
    this.coreToken$.subscribe((token) => {
      this.coreToken = token;
    });

    this.subManager.add(
      this.customerId$.subscribe((customerId) => {
        this.customerId = customerId;
      })
    );

    this.subManager.add(
      this.customerMobile$.subscribe((customerMobile) => {
        this.mobile = customerMobile;
      })
    );

    this.subManager.add(
      this.isSentOtpOnsign$.subscribe((isSentOtpOnsign) => {
        this.isSentOtpOnsign = isSentOtpOnsign;
      })
    );

    this.subManager.add(
      this.isSignContractSuccess$.subscribe((isSignContractSuccess) => {
        this.isSignContractSuccess = isSignContractSuccess;

        if (this.isSignContractSuccess) {
          return this.router.navigateByUrl('hmg/sign-contract-success');
        }
      })
    );

    if (this.isSignContractSuccess) {
      this.router.navigateByUrl('hmg/sign-contract-success');
    }

    // this.store.dispatch(new fromActions.SetShowLeftBtn(this.isSentOtpOnsign));
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowLeftBtn(true));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(new fromActions.SetShowStepNavigation(false));
    this.store.dispatch(new fromActions.SetCurrentLoanCode(null));
    this.store.dispatch(
      new fromActions.SetNavigationTitle('Chi tiết hợp đồng')
    );
  }

  get showSignContractBtn() {
    return (
      (this.contractInfo &&
        this.contractInfo.path &&
        this.currentLoan.status === PAYDAY_LOAN_STATUS.FUNDED) ||
      this.displaySignContract
    );
  }

  initInfo() {
    this.getContract();
  }

  openDialogPrompt() {
    const dialogRef = this.dialog.open(PlPromptComponent, {
      panelClass: 'custom-dialog-container',
      height: 'auto',
      minHeight: '194px',
      data: {
        imgBackgroundClass: 'pl-sign-contract-prompt-image',
        imgGroupUrl: 'sprite-group-3-sign-contract-icon-prompt',
        title: this.multiLanguageService.instant(
          'payday_loan.sign_contract.prompt_title'
        ),
        content: this.multiLanguageService.instant(
          'payday_loan.sign_contract.prompt_body'
        ),
        secondaryBtnText: this.multiLanguageService.instant(
          'payday_loan.sign_contract.disagree'
        ),
        primaryBtnText: this.multiLanguageService.instant(
          'payday_loan.sign_contract.agree'
        ),
      },
    });

    this.subManager.add(
      dialogRef.afterClosed().subscribe((confirmed: string) => {
        console.log(confirmed);
        if (confirmed === 'clickPrimary') {
          this.sendContractPaydayOtp();
        }
      })
    );
  }

  onResponsiveInverted() {
    this.responsive = window.innerWidth < 768;
  }

  /**
   * get Contract
   */
  getContract() {
    this.subManager.add(
      this.getActiveLoan().subscribe((response: ApiResponsePaydayLoan) => {
        if (!response || response.errorCode) {
          return this.handleGetActiveLoanError(response);
        }
        this.currentLoan = response.result;

        this.store.dispatch(
          new fromActions.SetCurrentLoanCode(this.currentLoan.loanCode)
        );
        if (
          this.currentLoan.status !== PAYDAY_LOAN_STATUS.FUNDED &&
          this.currentLoan.status !== PAYDAY_LOAN_STATUS.CONTRACT_AWAITING
        ) {
          return this.router.navigate([
            'hmg/current-loan',
            formatSlug(
              this.currentLoan.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
            ),
          ]);
        }

        this.getUserInfo();

        this.getActiveContract();
      })
    );
  }

  getActiveContract() {
    this.subManager.add(
      this.getCurrentLoanContract().subscribe((contractInfoCurrentLoan) => {
        if (contractInfoCurrentLoan)
          this.contractInfo = contractInfoCurrentLoan;

        if (
          this.contractInfo &&
          this.contractInfo.path &&
          !this.isSentOtpOnsign
        ) {
          this.downloadSingleFile(this.contractInfo.path).subscribe(
            (response) => {
              this.linkPdf = window.URL.createObjectURL(new Blob([response]));
            }
          );
          return;
        }
        this.acceptAndDownloadContract();
      })
    );
  }

  getActiveLoan() {
    return this.applicationControllerService
      .getActiveLoan(this.customerId, this.coreToken)
      .pipe(
        map((response: ApiResponsePaydayLoan) => {
          return response;
        })
      );
  }

  handleGetActiveLoanError(response) {
    if (response.errorCode === ERROR_CODE.DO_NOT_ACTIVE_LOAN_ERROR) {
      this.store.dispatch(new fromActions.SetHasActiveLoanStatus(false));
      this.router.navigateByUrl('companies');
      return;
    }

    this.showErrorModal({
      title: environment.PRODUCTION
        ? this.multiLanguageService.instant('common.error')
        : response.errorCode,
      content: environment.PRODUCTION
        ? this.multiLanguageService.instant('common.something_went_wrong')
        : response.message,
    });
  }

  getCurrentLoanContract() {
    return this.getLoanappContract().pipe(
      map((response) => {
        if (response.responseCode == 200) {
          let contractInfo = response.result;
          this.idRequest = contractInfo.idRequest;
          this.idDocument = contractInfo.idDocument;
          return response.result;
        }
        return null;
      })
    );
  }

  getLoanappContract() {
    return this.loanappContractControllerService
      .getContract(this.currentLoan.id, this.customerId)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  acceptAndDownloadContract() {
    if (!this.contractInfo.status) {
      this.subManager.add(
        this.acceptContract().subscribe(
          (response: ApiResponseAcceptContractResponse) => {
            if (
              !response ||
              response.responseCode !== 200 ||
              !response.result ||
              response.result.code != '200' ||
              response.result.contractAccepted !== 'true'
            ) {
              this.showErrorModal();
              return;
            }

            this.downLoadContractFromCore();
          }
        )
      );
      return;
    }
    this.downLoadContractFromCore();
  }

  downLoadContractFromCore() {
    this.downloadContract().subscribe((response) => {
      if (response.responseCode !== 200 || !response.result) {
        this.showErrorModal();
        return;
      }

      const blob = this.b64toBlob(response.result, 'application/pdf');
      const blobUrl = URL.createObjectURL(blob);

      this.linkPdf = blobUrl;

      this.urlToFile(
        JSON.parse(JSON.stringify(blobUrl)),
        'contract.pdf',
        'pdf'
      ).then(async (file) => {
        this.subManager.add(
          this.uploadSingleFile({
            type: DOCUMENT_TYPE.CONTRACT,
            file: file,
          }).subscribe((response) => {
            if (!response || !response.result) return;

            this.contractDocumentPath = response.result['documentPath'];
          })
        );
      });
      this.displaySignContract = true;
    });
  }

  uploadSingleFile({ type, file }) {
    return this.fileControllerService
      .uploadSingleFile(type, file, this.customerId)
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  urlToFile(url, filename, mimeType) {
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      })
      .catch((e) => {
        // Sentry.captureException(e);
      });
  }

  acceptContract() {
    return this.borrowerControllerService
      .acceptContract({
        access_token: this.coreToken,
        epayCustomerId: this.customerId,
        loanId: this.currentLoan.coreLoanUuid,
        contractId: environment.CONTRACT_UUID,
        activityStatus: environment.CONTRACT_ACTIVITY_STATUS,
      })
      .pipe(
        map((response: ApiResponseAcceptContractResponse) => {
          return response;
        })
      );
  }

  downloadContract() {
    return this.borrowerControllerService
      .borrowerLoanContractDownload({
        epayCustomerId: this.customerId,
        access_token: this.coreToken,
        loanUuid: this.currentLoan.coreLoanUuid,
        contractUuid: environment.CONTRACT_UUID,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  downloadSingleFile(documentPath) {
    return this.fileControllerService
      .downloadFile({
        customerId: this.customerId,
        documentPath: documentPath,
      })
      .pipe(
        map((response: Blob) => {
          return response;
        })
      );
  }

  bindingDataSignContract() {
    return {
      email: this.userInfo.personalData?.identityNumberSix,
      name: this.userInfo.personalData?.firstName,
      address: this.userInfo.personalData?.addressTwoLine1,
      mobile: this.userInfo.personalData?.mobileNumber,
      nationalId: this.userInfo.personalData?.identityNumberOne,
      customerId: this.customerId,
      documentPath: this.contractInfo.path || this.contractDocumentPath,
      loanCode: this.currentLoan.loanCode,
      loanId: this.currentLoan.id,
    };
  }

  sendContractPaydayOtp() {
    let params = this.bindingDataSignContract();

    this.subManager.add(
      this.sendContractOtp(params).subscribe(
        (response: ApiResponseSignWithOTPResponse) => {
          if (response && response.responseCode === 200) {
            this.disabledOTP = false;
            this.idRequest = response.result.idRequest;
            this.idDocument = response.result.idDocument;
            this.store.dispatch(new fromActions.SetSentOtpOnsignStatus(true));
            this.store.dispatch(new fromActions.SetShowLeftBtn(true));
            return;
          }
          if (response.errorCode === ERROR_CODE.SESSION_SIGN_ALREADY_EXIST) {
            this.getCurrentLoanContract().subscribe((currentOtpRequest) => {
              if (
                currentOtpRequest &&
                currentOtpRequest['idRequest'] &&
                currentOtpRequest['idDocument']
              ) {
                this.disabledOTP = false;
                this.store.dispatch(
                  new fromActions.SetSentOtpOnsignStatus(true)
                );
                return;
              }
            });
            return;
          }

          if (response.errorCode === ERROR_CODE.LOCK_CREATE_NEW_SESSION) {
            this.disabledOTP = true;
            return this.showLockedSendOTPMessage(response.result.unLockTime);
          }

          this.showErrorModal(
            null,
            environment.PRODUCTION
              ? this.multiLanguageService.instant('common.something_went_wrong')
              : response.message
          );
        }
      )
    );
  }

  sendContractOtp(params: SendContractOTPRequest) {
    return this.contractControllerService
      .sendContractOTP(COMPANY_NAME.HMG, params)
      .pipe(
        map((response: ApiResponseSignWithOTPResponse) => {
          return response;
        })
      );
  }

  getUserInfo() {
    this.subManager.add(
      this.infoControllerService
        .getInfo(this.customerId)
        .subscribe((response: ApiResponseCustomerInfoResponse) => {
          if (response.responseCode !== 200) {
            return this.showErrorModal();
          }
          this.store.dispatch(new fromActions.SetCustomerInfo(response.result));
          this.userInfo = response.result;
        })
    );
  }

  showErrorModal(title?, content?) {
    this.notificationService.openErrorModal({
      title: title || this.multiLanguageService.instant('common.notification'),
      content:
        content ||
        this.multiLanguageService.instant('common.something_went_wrong'),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  resendOtp() {
    this.errorText = null;
    this.sendContractPaydayOtp();
  }

  verifyOtp(otp) {
    this.errorText = null;
    this.otp = otp.split('');

    this.subManager.add(
      this.contractControllerService
        .confirmOPTSign({
          customerId: this.customerId,
          otp: otp,
          idRequest: this.idRequest,
          idDocument: this.idDocument,
        })
        .subscribe((response: ApiResponseConfirmOTPResponse) => {
          if (!response || response.responseCode !== 200) {
            return this.handleErrorVerifyOtp(response);
          }

          this.store.dispatch(
            new fromActions.SetCurrentLoanCode(this.currentLoan.loanCode)
          );
          this.store.dispatch(new fromActions.SetSignContractSuccess(true));
          this.router.navigateByUrl('hmg/sign-contract-success');
        })
    );
  }

  signContract() {
    this.openDialogPrompt();
  }

  handleErrorVerifyOtp(response) {
    switch (response.errorCode) {
      case ERROR_CODE.OTP_INVALID:
        this.errorText = this.multiLanguageService.instant(
          `payday_loan.error_code.` + response.errorCode.toLowerCase()
        );
        if (response.result.remainingRequests == 0) {
          this.showErrorModal(
            null,
            this.multiLanguageService.instant(
              'payday_loan.error_code.otp_confirm_maximum'
            )
          );
          this.disabledOTP = true;
          return;
        }

        this.showErrorModal(
          null,
          this.multiLanguageService.instant(
            'payday_loan.verify_otp.n_type_wrong_otp',
            {
              remaining: response.result.remainingRequests,
            }
          )
        );
        break;
      case ERROR_CODE.OTP_EXPIRE_TIME:
        this.errorText = this.multiLanguageService.instant(
          `payday_loan.error_code.` + response.errorCode.toLowerCase()
        );
        this.showErrorModal(
          null,
          this.multiLanguageService.instant(
            'payday_loan.error_code.otp_expire_time'
          )
        );
        break;
      case ERROR_CODE.OTP_CONFIRM_MAXIMUM:
        this.disabledOTP = true;
        this.errorText = this.multiLanguageService.instant(
          ERROR_CODE_KEY[response.errorCode]
        );

        this.showErrorModal(null, this.errorText);
        break;
      case ERROR_CODE.NOT_FOUND_SESSION:
        this.disabledOTP = true;
        this.errorText = this.multiLanguageService.instant(
          ERROR_CODE_KEY[response.errorCode]
        );

        this.showErrorModal(null, this.errorText);
        this.store.dispatch(new fromActions.SetSentOtpOnsignStatus(false));
        this.getContract();
        break;
      default:
        break;
    }

    this.otp = [];
  }

  showLockedSendOTPMessage(unlockTime) {
    this.showErrorModal(
      null,
      this.multiLanguageService.instant(
        'payday_loan.sign_contract.locked_sent_otp',
        {
          minute:
            GlobalConstants.PL_VALUE_DEFAULT
              .LOCKED_SEND_OTP_SIGN_CONTRACT_TERMS_MINUTES,
          unlock_timer: unlockTime,
        }
      )
    );
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.onResponsiveInverted);
    this.store.dispatch(new fromActions.SetSentOtpOnsignStatus(false));
    this.subManager.unsubscribe();
  }

  afterload() {
    document
      .querySelector('.ng2-pdf-viewer-container')
      .setAttribute('style', 'position: relative !important');
    document
      .querySelector('pdf-viewer')
      .setAttribute('style', 'height: auto !important');
  }
}
