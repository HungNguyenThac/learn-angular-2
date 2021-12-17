import { Component, Input, OnInit } from '@angular/core';
import { DATA_CELL_TYPE } from '../../../../../core/common/enum/operator';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { NotificationService } from '../../../../../core/services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-merchant-qr',
  templateUrl: './merchant-qr.component.html',
  styleUrls: ['./merchant-qr.component.scss'],
})
export class MerchantQrComponent implements OnInit {
  @Input() merchantInfo;

  leftCompanyInfos: any[] = [];

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.leftCompanyInfos = this._initLeftCompanyInfos();
  }

  private _initLeftCompanyInfos() {
    return [
      {
        title: this.multiLanguageService.instant(
          'merchant.merchant_detail.name'
        ),
        value: this.merchantInfo.merchantName,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
      {
        title: this.multiLanguageService.instant('merchant.merchant_detail.id'),
        value: this.merchantInfo.merchantId,
        type: DATA_CELL_TYPE.TEXT,
        format: null,
      },
    ];
  }
}
