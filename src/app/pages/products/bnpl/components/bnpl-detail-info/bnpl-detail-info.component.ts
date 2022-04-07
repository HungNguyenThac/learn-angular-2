import {Component, Input, OnInit} from '@angular/core';
import {CustomerInfo} from "../../../../../../../open-api-modules/dashboard-api-docs";

@Component({
  selector: 'app-bnpl-detail-info',
  templateUrl: './bnpl-detail-info.component.html',
  styleUrls: ['./bnpl-detail-info.component.scss']
})
export class BnplDetailInfoComponent implements OnInit {
  @Input() loanDetail: any;
  @Input() userInfo: CustomerInfo;
  constructor() { }

  ngOnInit(): void {
  }

}
