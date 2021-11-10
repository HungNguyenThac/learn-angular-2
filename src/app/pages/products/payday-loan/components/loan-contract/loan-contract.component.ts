import {MultiLanguageService} from 'src/app/share/translate/multiLanguageService';
import {DomSanitizer} from '@angular/platform-browser';
import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {PaydayLoan} from 'open-api-modules/loanapp-api-docs';
import {
  DATA_CELL_TYPE,
  DATA_STATUS_TYPE,
} from 'src/app/core/common/enum/operator';
import {LoanListService} from '../../loan-list/loan-list.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-loan-contract',
  templateUrl: './loan-contract.component.html',
  styleUrls: ['./loan-contract.component.scss'],
})
export class LoanContractComponent implements OnInit {
  loanContractView: any;
  loanContractData: any;
  loanContractFile: any;
  enableSign: boolean = false;
  displayStatus;
  downloadable: boolean = false;

  subManager = new Subscription();

  constructor(
    private notifier: ToastrService,
    private dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private multiLanguageService: MultiLanguageService,
    private LoanListService: LoanListService
  ) {
  }

  _loanId: string;

  @Input()
  get loanId(): string {
    return this._loanId;
  }

  set loanId(value: string) {
    this._loanId = value;
  }

  _loanDetail: PaydayLoan;

  @Input()
  get loanDetail(): PaydayLoan {
    return this._loanDetail;
  }

  set loanDetail(value: PaydayLoan) {
    this._loanDetail = value;
    this.getDisplayStatus();
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
    if (this.loanDetail.status === 'CONTRACT_AWAITING') {
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
        console.log(result);
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

  private _getLoanContractData() {
    this.subManager.add(
      this.LoanListService.getContractData(
        this.loanDetail.id,
        this.loanDetail.customerId
      ).subscribe((response) => {
        if (response.result === null) {
          return (this.loanContractData = 'no-contract');
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
