import {Component, Input, OnInit} from '@angular/core';
import {GlobalConstants} from "../../../../core/common/global-constants";
import {MultiLanguageService} from "../../../translate/multiLanguageService";

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
  activeTab: string = GlobalConstants.PAYMENT_METHOD.TRANSFER;
  activeTabs: any = GlobalConstants.PAYMENT_METHOD;

  constructor(private multiLanguageService: MultiLanguageService) {
    this.multiLanguageService.onSetupMultiLanguage("payment")
  }


  ngOnInit(): void {
  }

  switchTab($event) {
    console.log($event)
    console.log(this.multiLanguageService.instant('payment.choose_payment_method.card_payment_napas'));
  }

  displayConfirmModalEvent($event) {
    console.log($event)
  }

  displayCopied($event) {
    console.log($event)
  }


}
