import { Component, OnInit, ViewChild } from '@angular/core';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-approval-letter-sign',
  templateUrl: './approval-letter-sign.component.html',
  styleUrls: ['./approval-letter-sign.component.scss']
})
export class ApprovalLetterSignComponent implements OnInit {
  approvalLetterFile = "../assets/img/hmg/hop-dong-test.pdf"
  @ViewChild(PdfViewerComponent, {static: false})
  private pdfComponent: PdfViewerComponent;
  
  constructor() { }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log("sign ok");
  }
}
