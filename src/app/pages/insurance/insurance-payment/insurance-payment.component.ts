import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-insurance-payment',
  templateUrl: './insurance-payment.component.html',
  styleUrls: ['./insurance-payment.component.scss']
})
export class InsurancePaymentComponent implements OnInit {
  productInfo: any;
  userInfo: any;
  vaInfo: any;

  constructor() {
  }

  ngOnInit(): void {

  }

}
