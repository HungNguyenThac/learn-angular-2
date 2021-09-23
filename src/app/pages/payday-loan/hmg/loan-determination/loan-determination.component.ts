import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';
import {
  ApiResponseCustomerInfoResponse,
  CustomerInfoResponse,
  InfoControllerService,
} from 'open-api-modules/customer-api-docs';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import {
  ApiResponseApplyResponse,
  ApiResponseListVoucher,
  ApiResponsePaydayLoan,
  ApplicationControllerService,
  CreateApplicationRequest,
  PaydayLoanControllerService,
  PromotionControllerService,
  Voucher,
  VoucherTransaction,
} from 'open-api-modules/loanapp-api-docs';
import {
  DownloadFileRequest,
  FileControllerService,
} from 'open-api-modules/com-api-docs';
import formatSlug from 'src/app/core/utils/format-slug';
import {
  PAYDAY_LOAN_STATUS,
  PL_STEP_NAVIGATION,
} from 'src/app/core/common/enum/payday-loan';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { PlVoucherListComponent } from '../../components/pl-voucher-list/pl-voucher-list.component';
import * as moment from 'moment';
import { GlobalConstants } from '../../../../core/common/global-constants';
import * as fromActions from '../../../../core/store';
import { IllustratingImgDialogComponent } from '../../components/illustrating-img-dialog/illustrating-img-dialog.component';

@Component({
  selector: 'app-loan-determination',
  templateUrl: './loan-determination.component.html',
  styleUrls: ['./loan-determination.component.scss'],
})
export class LoanDeterminationComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  loanDeteminationForm: FormGroup;
  maxAmount: number;
  minAmount: number = 2000000;
  step: number = 500000;
  loanPurpose = {
    fieldName: 'Mục đích ứng lương',
    options: [
      'Chi phí sinh hoạt thiết yếu',
      'Chi phí y tế',
      'Chi phí bảo hiểm',
      'Chi phí giáo dục',
      'Chi phí phát sinh đột xuất',
      'Đầu tư',
      'Khác',
    ],
  };
  collateralImgSrc: any;
  collateralFile: any;

  customerInfo: CustomerInfoResponse;
  coreUserId: string;
  public customerId$: Observable<any>;
  customerId: string;
  public coreToken$: Observable<any>;
  coreToken: string;

  listVoucher: Array<Voucher>;
  voucherShowError: string;
  voucherApplied: VoucherTransaction;
  discount: number = 0;
  isCorrectedVoucherApplied: boolean = false;

  subManager = new Subscription();

  constructor(
    private store: Store<fromStore.State>,
    private router: Router,
    private infoControllerService: InfoControllerService,
    private notificationService: NotificationService,
    private multiLanguageService: MultiLanguageService,
    private applicationControllerService: ApplicationControllerService,
    private fileControllerService: FileControllerService,
    private paydayLoanControllerService: PaydayLoanControllerService,
    private promotionControllerService: PromotionControllerService,
    public sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    private titleService: Title
  ) {
    this.loanDeteminationForm = fb.group({
      loanAmount: [''],
      loanPurpose: [''],
      collateralDocument: [''],
      voucherCode: [''],
    });
    this.initHeaderInfo();
    this._initSubscribeState();
  }

  ngOnInit(): void {
    //get customer id, password & core token from store

    this.titleService.setTitle(
      'Chọn số tiền cần ứng' +
        ' - ' +
        GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
    this.getVoucherList();
  }

  ngAfterViewInit() {
    this.loanDeteminationForm.controls['loanAmount'].setValue(this.minAmount);

    //get customer info
    this.subManager.add(
      this.infoControllerService
        .getInfo(this.customerId)
        .subscribe((result: ApiResponseCustomerInfoResponse) => {
          if (!result || result.responseCode !== 200) {
            return this.showError(
              'common.error',
              'common.something_went_wrong'
            );
          }
          this.customerInfo = result.result;
          this.getLoanMaxAmount();
          this.checkLoanExisted();
        })
    );
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  private _initSubscribeState() {
    this.customerId$ = this.store.select(fromStore.getCustomerIdState);
    this.coreToken$ = this.store.select(fromStore.getCoreTokenState);
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
  }

  initHeaderInfo() {
    this.store.dispatch(new fromActions.ResetPaydayLoanInfo());
    this.store.dispatch(new fromActions.SetShowLeftBtn(false));
    this.store.dispatch(new fromActions.SetShowRightBtn(false));
    this.store.dispatch(new fromActions.SetShowProfileBtn(true));
    this.store.dispatch(new fromActions.SetShowStepNavigation(true));
    this.store.dispatch(
      new fromActions.SetStepNavigationInfo(
        PL_STEP_NAVIGATION.CHOOSE_AMOUNT_TO_BORROW
      )
    );
  }

  checkLoanExisted() {
    this.applicationControllerService
      .getActiveLoan(this.customerId, this.coreToken)
      .subscribe((result: ApiResponsePaydayLoan) => {
        if (result.responseCode === 200) {
          return this.router.navigate([
            'hmg/current-loan',
            formatSlug(
              result.result.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
            ),
          ]);
        }
        this.bindingCollateralDocument();
      });
  }

  bindingCollateralDocument() {
    if (
      !this.customerInfo?.personalData ||
      !this.customerInfo?.personalData.collateralDocument
    )
      return;

    const downloadFileRequest: DownloadFileRequest = {
      documentPath: this.customerInfo?.personalData.collateralDocument,
      customerId: this.customerId,
    };
    this.fileControllerService
      .downloadFile(downloadFileRequest)
      .subscribe((blob) => {
        let objectURL = URL.createObjectURL(blob);
        this.collateralImgSrc =
          this.sanitizer.bypassSecurityTrustUrl(objectURL);
      });
  }

  resultCollateral(result) {
    this.loanDeteminationForm.controls['collateralDocument'].setValue(
      result.file
    );
    this.collateralImgSrc = result.imgSrc;
  }

  onSubmit() {
    if (!this.loanDeteminationForm.valid) return;
    console.log(this.loanDeteminationForm.getRawValue());

    const createApplicationRequest: CreateApplicationRequest = {
      coreToken: this.coreToken,
      customerId: this.customerId,
      expectedAmount: this.loanDeteminationForm.controls.loanAmount.value,
      purpose: this.loanDeteminationForm.controls.loanPurpose.value,
      voucherTransaction: this.voucherApplied,
    };

    this.paydayLoanControllerService
      .createLoan(createApplicationRequest)
      .subscribe((result: ApiResponseApplyResponse) => {
        if (!result || result.responseCode !== 200) {
          const message = this.multiLanguageService.instant(
            'payday_loan.error_code.' + result.errorCode.toLowerCase()
          );
          return this.showError('common.error', message);
        }
        const loanStatus = result.result.status;

        //call api com svc upload document vehicle registration
        if (this.loanDeteminationForm.controls['collateralDocument'].value) {
          this.fileControllerService
            .uploadSingleFile(
              'VEHICLE_REGISTRATION',
              this.loanDeteminationForm.controls['collateralDocument'].value,
              this.customerId
            )
            .subscribe((result) => {
              if (!result || result.responseCode !== 200) {
                const message = this.multiLanguageService.instant(
                  'payday_loan.error_code.' + result.errorCode.toLowerCase()
                );
                return this.showError('common.error', message);
              }

              return this.router.navigate([
                'hmg/current-loan',
                formatSlug(loanStatus || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
              ]);
            });
        } else {
          return this.router.navigate([
            'hmg/current-loan',
            formatSlug(loanStatus || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
          ]);
        }
      });
  }

  getVoucherList() {
    this.subManager.add(
      this.promotionControllerService
        .createVoucher1()
        .subscribe((result: ApiResponseListVoucher) => {
          if (!result && result.responseCode !== 200) {
            const message = this.multiLanguageService.instant(
              'payday_loan.error_code.' + result.errorCode.toLowerCase()
            );
            return this.showError('common.error', message);
          }
          console.log('result', result);
          this.listVoucher = result.result;
        })
    );
  }

  openDialogVoucherList() {
    const dialogRef = this.dialog.open(PlVoucherListComponent, {
      width: '320px',
      autoFocus: false,
      data: this.listVoucher,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result: Voucher) => {
      if (!result) return;
      this.loanDeteminationForm.controls.voucherCode.setValue(result.code);
      this.checkVoucherApplied();
    });
  }

  get loanAmountFormatMillionPrice() {
    return this.loanDeteminationForm.controls['loanAmount'].value;
  }

  get originalLoanFee() {
    return this.loanAmountFormatMillionPrice * 0.02;
  }

  get loanFeeTotal() {
    return this.originalLoanFee - this.discount;
  }

  checkVoucherApplied() {
    // Pick voucher from dialog
    if (this.loanDeteminationForm.controls.voucherCode.value === '') {
      return;
    }

    for (const voucher of this.listVoucher) {
      if (
        voucher.code ===
        this.loanDeteminationForm.controls.voucherCode.value.toUpperCase()
      ) {
        if (voucher.remainAmount <= 0) {
          this.loanDeteminationForm.controls.voucherCode.setErrors({
            runOut: true,
          });
          this.voucherShowError =
            'payday_loan.choose_amount.codes_has_run_out | translate';
          return;
        }

        if (this.checkVoucherTime(voucher) === false) {
          this.loanDeteminationForm.controls.voucherCode.setErrors({
            wrongTime: true,
          });
          this.voucherShowError =
            'Mã ưu đãi không áp dụng trong khung giờ hiện tại';
          return;
        }
        this.loanDeteminationForm.controls.voucherCode.setValue(voucher.code);
        this.applyCorrectedVoucher(voucher);
        return;
      }
    }
    this.loanDeteminationForm.controls.voucherCode.setErrors({
      incorrect: true,
    });
    this.voucherShowError = 'Mã ưu đãi không tồn tại';
    console.log('this.voucherShowError', this.voucherShowError);
  }

  applyCorrectedVoucher(voucher: Voucher) {
    this.discount = voucher.percentage * this.originalLoanFee;

    // check max discount accepted
    if (this.discount > voucher.maxValue) {
      this.discount = voucher.maxValue;
    }

    this.voucherApplied = {
      id: voucher.id,
      customerId: this.customerId,
      discountValue: this.discount,
      createdAt: voucher.createdAt,
    };

    this.isCorrectedVoucherApplied = true;
  }

  showError(title: string, content: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(title),
      content: this.multiLanguageService.instant(content),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }

  dec2time(decimalTimeString) {
    let decimalTime = parseFloat(decimalTimeString);
    decimalTime = decimalTime * 60 * 60;
    let hours = Math.floor(decimalTime / (60 * 60));
    decimalTime = decimalTime - hours * 60 * 60;
    let minutes = Math.floor(decimalTime / 60);
    decimalTime = decimalTime - minutes * 60;
    let seconds = Math.round(decimalTime);

    let strHours = String(hours);
    let strMinutes = String(minutes);
    let strSeconds = String(seconds);
    strMinutes;
    if (hours < 10) {
      strHours = '0' + strHours;
    }
    if (minutes < 10) {
      strMinutes = '0' + minutes;
    }
    if (seconds < 10) {
      strSeconds = '0' + strSeconds;
    }
    return strHours + ':' + strMinutes + ':' + strSeconds;
  }

  formatTime(timeInput) {
    if (!timeInput) return;
    return moment(new Date(timeInput), 'HH:mm:ss').format('HH:mm');
  }

  checkVoucherTime(voucher: Voucher): boolean {
    let d = new Date();
    for (const timeRange of voucher.activedTime) {
      timeRange.split('-');
      let start = moment(this.dec2time(timeRange[0]), 'HH:mm:ss').toDate();
      let end = moment(this.dec2time(timeRange[1]), 'HH:mm:ss').toDate();
      //check current time in range
      if (start.getHours() < d.getHours() && d.getHours() < end.getHours()) {
        return true;
      } else if (start.getHours() == d.getHours()) {
        if (d.getHours() == end.getHours()) {
          if (
            start.getMinutes() <= d.getMinutes() &&
            d.getMinutes() <= end.getMinutes()
          ) {
            return true;
          }
        } else if (start.getMinutes() <= d.getMinutes()) {
          return true;
        }
      } else if (d.getHours() == end.getHours()) {
        if (d.getMinutes() <= end.getMinutes()) {
          return true;
        }
      }
    }
    return false;
  }

  //Expected loan amount
  onValueChange(event) {
    this.loanDeteminationForm.controls.loanAmount.setValue(event.value);
  }

  //Maximum loan amount conditions
  getLoanMaxAmount() {
    const d = new Date();
    const currentDate = d.getDate();
    let maxAmountCalc = this.maxAmount;
    const salary = this.customerInfo.personalData.annualIncome;
    switch (currentDate) {
      case 15:
      case 16:
        maxAmountCalc = salary * 0.5;
        break;
      case 17:
      case 18:
        maxAmountCalc = salary * 0.575;
        break;
      case 19:
      case 20:
        maxAmountCalc = salary * 0.65;
        break;
      case 21:
      case 22:
        maxAmountCalc = salary * 0.725;
        break;
      default:
        maxAmountCalc = salary * 0.8;
        break;
    }

    //rounding max loan amount to 0.5 nearest
    maxAmountCalc /= 1000000;
    maxAmountCalc = Math.round(maxAmountCalc * 2) / 2;
    maxAmountCalc *= 1000000;
    this.maxAmount = maxAmountCalc;
  }

  clearVoucherInput() {
    this.loanDeteminationForm.controls.voucherCode.setValue('');
    this.voucherShowError = '';
  }

  openDialogIllustratingImage() {
    const dialogRef = this.dialog.open(IllustratingImgDialogComponent, {
      width: '332px',
      autoFocus: false,
      panelClass: 'custom-dialog-container',
    });
  }
}

