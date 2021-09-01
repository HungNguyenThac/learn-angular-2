import {Component, Input, OnInit} from '@angular/core';
import {MultiLanguageService} from "../../../translate/multiLanguageService";
import {PAYMENT_METHOD} from "../../../../core/common/enum/payment-method";

@Component({
  selector: 'app-choose-payment-method',
  templateUrl: './choose-payment-method.component.html',
  styleUrls: ['./choose-payment-method.component.scss']
})
export class ChoosePaymentMethodComponent implements OnInit {
  @Input() productInfo: any;
  @Input() userInfo: any;
  @Input() vaInfo: any;
  disabledCardPayment: boolean = false;
  showCopied: boolean = false;
  activeTab: PAYMENT_METHOD = PAYMENT_METHOD.TRANSFER;
  activeTabs: any = PAYMENT_METHOD;

  constructor(private multiLanguageService: MultiLanguageService) {
    this.multiLanguageService.onSetupMultiLanguage("payment")
  }


  ngOnInit(): void {
  }

  switchTab($event) {
    this.activeTab = $event
    console.log(this.multiLanguageService.instant('payment.choose_payment_method.card_payment_napas'));
  }

  displayConfirmModalEvent($event) {
    console.log($event)
  }

  displayCopied($event) {
    this.showCopied = true;
    setTimeout(() => {
      this.showCopied = false;
    }, 3000);
  }


}
