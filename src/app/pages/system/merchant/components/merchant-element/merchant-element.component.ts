import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-merchant-element',
  templateUrl: './merchant-element.component.html',
  styleUrls: ['./merchant-element.component.scss'],
})
export class MerchantElementComponent implements OnInit {
  @Input() merchantInfo;
  @Input() merchantVerify;

  constructor() {}

  ngOnInit(): void {}
}
