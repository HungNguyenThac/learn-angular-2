import { MultiLanguageService } from './../../../../share/translate/multiLanguageService';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dialog-company-info-update',
  templateUrl: './dialog-company-info-update.component.html',
  styleUrls: ['./dialog-company-info-update.component.scss'],
})
export class DialogCompanyInfoUpdateComponent implements OnInit {
  companyInfoForm: FormGroup;
  bankNameOptions = {
    fieldName: 'Ngân hàng',
    options: [
      'Ngân hàng Việt Nam Thịnh Vượng (VPBank)',
      'Ngân hàng Công thương Việt Nam (VietinBank)',
      'Ngân hàng Đầu tư và Phát triển Việt Nam (BIDV)',
      'Ngân hàng Ngoại Thương Việt Nam (Vietcombank)',
    ],
  };
  constructor(
    private dialogRef: MatDialogRef<DialogCompanyInfoUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private multiLanguageService: MultiLanguageService,
    private formBuilder: FormBuilder
  ) {
    //Build form
    const companyInfoControlsConfig = {
      companyName: [''],
      employeeCode: [''],
      lastName: [''],
      firstName: [''],
      officeCode: [''],
      officeName: [''],
      annualIncome: [''],
      workingDays: [''],
      accountNumber: [''],
      bankCode: [''],
    };
    this.companyInfoForm = this.formBuilder.group(companyInfoControlsConfig);
  }

  ngOnInit(): void {}

  submit() {
    console.log('form info', this.companyInfoForm.getRawValue());
    this.dialogRef.close();
  }
}
