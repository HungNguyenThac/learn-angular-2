import { CreateLetterRequest } from './../../../../../../open-api-modules/com-api-docs/model/createLetterRequest';
import { ContractControllerService } from './../../../../../../open-api-modules/com-api-docs/api/contractController.service';
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
import { FormBuilder, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';
import {
  ApiResponseCustomerInfoResponse,
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
import { PL_STEP_NAVIGATION } from '../../../../core/common/enum/payday-loan';

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
  implements OnInit, AfterViewInit, OnDestroy {
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

    this.customerId$ = store.select(fromStore.getCustomerIdState);
    this.coreToken$ = store.select(fromStore.getCoreTokenState);
    this.password$ = store.select(fromStore.getPasswordState);
  }

  ngOnInit(): void {
    this.notificationService.showLoading(null);
    //get customer id, password & core token from store
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

    this.titleService.setTitle(
      'Xác nhận thông tin' +
      ' - ' +
      GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
    this.initHeaderInfo();
  }

  ngAfterViewInit() {
    this.infoControllerService
      .getInfo(this.customerId)
      .subscribe((result: ApiResponseCustomerInfoResponse) => {
        this.notificationService.hideLoading();
        if (!result || result.responseCode !== 200) {
          return this.showError('common.error', 'common.something_went_wrong');
        }
        this.customerInfo = result.result;
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

  onInfoSubmit() {
    if (!this.infoForm.valid) return;
    this.notificationService.showLoading(null);
    this.subManager.add(
      this.infoV2ControllerService
        .validateConfirmInformationRequestV2(this.customerId, {
          firstName: this.infoForm.controls['name'].value,
          dateOfBirth: this.formatTime(
            this.infoForm.controls['dateOfBirth'].value
          ),
          gender: this.infoForm.controls['gender'].value,
          identityNumberSix: this.infoForm.controls['email'].value,
          identityNumberOne: this.infoForm.controls['identityNumberOne'].value,
          addressTwoLine1: this.infoForm.controls['permanentAddress'].value,
          addressOneLine1: this.infoForm.controls['currentAddress'].value,
          emailAddress: this.infoForm.controls['email'].value,
          idIssuePlace: this.infoForm.controls['idIssuePlace'].value,
        })
        .subscribe((result: ApiResponseObject) => {
          if (!result || result.responseCode !== 200) {
            const message = this.multiLanguageService.instant(
              'payday_loan.error_code.' + result.errorCode.toLowerCase()
            );
            this.notificationService.hideLoading();
            this.showError('common.error', message);
            return;
          }
          this.confirmInfomationCustomer();
        })
    );
  }

  bindingConfirmInfomationRequest(): ConfirmInformationV2Request {
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

  confirmInfomationCustomer() {
    if (this.customerInfo.personalData.stepOne === 'DONE') {
      this.coreUserId = this.customerInfo.personalData.coreUserId;
      return this.confirmInfomation();
    }
    const data = this.bindingConfirmInfomationRequest();

    const borrowerStepOneInput: BorrowerStepOneInput = {
      customerId: this.customerId,
      password: this.password,
      confirmPassword: this.password,
      mobileNumber: this.customerInfo.personalData.mobileNumber,
      firstName: data.firstName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      identityNumberOne: data.identityNumberOne,
      identityNumberSix: data.identityNumberSix,
      addressOneLine1: data.addressOneLine1,
      addressTwoLine1: data.addressTwoLine1,
    };

    this.borrowerControllerService
      .borrowerStepOne(borrowerStepOneInput)
      .subscribe((result: ApiResponseObject) => {
        if (!result || result.responseCode !== 200) {
          const message = this.multiLanguageService.instant(
            'payday_loan.error_code.' + result.errorCode.toLowerCase()
          );
          this.notificationService.hideLoading();
          return this.showError('common.error', message);
        }
        this.coreUserId = result.result['userId'];
        this.confirmInfomation();
      });
  }

  confirmInfomation() {
    this.infoV2ControllerService
      .confirmInformationV2(
        this.customerId,
        this.bindingConfirmInfomationRequest()
      )
      .subscribe((result: ApiResponseObject) => {
        if (!result || result.responseCode !== 200) {
          this.notificationService.hideLoading();
          const message = this.multiLanguageService.instant(
            'payday_loan.error_code.' + result.errorCode.toLowerCase()
          );
          return this.showError('common.error', message);
        }

        //success call Api create letter com svc
        const createLetterRequest: CreateLetterRequest = {
          dateOfBirth: this.customerInfo.personalData.dateOfBirth,
          name: this.customerInfo.personalData.firstName,
          nationalId: this.customerId,
          customerId: this.customerId,
          idIssuePlace: this.customerInfo.personalData.idIssuePlace,
        }
        this.contractControllerService.createLetterHMG('HMG', createLetterRequest).subscribe((result) => {
          this.notificationService.hideLoading();
          if (!result || result.responseCode !== 200) {
            const message = this.multiLanguageService.instant(
              'payday_loan.error_code.' + result.errorCode.toLowerCase()
            );
            return this.showError('common.error', message);
          }
          // redirect to additional information
          this.router.navigateByUrl('/hmg/additional-information');
        })
      });
  }

  showError(title: string, content: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(title),
      content: this.multiLanguageService.instant(content),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  formatTime(timeInput) {
    if (!timeInput) return;
    return moment(new Date(timeInput), 'YYYY-MM-DD HH:mm:ss').format(
      'DD/MM/YYYY'
    );
  }

}
