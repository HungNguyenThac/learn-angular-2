import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApplicationDocumentType } from '../../../../../../../../open-api-modules/dashboard-api-docs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BUTTON_TYPE } from '../../../../../../core/common/enum/operator';

@Component({
  selector: 'app-document-type-save-dialog',
  templateUrl: './document-type-save-dialog.component.html',
  styleUrls: ['./document-type-save-dialog.component.scss'],
})
export class DocumentTypeSaveDialogComponent implements OnInit {
  applicationDocumentTypeForm: FormGroup;
  title: string;
  applicationDocumentType: ApplicationDocumentType;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DocumentTypeSaveDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {}

  buildForm() {
    this.applicationDocumentTypeForm = this.formBuilder.group({
      name: [''],
      description: [''],
      isAvailableForCustomer: [''],
    });
  }

  initDialogData(data) {
    this.title = data?.title;
    this.applicationDocumentType = data?.element;

    this.applicationDocumentTypeForm.patchValue({
      name: this.applicationDocumentType?.name,
      description: this.applicationDocumentType?.description,
    });
  }

  submitForm() {
    if (this.applicationDocumentTypeForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.applicationDocumentTypeForm.getRawValue(),
    });
  }
}
