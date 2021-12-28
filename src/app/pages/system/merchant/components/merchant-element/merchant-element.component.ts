import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ApiResponseAdminAccountEntity,
  ApiResponseMerchant,
  MerchantControllerService,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RESPONSE_CODE } from '../../../../../core/common/enum/operator';

@Component({
  selector: 'app-merchant-element',
  templateUrl: './merchant-element.component.html',
  styleUrls: ['./merchant-element.component.scss'],
})
export class MerchantElementComponent implements OnInit {
  private _merchantId;
  merchantInfo;
  subManager = new Subscription();

  @Input()
  get merchantId(): string {
    return this._merchantId;
  }

  set merchantId(value: string) {
    this._merchantId = value;
  }

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private notifier: ToastrService,
    private merchantControllerService: MerchantControllerService
  ) {}

  ngOnInit(): void {
    this._getMerchantInfoById(this.merchantId);
  }

  private _getMerchantInfoById(merchantId) {
    if (!merchantId) return;
    this.subManager.add(
      this.merchantControllerService
        .getMerchantById(this.merchantId)
        .subscribe((data: ApiResponseMerchant) => {
          if (!data || data.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(JSON.stringify(data?.message), data?.errorCode);
            return;
          }
          if (data.responseCode === 200) {
            this.merchantInfo = data?.result;
          }
        })
    );
  }
}
