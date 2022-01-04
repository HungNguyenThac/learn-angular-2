import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import {
  AdminControllerService,
  ApiResponseString,
} from '../../../../../../../open-api-modules/merchant-api-docs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-merchant-element',
  templateUrl: './merchant-element.component.html',
  styleUrls: ['./merchant-element.component.scss'],
})
export class MerchantElementComponent implements OnInit {
  private _merchantId;
  merchantInfo;
  merchantQr;
  subManager = new Subscription();

  @Input()
  get merchantId(): string {
    return this._merchantId;
  }

  set merchantId(value: string) {
    this._merchantId = value;
  }

  @Output() triggerUpdateElementInfo = new EventEmitter();

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private notifier: ToastrService,
    private merchantControllerService: MerchantControllerService,
    private adminControllerService: AdminControllerService,
    private _sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this._getMerchantInfoById(this.merchantId);
    this.generateQrCode(this.merchantId);
  }

  public generateQrCode(merchantId) {
    if (!merchantId) return;
    this.subManager.add(
      this.adminControllerService
        .v1AdminMerchantsQrcodePost({ id: this.merchantId })
        .subscribe((data: ApiResponseString) => {
          if (!data || data.responseCode !== RESPONSE_CODE.SUCCESS) {
            this.notifier.error(JSON.stringify(data?.message), data?.errorCode);
            return;
          }
          if (data.responseCode === 200) {
            this.merchantQr = data.result;
          }
        })
    );
  }

  public refreshContent() {
    setTimeout(() => {
      this.generateQrCode(this.merchantId);
      this._getMerchantInfoById(this.merchantId);
    }, 2000);
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
            this.triggerUpdateElementInfo.emit(this.merchantInfo);
          }
        })
    );
  }

  private updateMerchantInfo(updateInfoRequest) {
    this.subManager.add(
      this.adminControllerService
        .v1AdminMerchantsIdPut(this.merchantId, updateInfoRequest)
        .subscribe((data) => {
          if (!data || data.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(data?.message),
              data?.errorCode
            );
          }
          if (data.responseCode === 200) {
            this.refreshContent();
            setTimeout(() => {
              this.notifier.success(
                this.multiLanguageService.instant('common.update_success')
              );
            }, 500);
          }
        })
    );
  }

  updateElementInfo(updateInfoRequest) {
    if (!updateInfoRequest) {
      this.refreshContent();
    } else if (updateInfoRequest === 'delete') {
      this.triggerUpdateElementInfo.emit();
    } else {
      this.updateMerchantInfo(updateInfoRequest);
    }
  }
}
