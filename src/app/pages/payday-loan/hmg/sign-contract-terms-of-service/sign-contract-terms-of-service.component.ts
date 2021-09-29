import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  COMPANY_NAME,
  ERROR_CODE,
  ERROR_CODE_KEY,
  PAYDAY_LOAN_STATUS,
} from 'src/app/core/common/enum/payday-loan';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import {
  ApiResponseApprovalLetter,
  ApiResponseCustomerInfoResponse,
  ApprovalLetterControllerService,
  CustomerInfoResponse,
  InfoControllerService,
} from '../../../../../../open-api-modules/customer-api-docs';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import * as fromSelectors from '../../../../core/store/selectors';
import * as fromActions from '../../../../core/store';
import * as fromStore from '../../../../core/store';
import { Store } from '@ngrx/store';
import { NotificationService } from '../../../../core/services/notification.service';
import {
  ApiResponseCreateLetterResponse,
  ApiResponseSignWithOTPResponse,
  ContractControllerService,
  FileControllerService,
} from '../../../../../../open-api-modules/com-api-docs';
import { Router } from '@angular/router';
import { PlPromptComponent } from '../../../../share/components';
import { GlobalConstants } from '../../../../core/common/global-constants';
import { environment } from '../../../../../environments/environment';
import formatSlug from '../../../../core/utils/format-slug';

@Component({
  selector: 'app-contract-terms-of-service',
  templateUrl: './sign-contract-terms-of-service.component.html',
  styleUrls: ['./sign-contract-terms-of-service.component.scss'],
})
export class SignContractTermsOfServiceComponent implements OnInit, OnDestroy {
  @ViewChild(PdfViewerComponent, { static: false })
  private pdfComponent: PdfViewerComponent;

  linkPdf: any = null;
  userInfo: CustomerInfoResponse = {};
  page: number = 1;
  responsive: boolean = false;
  contractInfo: any = {};
  isSentOtpOnsign: boolean = false;
  otp: any = [];
  mobile: string = '';
  errorText: string = '';
  disabledOTP: boolean = false;
  idDocument: any = null;
  idRequest: any = null;
  approvalLetterId: any = null;

  customerId: string;
  customerId$: Observable<string>;

  customerMobile$: Observable<string>;

  isSignContractTermsSuccess$: Observable<boolean>;
  isSignContractTermsSuccess: boolean;

  isSentOtpOnsign$: Observable<boolean>;
  hasActiveLoan$: Observable<boolean>;

  subManager = new Subscription();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private infoControllerService: InfoControllerService,
    private notificationService: NotificationService,
    private contractControllerService: ContractControllerService,
    private approvalLetterControllerService: ApprovalLetterControllerService,
    private fileControllerService: FileControllerService,
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
      'Ký thư chấp thuận' +
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

    this.isSignContractTermsSuccess$ = this.store.select(
      fromSelectors.isSignContractTermsSuccess
    );
    this.hasActiveLoan$ = this.store.select(fromStore.isHasActiveLoan);

    this.subManager.add(
      this.hasActiveLoan$.subscribe((hasActiveLoan) => {
        if (hasActiveLoan) {
          return this.router.navigate([
            'current-loan',
            formatSlug(PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
          ]);
        }
      })
    );

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
      this.isSignContractTermsSuccess$.subscribe(
        (isSignContractTermsSuccess) => {
          this.isSignContractTermsSuccess = isSignContractTermsSuccess;

          if (this.isSignContractTermsSuccess) {
            return this.router.navigateByUrl('sign-approval-letter-success');
          }
        }
      )
    );

    if (this.isSignContractTermsSuccess) {
      return this.router.navigateByUrl('sign-approval-letter-success');
    }

    // this.store.dispatch(new fromActions.SetShowLeftBtn(this.isSentOtpOnsign));
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowLeftBtn(true));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(new fromActions.SetShowStepNavigation(false));
    this.store.dispatch(new fromActions.SetNavigationTitle('Thư chấp thuận'));
  }

  get showSignContractTermsBtn() {
    return this.contractInfo && this.contractInfo.path;
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
          'payday_loan.contract_terms_of_service.prompt_title'
        ),
        content: this.multiLanguageService.instant(
          'payday_loan.contract_terms_of_service.prompt_body'
        ),
        secondaryBtnText: this.multiLanguageService.instant(
          'payday_loan.contract_terms_of_service.disagree'
        ),
        primaryBtnText: this.multiLanguageService.instant(
          'payday_loan.contract_terms_of_service.agree'
        ),
      },
    });

    this.subManager.add(
      dialogRef.afterClosed().subscribe((confirmed: string) => {
        console.log(confirmed);
        if (confirmed === 'clickPrimary') {
          this.sendLetterOtp();
        }
      })
    );
  }

  sendLetterOtp() {
    let params = this.buildParamsSendLetterOtp();
    this.contractControllerService
      .sendLetterOTPHMG(COMPANY_NAME.HMG, params)
      .subscribe(
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
            this.getLatestApprovalLetter(true);
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
        },
        (error) => {},
        () => {}
      );
  }

  buildParamsSendLetterOtp() {
    return {
      email: this.userInfo?.personalData?.identityNumberSix,
      dateOfBirth: this.userInfo?.personalData?.dateOfBirth,
      name: this.userInfo?.personalData?.firstName,
      address: this.userInfo?.personalData?.addressOneLine1,
      mobile: this.userInfo?.personalData?.mobileNumber,
      nationalId: this.userInfo?.personalData?.identityNumberOne,
      idIssuePlace: this.userInfo?.personalData?.idIssuePlace,
      documentPath: this.contractInfo.path,
      customerId: this.customerId,
    };
  }

  onResponsiveInverted() {
    this.responsive = window.innerWidth < 768;
  }

  /**
   * get Contract
   */
  getContract() {
    this.getUserInfo();
  }

  downloadFile(documentPath) {
    this.subManager.add(
      this.fileControllerService
        .downloadFile({
          customerId: this.customerId,
          documentPath: documentPath,
        })
        .subscribe(
          (response) => {
            this.linkPdf = window.URL.createObjectURL(new Blob([response]));
          },
          (error) => {},
          () => {}
        )
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
          this.userInfo = response.result;
          this.getLatestApprovalLetter();
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

  createApprovalLetter() {
    this.subManager.add(
      this.contractControllerService
        .createLetter(COMPANY_NAME.HMG, {
          name: this.userInfo.personalData?.firstName,
          dateOfBirth: this.userInfo.personalData?.dateOfBirth,
          nationalId: this.userInfo.personalData?.identityNumberOne,
          customerId: this.customerId,
          idIssuePlace: this.userInfo.personalData?.idIssuePlace,
        })
        .subscribe(
          (response: ApiResponseCreateLetterResponse) => {
            if (
              !response ||
              !response.result ||
              response.responseCode !== 200
            ) {
              return this.showErrorModal();
            }

            if (response.result.documentPath && !this.isSentOtpOnsign) {
              this.contractInfo = {
                path: response.result.documentPath,
              };

              this.downloadFile(this.contractInfo.path);
            }
          },
          (error) => {},
          () => {}
        )
    );
  }

  getLatestApprovalLetter(setSentOtpStatus: boolean = false) {
    this.subManager.add(
      this.approvalLetterControllerService
        .getApprovalLetterByCustomerId(this.customerId)
        .subscribe((response: ApiResponseApprovalLetter) => {
          if (response.responseCode == 200) {
            if (response.result.customerSignDone) {
              return this.router.navigateByUrl('loan-determination');
            }
            this.idRequest = response.result.idRequest;
            this.idDocument = response.result.idDocument;
            this.approvalLetterId = response.result.id;
            this.contractInfo = response.result;
            this.disabledOTP = false;

            if (
              this.contractInfo &&
              this.contractInfo.path &&
              !this.isSentOtpOnsign
            ) {
              this.downloadFile(this.contractInfo.path);
            }

            if (
              this.contractInfo &&
              this.contractInfo.idRequest &&
              this.contractInfo.idDocument &&
              setSentOtpStatus
            ) {
              this.disabledOTP = false;
              this.store.dispatch(new fromActions.SetSentOtpOnsignStatus(true));
              this.store.dispatch(new fromActions.SetShowLeftBtn(true));
              return;
            }
            return;
          }
          this.contractInfo = null;
          this.createApprovalLetter();
        })
    );
  }

  resendOtp() {
    this.errorText = null;
    this.sendLetterOtp();
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
        .subscribe((response) => {
          if (!response || response.responseCode !== 200) {
            return this.handleErrorVerifyOtp(response);
          }

          this.infoControllerService.customerSignDone(this.customerId, {
            approvalLetterId: this.approvalLetterId,
            idDocument: this.idDocument,
            idRequest: this.idRequest,
          });

          this.store.dispatch(
            new fromActions.SetSignContractTermsSuccess(true)
          );
          this.router.navigateByUrl('sign-approval-letter-success');
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
        this.getLatestApprovalLetter();
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
        'payday_loan.contract_terms_of_service.locked_sent_otp',
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
