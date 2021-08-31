import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MultiLanguageService} from "../../../translate/multiLanguageService";

@Component({
  selector: 'app-transfer-payment',
  templateUrl: './transfer-payment.component.html',
  styleUrls: ['./transfer-payment.component.scss']
})
export class TransferPaymentComponent implements OnInit {
  @Input() productInfo: any;
  @Input() userInfo: any;
  @Input() vaInfo: any;
  @Output() copiedEvent = new EventEmitter<string>();

  constructor() {
  }

  ngOnInit(): void {
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    this.copiedEvent.emit("displayCopied");
  }
}
