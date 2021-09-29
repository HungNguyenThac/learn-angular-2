import {
  ContractControllerService,
  CreateLetterRequest,
} from '../../../../../../open-api-modules/com-api-docs';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';
import {
  ApiResponseApprovalLetter,
  ApiResponseCompanyInfo,
  ApiResponseCustomerInfoResponse,
  ApprovalLetterControllerService,
  CompanyControllerService,
  CompanyInfo,
  ConfirmInformationV2Request,
  CustomerInfoResponse,
  InfoControllerService,
  InfoV2ControllerService,
} from 'open-api-modules/customer-api-docs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import { ApiResponseObject } from 'open-api-modules/com-api-docs';
import {
  BorrowerControllerService,
  BorrowerStepOneInput,
} from 'open-api-modules/core-api-docs';
import * as moment from 'moment';
import { GlobalConstants } from '../../../../core/common/global-constants';
import { Title } from '@angular/platform-browser';
import * as fromActions from '../../../../core/store';
import {
  COMPANY_NAME,
  ERROR_CODE_KEY,
  PAYDAY_LOAN_STATUS,
  PL_STEP_NAVIGATION,
} from '../../../../core/common/enum/payday-loan';
import formatSlug from '../../../../core/utils/format-slug';

@Component({
  selector: 'app-confirm-information',
  templateUrl: './confirm-information.component.html',
  styleUrls: ['./confirm-information.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class ConfirmInformationComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  infoForm: FormGroup;
  name: any;

  genderOptions = ['Nam', 'Nữ'];
  customerInfo: CustomerInfoResponse;
  coreUserId: string;
  public customerId$: Observable<any>;
  customerId: string;
  public password$: Observable<any>;
  password: string;
  public coreToken$: Observable<any>;
  coreToken: string;
  hasActiveLoan$: Observable<boolean>;

  companyInfo: CompanyInfo;

  subManager = new Subscription();

  constructor(
    private store: Store<fromStore.State>,
    private router: Router,
    private infoControllerService: InfoControllerService,
    private infoV2ControllerService: InfoV2ControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private borrowerControllerService: BorrowerControllerService,
    private contractControllerService: ContractControllerService,
    private companyControllerService: CompanyControllerService,
    private approvalLetterControllerService: ApprovalLetterControllerService,
    private formBuilder: FormBuilder,
    private titleService: Title
  ) {
    this.infoForm = this.formBuilder.group({
      name: [''],
      dateOfBirth: [''],
      gender: [''],
      identityNumberOne: [''],
      idIssuePlace: [''],
      permanentAddress: [''],
      currentAddress: [''],
      email: ['', Validators.email],
    });

    this.initHeaderInfo();
    this._initSubscribeState();
  }

  ngOnInit(): void {
    this.titleService.setTitle(
      'Xác nhận thông tin' +
        ' - ' +
        GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
  }

  private _initSubscribeState() {
    this.customerId$ = this.store.select(fromStore.getCustomerIdState);
    this.coreToken$ = this.store.select(fromStore.getCoreTokenState);
    this.password$ = this.store.select(fromStore.getPasswordState);
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
      this.customerId$.subscribe((id) => {
        this.customerId = id;
        console.log('customer id', id);
      })
    );
    this.subManager.add(
      this.password$.subscribe((password) => {
        this.password = password;
        console.log('customer password', password);
      })
    );
    this.subManager.add(
      this.coreToken$.subscribe((coreToken) => {
        this.coreToken = coreToken;
        console.log('coreToken', coreToken);
      })
    );
  }

  ngAfterViewInit() {
    this.getCustomerInfo();
  }

  getCustomerInfo() {
    this.subManager.add(
      this.infoControllerService
        .getInfo(this.customerId)
        .subscribe((response: ApiResponseCustomerInfoResponse) => {
          if (!response || response.responseCode !== 200) {
            return this.handleResponseError(response?.errorCode);
          }

          this.customerInfo = response.result;

          this.store.dispatch(new fromActions.SetCustomerInfo(response.result));

          this.initConfirmInfoFormData();

          this.getCompanyInfoById(this.customerInfo.personalData.companyId);
        })
    );
  }

  initConfirmInfoFormData() {
    this.infoForm.patchValue({
      name: this.customerInfo.personalData.firstName,
      dateOfBirth: moment(
        this.customerInfo.personalData.dateOfBirth
      ).toISOString(),
      gender: this.customerInfo.personalData.gender,
      identityNumberOne: this.customerInfo.personalData.identityNumberOne,
      idIssuePlace: this.customerInfo.personalData.idIssuePlace,
      permanentAddress: this.customerInfo.personalData.addressTwoLine1,
      currentAddress: this.customerInfo.personalData.addressOneLine1,
      email: this.customerInfo.personalData.emailAddress,
    });
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowLeftBtn(false));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(new fromActions.SetShowStepNavigation(true));
    this.store.dispatch(
      new fromActions.SetStepNavigationInfo(
        PL_STEP_NAVIGATION.CONFIRM_INFORMATION
      )
    );
  }

  onSubmit() {
    if (!this.infoForm.valid) return;
    this.subManager.add(
      this.infoV2ControllerService
        .validateConfirmInformationRequestV2(
          this.customerId,
          this.buildConfirmInformationRequest()
        )
        .subscribe((result: ApiResponseObject) => {
          if (!result || result.responseCode !== 200) {
            return this.handleResponseError(result.errorCode);
          }
          this.confirmInformationCustomer();
        })
    );
  }

  confirmInformationCustomer() {
    if (this.customerInfo.personalData.stepOne === 'DONE') {
      this.coreUserId = this.customerInfo.personalData.coreUserId;
      return this.confirmInformation();
    }

    const confirmInformationRequest = this.buildConfirmInformationRequest();

    const borrowerStepOneInput = this.buildStepOneData(
      confirmInformationRequest
    );

    this.borrowerControllerService
      .borrowerStepOne(borrowerStepOneInput)
      .subscribe((result: ApiResponseObject) => {
        if (!result || result.responseCode !== 200) {
          return this.handleResponseError(result.errorCode);
        }
        this.store.dispatch(
          new fromActions.SetCoreToken(result.result['access_token'])
        );
        this.coreUserId = result.result['userId'];
        this.confirmInformation();
      });
  }

  getCompanyInfoById(companyId: string) {
    this.subManager.add(
      this.companyControllerService
        .getCompanyById(companyId)
        .subscribe((responseCompanyInfo: ApiResponseCompanyInfo) => {
          if (
            !responseCompanyInfo ||
            responseCompanyInfo.responseCode !== 200
          ) {
            return this.handleResponseError(responseCompanyInfo.errorCode);
          }
          this.companyInfo = responseCompanyInfo.result;
        })
    );
  }

  handleResponseError(errorCode: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant('common.error'),
      content: this.multiLanguageService.instant(
        errorCode && ERROR_CODE_KEY[errorCode]
          ? ERROR_CODE_KEY[errorCode]
          : 'common.something_went_wrong'
      ),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  confirmInformation() {
    this.infoV2ControllerService
      .confirmInformationV2(
        this.customerId,
        this.buildConfirmInformationRequest()
      )
      .subscribe((result: ApiResponseObject) => {
        if (!result || result.responseCode !== 200) {
          return this.handleResponseError(result.errorCode);
        }

        this.getLatestApprovalLetter();
      });
  }

  getLatestApprovalLetter() {
    this.subManager.add(
      this.approvalLetterControllerService
        .getApprovalLetterByCustomerId(this.customerId)
        .subscribe((response: ApiResponseApprovalLetter) => {
          if (
            !this.customerInfo.personalData.approvalLetterId ||
            (response.responseCode === 200 && !response.result?.customerSignDone)
          ) {
            return this.createApprovalLetter();
          }

          return this.router.navigateByUrl('additional-information');
        })
    );
  }

  createApprovalLetter() {
    const createLetterRequest: CreateLetterRequest =
      this.buildCreateLetterRequest();
    this.contractControllerService
      .createLetter(COMPANY_NAME.HMG, createLetterRequest)
      .subscribe((result) => {
        if (!result || result.responseCode !== 200) {
          return this.handleResponseError(result.errorCode);
        }

        this.router.navigateByUrl('/additional-information');
      });
  }

  buildCreateLetterRequest(): CreateLetterRequest {
    return {
      dateOfBirth: this.formatTime(this.infoForm.controls['dateOfBirth'].value),
      name: this.infoForm.controls['name'].value,
      nationalId: this.infoForm.controls['identityNumberOne'].value,
      customerId: this.customerId,
      idIssuePlace: this.infoForm.controls['idIssuePlace'].value,
    };
  }

  buildConfirmInformationRequest(): ConfirmInformationV2Request {
    return {
      firstName: this.infoForm.controls['name'].value,
      dateOfBirth: this.formatTime(this.infoForm.controls['dateOfBirth'].value),
      gender: this.infoForm.controls['gender'].value,
      identityNumberSix: this.infoForm.controls['email'].value,
      identityNumberOne: this.infoForm.controls['identityNumberOne'].value,
      addressTwoLine1: this.infoForm.controls['permanentAddress'].value,
      addressOneLine1: this.infoForm.controls['currentAddress'].value,
      emailAddress: this.infoForm.controls['email'].value,
      idIssuePlace: this.infoForm.controls['idIssuePlace'].value,
      coreUserId: this.coreUserId,
    };
  }

  buildStepOneData(
    confirmInformationRequest: ConfirmInformationV2Request
  ): BorrowerStepOneInput {
    return {
      customerId: this.customerId,
      password: this.password,
      confirmPassword: this.password,
      mobileNumber: this.customerInfo.personalData.mobileNumber,
      firstName: confirmInformationRequest.firstName,
      dateOfBirth: confirmInformationRequest.dateOfBirth,
      gender: confirmInformationRequest.gender,
      identityNumberOne: confirmInformationRequest.identityNumberOne,
      identityNumberSix: confirmInformationRequest.identityNumberSix,
      emailAddress: confirmInformationRequest.emailAddress,
      //permanent address
      addressOneLine1: confirmInformationRequest.addressOneLine1,
      //temporary address
      addressTwoLine1: confirmInformationRequest.addressTwoLine1,
      //Company Name
      borrowerProfileTextVariable2: this.companyInfo.name,
      //Business company code
      borrowerProfileTextVariable3: this.companyInfo.businessCode,
      //Company director
      borrowerProfileTextVariable4: this.companyInfo.owner,
      //Company Address
      borrowerProfileTextVariable5: this.companyInfo.address,
      //Company phone number
      borrowerProfileTextVariable6: this.companyInfo.mobile,
    };
  }

  formatTime(timeInput) {
    if (!timeInput) return;
    return moment(new Date(timeInput), 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY'
    );
  }
}
