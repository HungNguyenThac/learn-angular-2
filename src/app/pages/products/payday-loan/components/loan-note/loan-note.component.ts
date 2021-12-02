import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  ApiResponseString, PaydayLoanControllerService as PaydayLoanHmgControllerService,
  UpdateLoanRequest,
} from '../../../../../../../open-api-modules/loanapp-hmg-api-docs';
import {
  ApiResponseObject,
  PaydayLoanControllerService as PaydayLoanTngControllerService
} from '../../../../../../../open-api-modules/loanapp-api-docs';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MultiLanguageService} from "../../../../../share/translate/multiLanguageService";
import {MatDialog} from "@angular/material/dialog";
import {NotificationService} from "../../../../../core/services/notification.service";
import {ToastrService} from "ngx-toastr";
import {Subscription} from "rxjs";
import {PaydayLoanHmg} from "../../../../../../../open-api-modules/dashboard-api-docs";

@Component({
  selector: 'app-loan-note',
  templateUrl: './loan-note.component.html',
  styleUrls: ['./loan-note.component.scss'],
})
export class LoanNoteComponent implements OnInit {
  customerId: string = '';
  loanInfoForm: FormGroup;
  subManager = new Subscription();
  @Output() loanDetailDetectChangeStatus = new EventEmitter<any>();
  @Input() groupName: string;
  _loanId: string;
  @Input()
  get loanId(): string {
    return this._loanId;
  }

  set loanId(value: string) {
    this._loanId = value;
  }

  _loanDetail: PaydayLoanHmg;
  @Input()
  get loanDetail(): PaydayLoanHmg {
    return this._loanDetail;
  }

  set loanDetail(value: PaydayLoanHmg) {
    this._loanDetail = value;
    this._initLoanInfoData();
  }

  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog,
    private paydayLoanHmgControllerService: PaydayLoanHmgControllerService,
    private paydayLoanTngControllerService: PaydayLoanTngControllerService,
    private notificationService: NotificationService,
    private notifier: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.loanInfoForm = this.formBuilder.group({
      note: [''],
    });
  }

  ngOnInit(): void {
  }

  private _initLoanInfoData() {
    this.loanInfoForm.patchValue({
      note: this.loanDetail?.note,
    });
  }

  submitForm() {
    const updateLoanRequest: UpdateLoanRequest = {
      customerId: this.customerId,
      updateInfo: {},
    };
    updateLoanRequest.updateInfo['note'] =
      this.loanInfoForm.controls.note.value;
    console.log('updateLoanRequest', updateLoanRequest);

    if (this.groupName === 'HMG') {
      this.subManager.add(
        this.paydayLoanHmgControllerService
          .updateInfo(this.loanId, updateLoanRequest)
          .subscribe((res: ApiResponseString) => {
            if (res.responseCode !== 200) {
              this.notifier.error(res.errorCode);
              return;
            }
            this.loanDetailDetectChangeStatus.emit();
          })
      );
    }

    if (this.groupName === 'TNG') {
      this.subManager.add(
        this.paydayLoanTngControllerService
          .updateInfo(this.loanId, updateLoanRequest)
          .subscribe((res: ApiResponseObject) => {
            if (res.responseCode !== 200) {
              this.notifier.error(res.errorCode);
              return;
            }
            this.loanDetailDetectChangeStatus.emit();
          })
      );
    }
  }
}
