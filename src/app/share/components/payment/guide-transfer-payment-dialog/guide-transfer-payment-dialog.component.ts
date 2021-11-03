import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransferPaymentData } from '../../../../public/models/payment/transfer-payment-data.model';
import {GlobalConstants} from "../../../../core/common/global-constants";

@Component({
  selector: 'app-guide-transfer-payment-dialog',
  templateUrl: './guide-transfer-payment-dialog.component.html',
  styleUrls: ['./guide-transfer-payment-dialog.component.scss'],
})
export class GuideTransferPaymentDialogComponent implements OnInit {
  transferPaymentData: TransferPaymentData;

  copiedAccountNumber: boolean = false;
  copiedAmount: boolean = false;

  get amountToBePaid() {
    return (
      this.transferPaymentData?.productInfo?.expectedAmount +
      this.transferPaymentData?.productInfo?.latePenaltyPayment -
      this.transferPaymentData?.vaInfo?.paidAmount +
      GlobalConstants.PL_VALUE_DEFAULT.FIXED_REPAYMENT_VA_FEE
    );
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: TransferPaymentData,
    private dialogRef: MatDialogRef<GuideTransferPaymentDialogComponent>
  ) {
    dialogRef.disableClose = true;
    if (data) {
      this.transferPaymentData = data;
    }
  }

  ngOnInit(): void {}

  closeModal() {
    this.dialogRef.close('closeModal');
  }

  copyToClipboardAccountNumber(text) {
    this.copyToClipboard(text ? text.trim().replace('-', '') : '');
    this.copiedAccountNumber = true;
    this.copiedAmount = false;
  }

  copyToClipboardAmount(number) {
    this.copyToClipboard(number);
    this.copiedAmount = true;
    this.copiedAccountNumber = false;
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }
}
