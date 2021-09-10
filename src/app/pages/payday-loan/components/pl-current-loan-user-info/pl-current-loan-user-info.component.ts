import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'pl-current-loan-user-info',
  templateUrl: './pl-current-loan-user-info.component.html',
  styleUrls: ['./pl-current-loan-user-info.component.scss']
})
export class PlCurrentLoanUserInfoComponent implements OnInit {
  @Input() userInfo: any;
  constructor() { }

  ngOnInit(): void {
  }

}
