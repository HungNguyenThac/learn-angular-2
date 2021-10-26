import { Component, OnInit } from '@angular/core';
import {
  CompanyInfo,
  CustomerInfo,
} from '../../../../../../open-api-modules/dashboard-api-docs';
import { MultiLanguageService } from '../../../../share/translate/multiLanguageService';

@Component({
  selector: 'app-customer-ekyc-info',
  templateUrl: './customer-ekyc-info.component.html',
  styleUrls: ['./customer-ekyc-info.component.scss'],
})
export class CustomerEkycInfoComponent implements OnInit {
  customerInfo: CustomerInfo = {};

  rightEkycInfos: any = [
    {
      title: this.multiLanguageService.instant('customer.identity.id_number'),
      value: this.customerInfo.kalapaData?.idCardInfo?.id,
    },
    {
      title: this.multiLanguageService.instant('customer.identity.fullname'),
      value: this.customerInfo.kalapaData?.idCardInfo?.name,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.identity.date_of_birth'
      ),
      value: this.customerInfo.kalapaData?.idCardInfo?.dob,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.identity.phone_number'
      ),
      value: this.customerInfo.mobileNumber,
    },
    {
      title: this.multiLanguageService.instant('customer.identity.id_origin'),
      value: this.customerInfo.kalapaData?.idCardInfo?.home,
    },
    {
      title: this.multiLanguageService.instant('customer.identity.folk'),
      value: '',
    },
    {
      title: this.multiLanguageService.instant('customer.identity.religion'),
      value: '',
    },
    {
      title: this.multiLanguageService.instant('customer.identity.id_features'),
      value: this.customerInfo.kalapaData?.idCardInfo?.features,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.identity.id_issue_date'
      ),
      value: this.customerInfo.kalapaData?.idCardInfo?.dateOfIssue,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.identity.id_issue_place'
      ),
      value: this.customerInfo.kalapaData?.idCardInfo?.placeOfIssue,
    },
    {
      title: this.multiLanguageService.instant(
        'customer.identity.received_date'
      ),
      value: this.customerInfo.kalapaData?.createdAt,
    },
  ];

  constructor(private multiLanguageService: MultiLanguageService) {}

  ngOnInit(): void {}
}
