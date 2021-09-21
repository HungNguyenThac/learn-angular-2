import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
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
} from 'open-api-modules/loanapp-api-docs';
import {
  ApiResponseObject,
  DownloadFileRequest,
  FileControllerService,
} from 'open-api-modules/com-api-docs';
import formatSlug from 'src/app/core/utils/format-slug';
import { PAYDAY_LOAN_STATUS } from 'src/app/core/common/enum/payday-loan';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { PlVoucherListComponent } from '../../components/pl-voucher-list/pl-voucher-list.component';

@Component({
  selector: 'app-loan-determination',
  templateUrl: './loan-determination.component.html',
  styleUrls: ['./loan-determination.component.scss'],
})
export class LoanDeterminationComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  loanDeteminationForm: FormGroup;
  maxAmount: number = 13;
  minAmount: number = 0;
  step: number = 1;
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
  voucherApplyTime: any;

  customerInfo: CustomerInfoResponse;
  coreUserId: string;
  public customerId$: Observable<any>;
  customerId: string;
  public coreToken$: Observable<any>;
  coreToken: string;

  listVoucher: Array<Voucher>

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
  ) {
    this.loanDeteminationForm = fb.group({
      loanAmount: [''],
      loanPurpose: [''],
      collateralDocument: [''],
      voucherCode: [''],
    });

    this.customerId$ = store.select(fromStore.getCustomerIdState);
    this.coreToken$ = store.select(fromStore.getCoreTokenState);
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
      this.coreToken$.subscribe((coreToken) => {
        this.coreToken = coreToken;
        console.log('coreToken', coreToken);
      })
    );

    this.getVoucherList()
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
    this.loanDeteminationForm.controls['loanAmount'].setValue(
      this.minAmount + this.step
    );

    //get customer info
    this.subManager.add(
      this.infoControllerService
        .getInfo(this.customerId)
        .subscribe((result: ApiResponseCustomerInfoResponse) => {
          if (!result || result.responseCode !== 200) {
            this.notificationService.hideLoading();
            return this.showError(
              'common.error',
              'common.something_went_wrong'
            );
          }
          this.customerInfo = result.result;
          this.checkLoanExisted();
        })
    );
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }

  checkLoanExisted() {
    this.applicationControllerService
      .getActiveLoan(this.customerId, this.coreToken)
      .subscribe((result: ApiResponsePaydayLoan) => {
        // if (result.responseCode === 200) {
        //   this.notificationService.hideLoading();
        //   return this.router.navigate([
        //     'hmg/current-loan',
        //     formatSlug(
        //       result.result.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS
        //     ),
        //   ]);
        // }
        this.bindingCollateralDocument();
      });
  }

  bindingCollateralDocument() {
    if (this.customerInfo?.personalData.collateralDocument === null)
      return this.notificationService.hideLoading();

    const downloadFileRequest: DownloadFileRequest = {
      documentPath: this.customerInfo?.personalData.collateralDocument,
      customerId: this.customerId,
    };
    this.fileControllerService
      .downloadFile(downloadFileRequest)
      .subscribe((blob) => {
        this.notificationService.hideLoading();
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
    console.log('ok');
  }

  onSubmit() {
    if (!this.loanDeteminationForm.valid) return;
    console.log(this.loanDeteminationForm.getRawValue());
    this.notificationService.showLoading(null);
  //   VoucherTransaction { 
  //     id?: string;
  //     voucherId?: string;
  //     customerId?: string;
  //     loanId?: string;
  //     discountValue?: number;
  //     createdAt?: string;
  // }
    const createApplicationRequest: CreateApplicationRequest = {
      coreToken: this.coreToken,
      customerId: this.customerId,
      expectedAmount: this.loanDeteminationForm.controls.loanAmount.value,
      purpose: this.loanDeteminationForm.controls.loanPurpose.value,
      // voucherTransaction: "",
    };
    this.paydayLoanControllerService
      .createLoan(createApplicationRequest)
      .subscribe((result: ApiResponseApplyResponse) => {
        this.notificationService.hideLoading();
        if (!result || result.responseCode !== 200) {
          const message = this.multiLanguageService.instant(
            'payday_loan.error_code.' + result.errorCode.toLowerCase()
          );
          return this.showError('common.error', message);
        }

        return this.router.navigate([
          'hmg/current-loan',
          formatSlug(result.result.status || PAYDAY_LOAN_STATUS.UNKNOWN_STATUS),
        ]);
      });
  }

  getVoucherList() {
    this.subManager.add(
      this.promotionControllerService.createVoucher1().subscribe((result: ApiResponseListVoucher) => {
        if (!result && result.responseCode !== 200) {
          const message = this.multiLanguageService.instant(
            'payday_loan.error_code.' + result.errorCode.toLowerCase()
          );
          return this.showError('common.error', message);
        }
        console.log("result", result)
        this.listVoucher = result.result
      })
    )
  }

  openDialogVoucherList() {
    this.listVoucher = [
      {
          "id": "694e0ac1-4ca1-40af-827c-216a0371a1b5",
          "promotionEventId": "ba756283-8a14-4d73-8756-f909d09792e5",
          "code": "TNG50",
          "maxValue": 50000,
          "percentage": 0.5,
          "maxAmount": 500,
          "remainAmount": 460,
          "activedTime": [
              "6.5-8.5",
              "11.5-13.5",
              "18-21",
              "0-24"
          ],
          "description": "<ul><li>Chỉ được sử dụng cho số điện thoại v&agrave; CMND/CCCD đ&atilde; d&ugrave;ng để đăng k&yacute;.</li><li>Mỗi kh&aacute;ch h&agrave;ng chỉ được &aacute;p dụng 1 lần cho khoản ứng lương đầu ti&ecirc;n.</li><li>Gi&aacute; trị ưu đ&atilde;i tối đa 50.000đ D&agrave;nh cho 100 kh&aacute;ch h&agrave;ng &aacute;p dụng m&atilde; đầu ti&ecirc;n.</li><li>C&aacute;c khung giờ &aacute;p dụng: 6h30 - 8h30, 11h30 - 13h30, 18h - 21h</li><li>Thời hạn &aacute;p dụng: 19/07/2021 - 31/08/2021</li></ul>",
          "createdAt": "2021-07-15T23:46:51.985"
      }
  ]
    const dialogRef = this.dialog.open(PlVoucherListComponent,{
      width: "320px",
      autoFocus: false,
      data: this.listVoucher,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  showError(title: string, content: string) {
    return this.notificationService.openErrorModal({
      title: this.multiLanguageService.instant(title),
      content: this.multiLanguageService.instant(content),
      primaryBtnText: this.multiLanguageService.instant('common.confirm'),
    });
  }
}
