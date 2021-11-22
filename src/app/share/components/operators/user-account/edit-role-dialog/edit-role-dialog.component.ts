import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BUTTON_TYPE } from '../../../../../core/common/enum/operator';
import { MultiLanguageService } from '../../../../translate/multiLanguageService';

@Component({
  selector: 'app-edit-role-dialog',
  templateUrl: './edit-role-dialog.component.html',
  styleUrls: ['./edit-role-dialog.component.scss'],
})
export class EditRoleDialogComponent implements OnInit {
  dialogTitle: string = this.multiLanguageService.instant(
    'system.user_role.add_role'
  );
  hasDelete: boolean = false;
  TREE_DATA;
  updateRoleForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<EditRoleDialogComponent>,
    private formBuilder: FormBuilder,
    private multiLanguageService: MultiLanguageService
  ) {
    this.buildAccountInfoForm();
    if (data) {
      this.initDialogData(data);
      this.dialogTitle = data?.title;
      this.hasDelete = data?.hasDelete;
      this.TREE_DATA = data?.TREE_DATA;
    }
  }

  ngOnInit(): void {}

  buildAccountInfoForm() {
    this.updateRoleForm = this.formBuilder.group({
      roleName: [''],
    });
  }

  initDialogData(data: any) {
    this.updateRoleForm.patchValue({
      roleName: data.roleName,
    });
  }
}
