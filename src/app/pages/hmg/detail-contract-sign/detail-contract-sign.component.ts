import { Component, OnInit, ViewChild } from '@angular/core';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-detail-contract-sign',
  templateUrl: './detail-contract-sign.component.html',
  styleUrls: ['./detail-contract-sign.component.scss']
})
export class DetailContractSignComponent implements OnInit {
  detailContractFile = "../assets/img/hmg/hop-dong-test.pdf"
  @ViewChild(PdfViewerComponent, {static: false})
  private pdfComponent: PdfViewerComponent;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log("sign ok");
  }
}
