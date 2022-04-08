import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CustomerInfo,
  PaydayLoanHmg,
  PaydayLoanTng,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { BnplListService } from '../../bnpl-list/bnpl-list.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import {RESPONSE_CODE} from "../../../../../core/common/enum/operator";

@Component({
  selector: 'app-bnpl-element',
  templateUrl: './bnpl-element.component.html',
  styleUrls: ['./bnpl-element.component.scss'],
})
export class BnplElementComponent implements OnInit {
  @Input() loanDetail: any;
  @Input() userInfo: CustomerInfo;
  @Output() loanDetailTriggerUpdateStatus = new EventEmitter<any>();
  subManager = new Subscription();
  constructor(
    private multiLanguageService: MultiLanguageService,
    private bnplListService: BnplListService,
    private notifier: ToastrService
  ) {}

  ngOnInit(): void {}

  public triggerUpdateLoanInfo(params) {
    let requestBody = {};
    if (params.note) {
      requestBody['note'] = params.note;
    }
    this.subManager.add(
      this.bnplListService
        .updateBnplApplication(this.loanDetail?.id, requestBody)
        .subscribe((response) => {
          if (!response || response.responseCode !== RESPONSE_CODE.SUCCESS) {
            return this.notifier.error(
              JSON.stringify(response?.message),
              response?.errorCode
            );
          }
        })
    );
  }
}
