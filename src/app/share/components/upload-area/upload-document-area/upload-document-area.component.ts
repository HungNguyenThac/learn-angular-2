import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DOCUMENT_BTN_TYPE } from '../../../../core/common/enum/operator';
import { UpdatedDocumentModel } from '../../../../public/models/updated-document.model';

@Component({
  selector: 'app-upload-document-area',
  templateUrl: './upload-document-area.component.html',
  styleUrls: ['./upload-document-area.component.scss'],
})
export class UploadDocumentAreaComponent implements OnInit {
  @Input() id: string;
  @Input() title: string;
  @Input() imgSrc: string;
  @Input() hiddenUploadBtn: boolean = false;
  @Input() hiddenDownloadBtn: boolean = false;
  @Input() acceptFileType: string = 'image/*';
  @Input() hiddenDeleteBtn: boolean = false;

  @Output() onChangeDocument = new EventEmitter<UpdatedDocumentModel>();

  documentBtnTypes = DOCUMENT_BTN_TYPE;

  currentDocumentBtnType: DOCUMENT_BTN_TYPE;

  constructor() {}

  ngOnInit(): void {}

  changeDocument(documentType: DOCUMENT_BTN_TYPE) {
    switch (documentType) {
      case DOCUMENT_BTN_TYPE.UPDATE:
      case DOCUMENT_BTN_TYPE.UPLOAD:
        this.currentDocumentBtnType = documentType;
        this.triggerClickUploadImg();
        break;
      case DOCUMENT_BTN_TYPE.DOWNLOAD:
      case DOCUMENT_BTN_TYPE.DELETE:
        this.onChangeDocument.emit({
          type: documentType,
        });
        break;
      default:
        break;
    }
  }

  triggerClickUploadImg(): void {
    let manualUploadInput: HTMLElement = document.getElementById(
      `manual-upload-input-${this.id}`
    ) as HTMLElement;
    if (!manualUploadInput) return;
    manualUploadInput.click();
  }

  triggerClickResetInput(): void {
    let resetInput: HTMLElement = document.getElementById(
      `reset-manual-upload-input-${this.id}`
    ) as HTMLElement;
    if (!resetInput) return;
    resetInput.click();
  }

  onFileChange(e): void {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    this.createImage(files[0]);
  }

  createImage(file): void {
    if (!(file instanceof File)) {
      return null;
    }
    let reader = new FileReader();
    reader.onload = (e) => {
      this.onChangeDocument.emit({
        type: this.currentDocumentBtnType,
        imgSrc: e.target.result,
        file: file,
      });
    };
    reader.readAsDataURL(file);
  }
}
