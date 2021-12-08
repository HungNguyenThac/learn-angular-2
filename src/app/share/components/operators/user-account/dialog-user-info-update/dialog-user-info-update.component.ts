import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  BUTTON_TYPE,
  RESPONSE_CODE,
} from '../../../../../core/common/enum/operator';
import {
  AdminAccountEntity,
  ApiResponseSearchAndPaginationResponseGroupEntity,
  GroupControllerService,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { Subscription } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-dialog-user-info-update',
  templateUrl: './dialog-user-info-update.component.html',
  styleUrls: ['./dialog-user-info-update.component.scss'],
})
export class DialogUserInfoUpdateComponent implements OnInit {
  accountInfoForm: FormGroup;
  isAccountNameInputFocus: boolean = false;
  isPhoneInputFocus: boolean = false;
  isNoteInputFocus: boolean = false;
  subManager = new Subscription();

  roleOptions = [];

  positionOptions = {
    fieldName: 'Vị trí công việc',
    options: ['Kiểm duyệt viên', 'DB Merchant', 'Operator Admin', 'Kế toán'],
  };

  constructor(
    private dialogRef: MatDialogRef<DialogUserInfoUpdateComponent>,
    private groupControllerService: GroupControllerService,
    private permissionsService: NgxPermissionsService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.buildAccountInfoForm();
    this.getRoleList();
    if (data) {
      this.initDialogData(data);
    }
  }

  ngOnInit(): void {}

  buildAccountInfoForm() {
    this.accountInfoForm = this.formBuilder.group({
      fullName: [''],
      username: [''],
      groupId: [''],
      groupName: [''],
      mobile: [''],
      email: [''],
      position: [''],
      note: [''],
    });
  }

  initDialogData(userInfo: AdminAccountEntity) {
    this.accountInfoForm.patchValue({
      fullName: userInfo?.fullName,
      username: userInfo?.username,
      groupId: userInfo?.groupId,
      groupName: userInfo?.groupEntity?.name,
      mobile: userInfo?.mobile,
      email: userInfo?.email,
      position: userInfo?.position,
      note: userInfo?.note,
    });
  }

  getRoleList() {
    if (!this.permissionsService.hasPermission('dashboardGroups:getGroups')) {
      return;
    }
    this.subManager.add(
      this.groupControllerService
        .getGroups(100, 0, {})
        .subscribe(
          (result: ApiResponseSearchAndPaginationResponseGroupEntity) => {
            if (!result || result.responseCode !== RESPONSE_CODE.SUCCESS) {
              return;
            }
            this.roleOptions = result?.result?.data;
          }
        )
    );
  }

  submitForm() {
    if (this.accountInfoForm.invalid) {
      return;
    }
    this.dialogRef.close({
      type: BUTTON_TYPE.PRIMARY,
      data: this.accountInfoForm.getRawValue(),
    });
  }
}
