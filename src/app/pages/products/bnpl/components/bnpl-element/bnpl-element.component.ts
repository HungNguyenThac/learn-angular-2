import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfo, PaydayLoanHmg, PaydayLoanTng} from "../../../../../../../open-api-modules/dashboard-api-docs";

@Component({
  selector: 'app-bnpl-element',
  templateUrl: './bnpl-element.component.html',
  styleUrls: ['./bnpl-element.component.scss']
})
export class BnplElementComponent implements OnInit {

  _loanId: string;

  @Input()
  get loanId(): string {
    return this._loanId;
  }

  set loanId(value: string) {
    this._loanId = value;
  }


  @Input() loanDetail: any;
  @Input() userInfo: CustomerInfo;
  @Output() loanDetailTriggerUpdateStatus = new EventEmitter<any>();
  @Output() detectUpdateLoanAfterSign = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

}
