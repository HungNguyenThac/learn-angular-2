import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ERROR_CODE,
  PL_STEP_NAVIGATION,
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
  ContractControllerService,
  FileControllerService,
} from '../../../../../../open-api-modules/com-api-docs';
import { Router } from '@angular/router';
import { PlPromptComponent } from '../../../../share/components';
import { GlobalConstants } from '../../../../core/common/global-constants';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-contract-terms-of-service',
  templateUrl: './sign-contract-terms-of-service.component.html',
  styleUrls: ['./sign-contract-terms-of-service.component.scss'],
})
export class SignContractTermsOfServiceComponent implements OnInit, OnDestroy {
  @ViewChild(PdfViewerComponent, { static: false })
  private pdfComponent: PdfViewerComponent;

  linkPdf: string = '../assets/img/hmg/hop-dong-test.pdf';
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

  customerId: string;
  customerId$: Observable<string>;

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
  ) {}

  ngOnInit(): void {
    this.onResponsiveInverted();
    window.addEventListener('resize', this.onResponsiveInverted);
    this._initSubscribeState();
    this.initHeaderInfo();
  }

  private _initSubscribeState() {
    this.customerId$ = this.store.select(fromSelectors.getCustomerIdState);

    this.subManager.add(
      this.customerId$.subscribe((customerId) => {
        this.customerId = customerId;
      })
    );
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowLeftBtn(false));
    this.store.dispatch(new fromActions.SetShowRightBtn(true));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(new fromActions.SetShowStepNavigation(true));
    this.store.dispatch(
      new fromActions.SetStepNavigationInfo(
        PL_STEP_NAVIGATION.ADDITIONAL_INFORMATION
      )
    );
  }

  get showSignContractTermsBtn() {
    return this.contractInfo && this.contractInfo.path;
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
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        console.log(confirmed);
        if (confirmed) {
          this.sendLetterOtp();
        }
      })
    );
  }

  sendLetterOtp() {
    let params = this.buildParamsSendLetterOtp();
    this.notificationService.showLoading();
    this.contractControllerService.sendLetterOTPHMG(params).subscribe(
      (response) => {
        if (response && response.responseCode === 200) {
          this.notificationService.hideLoading();
          //TODO return model HIEUKM
          this.disabledOTP = false;
          this.idRequest = response.result.idRequest;
          this.idDocument = response.result.idDocument;
          // this.setSentOtpOnsignStatus(true);
          return;
        }
        if (response.errorCode === ERROR_CODE.SESSION_SIGN_ALREADY_EXIST) {
          this.getLatestApprovalLetter();
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
      () => {
        this.notificationService.hideLoading();
      }
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
  getContract(showLoading = true) {
    this.getUserInfo(showLoading);

    this.getLatestApprovalLetter();

    if (this.contractInfo && this.contractInfo.path && !this.isSentOtpOnsign) {
      this.downloadFile(this.contractInfo.path);
    }

    if (!this.contractInfo) {
      this.createApprovalLetter();
    }
  }

  downloadFile(documentPath) {
    this.notificationService.hideLoading();
    this.subManager.add(
      this.fileControllerService
        .downloadFile({
          customerId: this.customerId,
          documentPath: documentPath,
        })
        .subscribe(
          (response) => {
            this.notificationService.hideLoading();
            this.linkPdf = window.URL.createObjectURL(new Blob([response]));
          },
          (error) => {},
          () => {
            this.notificationService.hideLoading();
          }
        )
    );
  }

  /**
   * Get user info
   * @returns {Promise<{}|null>}
   */
  getUserInfo(showLoading = true) {
    if (showLoading) {
      this.notificationService.showLoading();
    }
    this.subManager.add(
      this.infoControllerService.getInfo(this.customerId).subscribe(
        (response: ApiResponseCustomerInfoResponse) => {
          if (showLoading) {
            this.notificationService.hideLoading();
          }
          if (response.responseCode !== 200) {
            return this.showErrorModal();
          }
          this.userInfo = response.result;
          // this.setCustomerName(this.userInfo?.personalData?.firstName);
          return this.userInfo;
        },
        (error) => {},
        () => {
          if (showLoading) {
            this.notificationService.hideLoading();
          }
        }
      )
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

  async createApprovalLetter() {
    this.notificationService.showLoading();
    this.subManager.add(
      this.contractControllerService
        .createLetterHMG({
          name: this.userInfo.personalData?.firstName,
          dateOfBirth: this.userInfo.personalData?.dateOfBirth,
          nationalId: this.userInfo.personalData?.identityNumberOne,
          customerId: this.customerId,
          idIssuePlace: this.userInfo.personalData?.idIssuePlace,
        })
        .subscribe(
          (response: ApiResponseCreateLetterResponse) => {
            this.notificationService.hideLoading();
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
          () => {
            this.notificationService.hideLoading();
          }
        )
    );
  }

  getLatestApprovalLetter() {
    this.notificationService.showLoading();
    this.subManager.add(
      this.approvalLetterControllerService
        .getApprovalLetterByCustomerId(this.customerId)
        .subscribe(
          (response: ApiResponseApprovalLetter) => {
            this.notificationService.hideLoading();
            if (response.responseCode == 200) {
              this.idRequest = response.result.idRequest;
              this.idDocument = response.result.idDocument;
              this.contractInfo = response.result;
              this.disabledOTP = false;
              // this.setSentOtpOnsignStatus(true);
              return;
            }
            this.contractInfo = null;
          },
          (error) => {},
          () => {
            this.notificationService.hideLoading();
          }
        )
    );
  }

  async resendOtp() {
    this.errorText = null;
    await this.sendLetterOtp();
  }

  verifyOtp(otp) {
    this.errorText = null;
    this.otp = otp.split('');

    this.notificationService.showLoading();
    this.subManager.add(
      this.contractControllerService
        .confirmOPTSign({
          customerId: this.customerId,
          otp: otp,
          idRequest: this.idRequest,
          idDocument: this.idDocument,
        })
        .subscribe(
          (response) => {
            this.notificationService.hideLoading();
            if (!response || response.responseCode !== 200) {
              this.handleErrorVerifyOtp(response);
            }
            // this.setSignedContractTermsStatus(true);
            this.router.navigateByUrl('sign-contract-terms-success');
          },
          (error) => {},
          () => {
            this.notificationService.hideLoading();
          }
        )
    );
  }

  signContract() {
    this.openDialogPrompt();
  }

  handleErrorVerifyOtp(response) {
    switch (response.errorCode) {
      case ERROR_CODE.OTP_INVALID:
      case ERROR_CODE.OTP_EXPIRE_TIME:
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
      case ERROR_CODE.OTP_CONFIRM_MAXIMUM:
        this.disabledOTP = true;
        this.errorText = this.multiLanguageService.instant(
          `payday_loan.error_code.` + response.errorCode.toLowerCase()
        );

        this.showErrorModal(
          null,
          this.multiLanguageService.instant(
            'payday_loan.error_code.otp_confirm_maximum'
          )
        );
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
    this.subManager.unsubscribe();
  }
}
