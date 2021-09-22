import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';

import { NotificationService } from 'src/app/core/services/notification.service';
import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import {
  AdditionalInformationV2Request,
  ApiResponseCustomerInfoResponse,
  CustomerInfoResponse,
  InfoControllerService,
  InfoV2ControllerService,
} from 'open-api-modules/customer-api-docs';
import { ApiResponseObject } from 'open-api-modules/com-api-docs';
import { GlobalConstants } from '../../../../core/common/global-constants';
import { Title } from '@angular/platform-browser';
import * as fromActions from '../../../../core/store';
import { PL_STEP_NAVIGATION } from '../../../../core/common/enum/payday-loan';

@Component({
  selector: 'app-additional-information',
  templateUrl: './additional-information.component.html',
  styleUrls: ['./additional-information.component.scss'],
})
export class AdditionalInformationComponent
  implements OnInit, AfterViewInit, OnDestroy {
  additionalInfoForm: FormGroup;
  //hardcode
  maritalStatus = {
    fieldName: 'Tình trạng độc thân',
    options: ['Độc thân', 'Đã kết hôn', 'Ly hôn', 'Góa vợ/ chồng'],
  };

  educationType = {
    fieldName: 'Trình độ học vấn cao nhất',
    options: ['THPT', 'Trung Cấp', 'Cao Đẳng', 'Đại Học', 'Sau Đại học'],
  };

  borrowerDetailTextVariable1 = {
    fieldName: 'Số người phụ thuộc tài chính',
    options: ['0', '1', '2', '3', 'nhiều hơn 3'],
  };

  borrowerEmploymentHistoryTextVariable1 = {
    fieldName: 'Thời gian làm việc ở công ty đến hiện tại',
    options: [
      'Dưới 6 tháng',
      '6 tháng đến dưới 1 năm',
      '1 năm đến dưới 2 năm',
      '2 năm đến 3 năm',
      'Trên 3 năm',
    ],
  };

  maxAmount: number = 500000000;
  minAmount: number = 4000000;
  step: number = 1000000;

  customerInfo: CustomerInfoResponse;
  public customerId$: Observable<any>;
  customerId: string;
  public coreToken$: Observable<any>;
  coreToken: string;
  subManager = new Subscription();

  constructor(
    private fb: FormBuilder,
    private store: Store<fromStore.State>,
    private router: Router,
    private infoControllerService: InfoControllerService,
    private infoV2ControllerService: InfoV2ControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private cdr: ChangeDetectorRef,
    private titleService: Title
  ) {
    this.additionalInfoForm = this.fb.group({
      maritalStatus: [''],
      educationType: [''],
      borrowerDetailTextVariable1: [''],
      borrowerEmploymentHistoryTextVariable1: [''],
      borrowerEmploymentAverageWage: [''],
    });

    //declare customer id & core token
    this.customerId$ = store.select(fromStore.getCustomerIdState);
    this.coreToken$ = store.select(fromStore.getCoreTokenState);
  }

  ngOnInit(): void {
    //get customer id core token from store
    this.subManager.add(
      this.customerId$.subscribe((id) => {
        this.customerId = id;
        console.log('customer id', id);
      })
    );

    this.subManager.add(
      this.coreToken$.subscribe((coreToken) => {
        this.coreToken = coreToken;
        console.log('coreToken', coreToken);
      })
    );

    this.titleService.setTitle(
      'Bổ sung thông tin' +
      ' - ' +
      GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
    this.initHeaderInfo();

    this.notificationService.showLoading(null);
  }

  ngAfterViewInit(): void {
    // set default value for borrowerEmploymentAverageWage
    this.additionalInfoForm.controls['borrowerEmploymentAverageWage'].setValue(
      this.minAmount
    );
    //get customer info data
    this.subManager.add(
      this.infoControllerService
        .getInfo(this.customerId)
        .subscribe((result: ApiResponseCustomerInfoResponse) => {
          this.notificationService.hideLoading();
          if (!result || result.responseCode !== 200) {
            return this.showError(
              'common.error',
              'common.something_went_wrong'
            );
          }
          
          this.customerInfo = result.result;
          console.log("customerInfo",this.customerInfo);
          this.additionalInfoForm.patchValue({
            maritalStatus: this.customerInfo.personalData.maritalStatus,
            educationType: this.customerInfo.personalData.educationType,
            borrowerDetailTextVariable1:
              this.customerInfo.personalData.borrowerDetailTextVariable1,
            borrowerEmploymentHistoryTextVariable1:
              this.customerInfo.personalData
                .borrowerEmploymentHistoryTextVariable1,
            borrowerEmploymentAverageWage:
              this.customerInfo.personalData.annualIncome,
          });
        })
    );
    this.cdr.detectChanges();
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
        PL_STEP_NAVIGATION.ADDITIONAL_INFORMATION
      )
    );
  }

  onSubmit() {
    if (!this.additionalInfoForm.valid) return;
    // maping for request api additional Infomation
    const additionalInformationV2Request: AdditionalInformationV2Request = {
      maritalStatus: this.additionalInfoForm.controls.maritalStatus.value,
      educationType: this.additionalInfoForm.controls.educationType.value,
      borrowerDetailTextVariable1:
        this.additionalInfoForm.controls.borrowerDetailTextVariable1.value,
      borrowerEmploymentHistoryTextVariable1:
        this.additionalInfoForm.controls.borrowerEmploymentHistoryTextVariable1
          .value,
      annualIncome: this.additionalInfoForm.controls.borrowerEmploymentAverageWage.value,
    };
    console.log('additionalInformationRequest', additionalInformationV2Request);

    this.notificationService.showLoading(null);
    // call api additional Infomation
    this.subManager.add(
      this.infoV2ControllerService
        .additionalInformationV2(
          this.customerId,
          additionalInformationV2Request
        )
        .subscribe((result: ApiResponseObject) => {
          //throw error
          this.notificationService.hideLoading();
          if (!result || result.responseCode !== 200) {
            if (result?.errorCode != null) {
              const message = this.multiLanguageService.instant(
                'payday_loan.error_code.' + result?.errorCode.toLowerCase()
              );
              return this.showError('common.error', message);
            } else {
              return this.showError(
                'common.error',
                'common.something_went_wrong'
              );
            }
          }
          // redirect to loan detemination
          this.router.navigateByUrl('hmg/sign-contract-terms-of-service');
        })
    );
  }

  showError(title: string, content: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(title),
      content: this.multiLanguageService.instant(content),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  onValueChange(event) {
    this.additionalInfoForm.controls.borrowerEmploymentAverageWage.setValue(event.value)
  }
}
