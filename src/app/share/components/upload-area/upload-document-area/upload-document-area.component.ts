import {Component, Input, OnInit} from '@angular/core';
import {DOCUMENT_BTN_TYPE} from "../../../../core/common/enum/operator";

@Component({
  selector: 'app-upload-document-area',
  templateUrl: './upload-document-area.component.html',
  styleUrls: ['./upload-document-area.component.scss']
})
export class UploadDocumentAreaComponent implements OnInit {
  @Input() title: string;
  @Input() imgSrc: string;
  @Input() hiddenUploadBtn: boolean = false;
  @Input() hiddenDownloadBtn: boolean = false;
  @Input() hiddenDeleteBtn: boolean = false;

  documentBtnTypes = DOCUMENT_BTN_TYPE;

  constructor() { }

  ngOnInit(): void {
  }

  changeDocument(documentType) {
    console.log("changeDocument", documentType)
  }

}
