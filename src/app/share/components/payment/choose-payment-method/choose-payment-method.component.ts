import { Component, Input, OnInit } from '@angular/core';
import { MultiLanguageService } from '../../../translate/multiLanguageService';
import { PAYMENT_METHOD } from '../../../../core/common/enum/payment-method';
import { PaymentProductInfo } from '../../../../public/models/payment/payment-product-info.model';
import { PaymentUserInfo } from '../../../../public/models/payment/payment-user-info.model';
import { PaymentVirtualAccount } from '../../../../public/models/payment/payment-virtual-account.model';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-choose-payment-method',
  templateUrl: './choose-payment-method.component.html',
  styleUrls: ['./choose-payment-method.component.scss'],
})
export class ChoosePaymentMethodComponent implements OnInit {
  @Input() productInfo: PaymentProductInfo;
  @Input() userInfo: PaymentUserInfo;
  @Input() vaInfo: PaymentVirtualAccount;
  disabledCardPayment: boolean = false;
  showCopied: boolean = false;
  activeTab: PAYMENT_METHOD = PAYMENT_METHOD.TRANSFER;
  activeTabs: any = PAYMENT_METHOD;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  switchTab($event) {
    this.activeTab = $event;
  }

  displayConfirmModalEvent($event) {
    this.notificationService.openPrompt({
      imgUrl: 'assets/img/icon/group-3/svg/info.svg',
      imgBackgroundClass: 'notification-info-img',
      title: this.multiLanguageService.instant('common.notification'),
      content: this.multiLanguageService.instant(
        'payment.choose_payment_method.confirm_finalization_content',
        { minute: 10 }
      ),
      primaryBtnText: this.multiLanguageService.instant(
        'payment.guide_transfer.understand'
      ),
      secondaryBtnText: this.multiLanguageService.instant('common.close'),
    });
  }

  displayCopied($event) {
    this.showCopied = true;
    setTimeout(() => {
      this.showCopied = false;
    }, 3000);
  }
}
