import { Component, Input, OnInit } from '@angular/core';
import {
  ApiResponseCustomerInfo,
  CustomerInfo,
} from '../../../../../../open-api-modules/dashboard-api-docs';
import { CustomerDetailService } from './customer-detail.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-detail-element',
  templateUrl: './customer-detail-element.component.html',
  styleUrls: ['./customer-detail-element.component.scss'],
})
export class CustomerDetailElementComponent implements OnInit {
  _customerId: string;
  @Input()
  get customerId(): string {
    return this._customerId;
  }

  set customerId(value: string) {
    this._customerId = value;
  }

  userInfo: CustomerInfo;
  subManager = new Subscription();

  constructor(private customerDetailService: CustomerDetailService) {}

  ngOnInit(): void {
    this._getCustomerInfoById(this.customerId);
  }

  private _getCustomerInfoById(customerId) {
    if (!customerId) return;
    this.subManager.add(
      this.customerDetailService
        .getById(customerId)
        .subscribe((data: ApiResponseCustomerInfo) => {
          this.userInfo = data?.result;
        })
    );
  }
}
