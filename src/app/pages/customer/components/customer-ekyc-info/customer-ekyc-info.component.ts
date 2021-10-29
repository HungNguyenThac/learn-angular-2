import { Component, Input, OnInit } from '@angular/core';
import {
  CompanyInfo,
  CustomerInfo,
} from '../../../../../../open-api-modules/dashboard-api-docs';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';
import { CustomerDetailService } from '../customer-detail-element/customer-detail.service';
import { Subscription } from 'rxjs';
import { DATA_CELL_TYPE } from '../../../../core/common/enum/operator';

@Component({
  selector: 'app-customer-ekyc-info',
  templateUrl: './customer-ekyc-info.component.html',
  styleUrls: ['./customer-ekyc-info.component.scss'],
})
export class CustomerEkycInfoComponent implements OnInit {
  _customerInfo: CustomerInfo;
  @Input()
  get customerInfo(): CustomerInfo {
    return this._customerInfo;
  }

  set customerInfo(value: CustomerInfo) {
    this._getEKYCDocument(this.customerId, value);
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

  subManager = new Subscription();
  backIdSrc: string;
  frontIdSrc: string;

  get rightEkycInfos() {
    return [
      {
        title: this.multiLanguageService.instant('customer.identity.id_number'),
        value: this.customerInfo.kalapaData?.idCardInfo?.id,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant('customer.identity.fullname'),
        value: this.customerInfo.kalapaData?.idCardInfo?.name,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.identity.date_of_birth'
        ),
        value: this.customerInfo.kalapaData?.idCardInfo?.dob,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.identity.phone_number'
        ),
        value: this.customerInfo.mobileNumber,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant('customer.identity.id_origin'),
        value: this.customerInfo.kalapaData?.idCardInfo?.home,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant('customer.identity.folk'),
        value: '',
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant('customer.identity.religion'),
        value: '',
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.identity.id_features'
        ),
        value: this.customerInfo.kalapaData?.idCardInfo?.features,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.identity.id_issue_date'
        ),
        value: this.customerInfo.kalapaData?.idCardInfo?.dateOfIssue,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.identity.id_issue_place'
        ),
        value: this.customerInfo.kalapaData?.idCardInfo?.placeOfIssue,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant(
          'customer.identity.received_date'
        ),
        value: this.customerInfo.kalapaData?.createdAt,
        type: DATA_CELL_TYPE.DATETIME,
        format: 'dd/MM/yyyy HH:mm',
      },
    ];
  }

  constructor(
    private multiLanguageService: MultiLanguageService,
    private customerDetailService: CustomerDetailService
  ) {}

  ngOnInit(): void {}

  private _getEKYCDocument(customerId, customerInfo) {
    if (customerInfo?.frontId) {
      this.subManager.add(
        this.customerDetailService
          .downloadSingleFileDocument(customerId, customerInfo?.frontId)
          .subscribe((data) => {
            this.frontIdSrc = data;
          })
      );
    }

    if (customerInfo?.backId) {
      this.subManager.add(
        this.customerDetailService
          .downloadSingleFileDocument(customerId, customerInfo?.backId)
          .subscribe((data) => {
            this.backIdSrc = data;
          })
      );
    }
  }

  downloadDocumentByPath(documentPath) {
    this.subManager.add(
      this.customerDetailService
        .downloadFileDocument(this.customerId, documentPath)
        .subscribe((data) => {})
    );
  }
}
