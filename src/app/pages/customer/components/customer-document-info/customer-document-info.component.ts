import { Component, Input, OnInit } from '@angular/core';
import { CustomerInfo } from '../../../../../../open-api-modules/dashboard-api-docs';
import { Subscription } from 'rxjs';
import { CustomerDetailService } from '../customer-detail-element/customer-detail.service';
import { DOCUMENT_TYPE } from '../../../../core/common/enum/payday-loan';
import { DOCUMENT_BTN_TYPE } from '../../../../core/common/enum/operator';

@Component({
  selector: 'app-customer-document-info',
  templateUrl: './customer-document-info.component.html',
  styleUrls: ['./customer-document-info.component.scss'],
})
export class CustomerDocumentInfoComponent implements OnInit {
  _customerInfo: CustomerInfo;
  @Input()
  get customerInfo(): CustomerInfo {
    return this._customerInfo;
  }

  set customerInfo(value: CustomerInfo) {
    this._getDocumentByPath(this.customerId, value);
    this._customerInfo = value;
  }

  _customerId: string;
  @Input()
  get customerId(): string {
    return this._customerId;
  }

  set customerId(value: string) {
    this._customerId = value;
  }

  subManager = new Subscription();
  selfieSrc: string;
  backIdSrc: string;
  backId2Src: string;
  frontIdSrc: string;
  frontId2Src: string;
  salary1Src: string;
  salary2Src: string;
  salary3Src: string;
  collateralSrc: string;

  constructor(private customerDetailService: CustomerDetailService) {}

  ngOnInit(): void {}

  private _getDocumentByPath(customerId: string, customerInfo: CustomerInfo) {
    if (!customerId || !customerInfo) {
      return;
    }

    if (customerInfo?.frontId) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.frontId,
        DOCUMENT_TYPE.FRONT_ID_CARD
      );
    }

    if (customerInfo?.backId) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.backId,
        DOCUMENT_TYPE.BACK_ID_CARD
      );
    }

    if (customerInfo?.frontIdTwo) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.frontIdTwo,
        DOCUMENT_TYPE.FRONT_ID_CARD_TWO
      );
    }

    if (customerInfo?.backId) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.backIdTwo,
        DOCUMENT_TYPE.BACK_ID_CARD_TWO
      );
    }

    if (customerInfo?.selfie) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.selfie,
        DOCUMENT_TYPE.SELFIE
      );
    }

    if (customerInfo?.salaryDocument1) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.salaryDocument1,
        DOCUMENT_TYPE.SALARY_INFORMATION_ONE
      );
    }

    if (customerInfo?.salaryDocument2) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.salaryDocument2,
        DOCUMENT_TYPE.SALARY_INFORMATION_TWO
      );
    }

    if (customerInfo?.salaryDocument3) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.salaryDocument3,
        DOCUMENT_TYPE.SALARY_INFORMATION_THREE
      );
    }

    if (customerInfo?.collateralDocument) {
      this._getSingleFileDocumentByPath(
        customerId,
        customerInfo?.collateralDocument,
        DOCUMENT_TYPE.VEHICLE_REGISTRATION
      );
    }
  }

  private _getSingleFileDocumentByPath(
    customerId: string,
    documentPath: string,
    documentType: DOCUMENT_TYPE
  ) {
    if (!customerId || !documentPath || !documentType) {
      return;
    }
    this.subManager.add(
      this.customerDetailService
        .downloadSingleFileDocument(customerId, documentPath)
        .subscribe((data) => {
          switch (documentType) {
            case DOCUMENT_TYPE.BACK_ID_CARD:
              this.backIdSrc = data;
              break;
            case DOCUMENT_TYPE.BACK_ID_CARD_TWO:
              this.backId2Src = data;
              break;
            case DOCUMENT_TYPE.FRONT_ID_CARD:
              this.frontIdSrc = data;
              break;
            case DOCUMENT_TYPE.FRONT_ID_CARD_TWO:
              this.frontId2Src = data;
              break;
            case DOCUMENT_TYPE.SELFIE:
              this.selfieSrc = data;
              break;
            case DOCUMENT_TYPE.SALARY_INFORMATION_ONE:
              this.salary1Src = data;
              break;
            case DOCUMENT_TYPE.SALARY_INFORMATION_TWO:
              this.salary2Src = data;
              break;
            case DOCUMENT_TYPE.SALARY_INFORMATION_THREE:
              this.salary3Src = data;
              break;
            case DOCUMENT_TYPE.VEHICLE_REGISTRATION:
              this.collateralSrc = data;
              break;
            default:
              break;
          }
        })
    );
  }

  private _downloadDocumentByPath(documentPath) {
    this.subManager.add(
      this.customerDetailService
        .downloadFileDocument(this.customerId, documentPath)
        .subscribe((data) => {})
    );
  }

  onChangeDocument(documentBtnType: DOCUMENT_BTN_TYPE, path) {
    switch (documentBtnType) {
      case DOCUMENT_BTN_TYPE.DOWNLOAD:
        this._downloadDocumentByPath(path);
        break;
      default:
        break;
    }
  }
}