import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-loan-determination',
  templateUrl: './loan-determination.component.html',
  styleUrls: ['./loan-determination.component.scss']
})
export class LoanDeterminationComponent implements OnInit, AfterViewInit {
  loanDeteminationForm: FormGroup;
  maxAmount: number = 13;
  minAmount: number = 0;
  step: number = 1;
  loanPurpose = {
    fieldName: "Mục đích ứng lương",
    options: [
      "Chi phí sinh hoạt thiết yếu",
      "Chi phí y tế",
      "Chi phí bảo hiểm",
      "Chi phí giáo dục",
      "Chi phí phát sinh đột xuất",
      "Đầu tư",
      "Khác"
    ]
  }
  collateralImgSrc: string;
  constructor(
    private fb: FormBuilder
  ) {
    this.loanDeteminationForm = fb.group({
      loanAmount: [""],
      loanPurpose: [""],
      collateralDocument: [""],
    })
  }
  
  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.loanDeteminationForm.controls["loanAmount"].setValue(this.minAmount + this.step)
  }

  resultCollateral(result) {
    this.loanDeteminationForm.controls["collateralDocument"].setValue(result.file);
    this.collateralImgSrc = result.imgSrc;
    console.log("ok");
    
  }

  onSubmit() {
    console.log(this.loanDeteminationForm.getRawValue());
  }
}
