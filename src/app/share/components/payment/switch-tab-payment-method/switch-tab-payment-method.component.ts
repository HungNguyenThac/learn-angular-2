import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GlobalConstants} from "../../../../core/common/global-constants";
import {MultiLanguageService} from "../../../translate/multiLanguageService";

@Component({
  selector: 'app-switch-tab-payment-method',
  templateUrl: './switch-tab-payment-method.component.html',
  styleUrls: ['./switch-tab-payment-method.component.scss']
})
export class SwitchTabPaymentMethodComponent implements OnInit {
  @Input() activeTab: string = GlobalConstants.PAYMENT_METHOD.TRANSFER;
  @Output() switchTabEvent = new EventEmitter<string>();

  activeTabs: any = GlobalConstants.PAYMENT_METHOD;

  constructor() {
  }

  ngOnInit(): void {
  }

  switchTab(activeTab) {
    this.switchTabEvent.emit(activeTab);
  }

}
