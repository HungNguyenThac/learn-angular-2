import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Voucher } from 'open-api-modules/loanapp-api-docs';

@Component({
  selector: 'app-pl-voucher-list',
  templateUrl: './pl-voucher-list.component.html',
  styleUrls: ['./pl-voucher-list.component.scss'],
})
export class PlVoucherListComponent implements OnInit {
  panelOpenState = false;
  voucherListArray: Array<Voucher>;
  @Input() vouchercode;

  constructor(
    public dialogRef: MatDialogRef<PlVoucherListComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    this.voucherListArray = data
  }

  ngOnInit(): void {}
}
