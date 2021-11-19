import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BUTTON_TYPE} from "../../../../../core/common/enum/operator";

@Component({
  selector: 'app-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  styleUrls: ['./edit-role-dialog.component.scss'],
})
export class EditRoleDialogComponent implements OnInit {
  dialogTitle;
  SYSTEM_DATA;
  TRANSACTION_DATA;
  CUSTOMER_DATA;
  updateRoleForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<EditRoleDialogComponent>,
    private formBuilder: FormBuilder
  ) {
    this.dialogTitle = data.title;
    this.SYSTEM_DATA = data.SYSTEM_DATA;
    this.TRANSACTION_DATA = data.TRANSACTION_DATA;
    this.CUSTOMER_DATA = data.CUSTOMER_DATA;
  }

  ngOnInit(): void {
  }

  buildAccountInfoForm() {
    this.updateRoleForm = this.formBuilder.group({
      roleName: [''],
    });
  }

}
