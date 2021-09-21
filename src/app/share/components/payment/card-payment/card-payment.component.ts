import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MultiLanguageService} from "../../../translate/multiLanguageService";

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.component.html',
  styleUrls: ['./card-payment.component.scss']
})
export class CardPaymentComponent implements OnInit {
  @Input() productInfo: any;
  @Input() userInfo: any;
  @Input() disabledCardPayment: boolean = false;
  @Output() displayConfirmModalEvent = new EventEmitter<string>();

  disabledBtn: boolean = false;
  countdownTime: number = 0;
  amountToBePaid: number = 100000;

  constructor() {
  }

  ngOnInit(): void {
  }

  finalization() {

    console.log('finalization')
  }
}
