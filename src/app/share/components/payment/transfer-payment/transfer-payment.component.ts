import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { PaymentVirtualAccount } from '../../../../public/models/payment-virtual-account.model';
import { PaymentUserInfo } from '../../../../public/models/payment-user-info.model';
import { PaymentProductInfo } from '../../../../public/models/payment-product-info.model';
import { MatDialog } from '@angular/material/dialog';
import { GuideTransferPaymentDialogComponent } from '../guide-transfer-payment-dialog/guide-transfer-payment-dialog.component';
import { Subscription } from 'rxjs';
import { GlobalConstants } from '../../../../core/common/global-constants';

@Component({
  selector: 'app-transfer-payment',
  templateUrl: './transfer-payment.component.html',
  styleUrls: ['./transfer-payment.component.scss'],
})
export class TransferPaymentComponent implements OnInit, OnDestroy {
  @Input() productInfo: PaymentProductInfo;
  @Input() userInfo: PaymentUserInfo;
  @Input() vaInfo: PaymentVirtualAccount;
  @Output() copiedEvent = new EventEmitter<string>();

  get amountToBePaid() {
    return (
      this.productInfo.expectedAmount +
      this.productInfo.latePenaltyPayment -
      this.vaInfo.paidAmount +
      GlobalConstants.PL_VALUE_DEFAULT.FIXED_REPAYMENT_VA_FEE
    );
  }

  subManager = new Subscription();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  copyToClipboard(text) {
    navigator.clipboard.writeText(text ? text.trim().replace('-', '') : '');
    this.copiedEvent.emit('displayCopied');
  }

  copyToClipboardNumber(number) {
    navigator.clipboard.writeText(number);
    this.copiedEvent.emit('displayCopied');
  }

  displayGuideDialog() {
    const dialogRef = this.dialog.open(GuideTransferPaymentDialogComponent, {
      panelClass: 'custom-dialog-container',
      height: 'auto',
      minHeight: '194px',
      maxWidth: '360px',
      data: {
        productInfo: this.productInfo,
        userInfo: this.userInfo,
        vaInfo: this.vaInfo,
      },
    });

    this.subManager.add(
      dialogRef.afterClosed().subscribe((confirmed: boolean) => {
        console.log(confirmed);
      })
    );
  }

  ngOnDestroy(): void {
    this.subManager.unsubscribe();
  }
}
