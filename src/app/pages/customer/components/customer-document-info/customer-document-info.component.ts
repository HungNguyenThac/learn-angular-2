import {Component, Input, OnInit} from '@angular/core';
import {CustomerInfo} from "../../../../../../open-api-modules/dashboard-api-docs";

@Component({
  selector: 'app-customer-document-info',
  templateUrl: './customer-document-info.component.html',
  styleUrls: ['./customer-document-info.component.scss'],
})
export class CustomerDocumentInfoComponent implements OnInit {
  @Input() customerInfo: CustomerInfo = {};
  @Input() customerId: string = '';

  constructor() {}

  ngOnInit(): void {}
}
