import { Contract } from './../../../../../../../open-api-modules/loanapp-api-docs/model/contract';
import { ApiResponseContract } from './../../../../../../../open-api-modules/loanapp-api-docs/model/apiResponseContract';
import {
  CustomerInfo,
  PaydayLoanHmg,
} from 'open-api-modules/dashboard-api-docs';
import { MultiLanguageService } from 'src/app/share/translate/multiLanguageService';
import { DomSanitizer } from '@angular/platform-browser';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { PaydayLoan } from 'open-api-modules/loanapp-api-docs';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from 'src/app/core/common/enum/operator';
import { LoanListService } from '../../loan-list/loan-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loan-contract',
  templateUrl: './loan-contract.component.html',
  styleUrls: ['./loan-contract.component.scss'],
})
export class LoanContractComponent implements OnInit, OnDestroy {
  loanContractView: any;
  loanContractData: Contract;
  loanContractFile: any;
  enableSign: boolean = false;
  displayStatus;
  downloadable: boolean = false;

  subManager = new Subscription();
  @Output() triggerUpdateLoanAfterSign = new EventEmitter();

  constructor(
    private notifier: ToastrService,
    private dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private multiLanguageService: MultiLanguageService,
    private LoanListService: LoanListService
  ) {}

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
    this.getDisplayStatus();
    this.checkSignable()
  }

  _customerInfo: CustomerInfo;
  @Input()
  get customerInfo(): CustomerInfo {
    return this._customerInfo;
  }

  set customerInfo(value: CustomerInfo) {
    this._customerInfo = value;
  }

  ngOnInit(): void {
    this._getLoanContractData();
  }

  getDisplayStatus() {
    this.displayStatus = {
      title: this.multiLanguageService.instant(
        'loan_app.loan_info.loan_status'
      ),
      value: this.loanDetail?.status,
      type: DATA_CELL_TYPE.STATUS,
      format: DATA_STATUS_TYPE.PL_HMG_STATUS,
    };
    return this.displayStatus;
  }

  checkSignable() {

    if (
      this.customerInfo.companyGroupName === 'HMG' &&
      this.loanDetail.status === 'CONTRACT_AWAITING'
    ) {
      this.enableSign = true;
    }

    if (
      this.customerInfo.companyGroupName === 'TNG' &&
      this.loanDetail.status === 'FUNDED' &&
      this.loanContractData.status === 'AWAITING_EPAY_SIGNATURE'
    ) {
      this.enableSign = true;
    }
  }

  onClickSign() {
    const customerId = this.loanDetail.customerId;
    const idRequest = this.loanContractData.idRequest;
    const idDocument = this.loanContractData.idDocument;

    this.subManager.add(
      this.LoanListService.signContract(
        customerId,
        idRequest,
        idDocument
      ).subscribe((result) => {
        if (result?.errorCode === null) {
          this.notifier.success(`Ký hợp đồng thành công`);
          setTimeout(() => {
            this.triggerUpdateLoanAfterSign.emit();
          }, 2000);
        } else {
          this.notifier.error(
            this.multiLanguageService.instant('loan_app.loan_contract.sign_fail')
          );
        }
      })
    );
  }

  downloadFileContract(documentPath, customerId) {
    this.subManager.add(
      this.LoanListService.downloadSingleFileContract(
        documentPath,
        customerId
      ).subscribe((data) => {
        this.loanContractFile = data;
        this.pdfView(this.loanContractFile);
      })
    );
  }

  onClickDownload() {
    this.LoanListService.downloadBlobFile(this.loanContractFile);
    this.notifier.info(
      this.multiLanguageService.instant('loan_app.loan_contract.downloading')
    );
  }

  pdfView(pdfurl: string) {
    pdfurl += '#toolbar=0&navpanes=0&scrollbar=0&zoom=90';
    this.loanContractView = this.domSanitizer.bypassSecurityTrustHtml(
      "<iframe  src='" +
        pdfurl +
        "' type='application/pdf' style='width:100%; height: 70vh; background-color:white;'>" +
        'Object ' +
        pdfurl +
        ' failed' +
        '</iframe>'
    );
  }

  ngOnDestroy() {
    this.subManager.unsubscribe();
  }

  private _getLoanContractData() {
    this.subManager.add(
      this.LoanListService.getContractData(
        this.loanDetail.id,
        this.loanDetail.customerId,
        this.loanDetail.companyGroupName,
      ).subscribe((response: ApiResponseContract) => {
        if (response.result === null) {
          return (this.loanContractData = null);
        }
        this.downloadable = true;
        this.loanContractData = response.result;
        this.downloadFileContract(
          this.loanContractData.path,
          this.loanDetail.customerId
        );
        this.checkSignable();
      })
    );
  }
}
