import { MatDialog } from '@angular/material/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { CustomerInfo } from '../../../../../../open-api-modules/dashboard-api-docs';
import { CustomerDetailUpdateDialogComponent } from '../customer-individual-info-update-dialog/customer-detail-update-dialog.component';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomerDetailService } from '../customer-detail-element/customer-detail.service';
import { DATA_CELL_TYPE } from '../../../../core/common/enum/operator';

@Component({
  selector: 'app-customer-individual-info',
  templateUrl: './customer-individual-info.component.html',
  styleUrls: ['./customer-individual-info.component.scss'],
})
export class CustomerIndividualInfoComponent implements OnInit, OnDestroy {
  _customerInfo: CustomerInfo;
  @Input()
  get customerInfo(): CustomerInfo {
    return this._customerInfo;
  }

  set customerInfo(value: CustomerInfo) {
    this._getSelfieDocument(this.customerId, value);
    this._customerInfo = value;
  }

  _customerId: string;
  @Input()
  get customerId(): string {
    return this._customerId;
  }

  set customerId(value: string) {
    this._customerId = value;
  }

  get leftIndividualInfos() {
    return [
      {
        title: this.multiLanguageService.instant('customer.individual_info.id'),
        value: this.customerId,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.fullname'
        ),
        value: this.customerInfo?.firstName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.phone_number'
        ),
        value: this.customerInfo?.mobileNumber,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.date_of_birth'
        ),
        value: this.customerInfo?.dateOfBirth,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.email'
        ),
        value: this.customerInfo?.emailAddress,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.cmnd'
        ),
        value: this.customerInfo?.identityNumberOne,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.permanent_address'
        ),
        value: this.customerInfo?.addressTwoLine1,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.current_residence'
        ),
        value: this.customerInfo?.addressOneLine1,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.id_origin'
        ),
        value: this.customerInfo?.idOrigin,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }

  get rightIndividualInfos() {
    return [
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.number_of_dependents'
        ),
        value: this.customerInfo?.borrowerDetailTextVariable1,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.marital_status'
        ),
        value: this.customerInfo?.maritalStatus,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.bank_account_number'
        ),
        value: this.customerInfo?.accountNumber,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.bank_name'
        ),
        value: `${this.customerInfo?.bankName} ( ${this.customerInfo?.bankCode} )`,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.va_account_number'
        ),
        value: null,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.created_at'
        ),
        value: this.customerInfo?.createdAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
      {
        title: this.multiLanguageService.instant(
          'customer.individual_info.updated_at'
        ),
        value: this.customerInfo?.updatedAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
      // {
      //   title: this.multiLanguageService.instant(
      //     'customer.individual_info.updated_by'
      //   ),
      //   value: this.customerInfo?.updatedBy,
      // },
    ];
  }

  subManager = new Subscription();
  selfieSrc: string;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog,
    private customerDetailService: CustomerDetailService
  ) {}

  ngOnInit(): void {}

  openUpdateDialog() {
    const dialogRef = this.dialog.open(CustomerDetailUpdateDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '1200px',
      width: '90%',
      data: this.customerInfo,
    });
  }

  private _getSelfieDocument(customerId, customerInfo) {
    if (!customerInfo?.selfie) {
      return;
    }
    this.subManager.add(
      this.customerDetailService
        .downloadSingleFileDocument(customerId, customerInfo?.selfie)
        .subscribe((data) => {
          this.selfieSrc = data;
        })
    );
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
