import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaymentProductInfo } from '../../../../public/models/payment-product-info.model';
import { GlobalConstants } from '../../../../core/common/global-constants';
import { PaymentUserInfo } from '../../../../public/models/payment-user-info.model';

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.component.html',
  styleUrls: ['./card-payment.component.scss'],
})
export class CardPaymentComponent implements OnInit {
  @Input() productInfo: PaymentProductInfo;
  @Input() userInfo: PaymentUserInfo;
  @Input() disabledCardPayment: boolean = false;
  @Output() displayConfirmModalEvent = new EventEmitter<string>();

  get amountToBePaid() {
    return (
      this.productInfo.expectedAmount +
      (this.productInfo.expectedAmount *
        GlobalConstants.PL_VALUE_DEFAULT.FIXED_REPAYMENT_GPAY_DYNAMIC) /
        100 +
      GlobalConstants.PL_VALUE_DEFAULT.FIXED_REPAYMENT_GPAY_FEE
    );
  }

  disabledBtn: boolean = false;
  countdownTime: number = 0;

  constructor() {}

  ngOnInit(): void {}

  finalization() {
    this.displayConfirmModalEvent.emit("finalization")
  }
}
