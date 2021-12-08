import { PermissionTreeComponent } from './../../../../../share/components/operators/user-account/permission-tree/permission-tree.component';
import { Component, OnInit, Injectable, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { MatDialog } from '@angular/material/dialog';
import { EditRoleDialogComponent } from '../../../../../share/components/operators/user-account/edit-role-dialog/edit-role-dialog.component';
import { ApiResponseListCity } from '../../../../../../../open-api-modules/customer-api-docs';
import { Subscription } from 'rxjs';
import {
  ApiResponseCollectionParentPermissionTypeResponse,
  ParentPermissionTypeResponse,
  PermissionTypeControllerService,
} from '../../../../../../../open-api-modules/dashboard-api-docs';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss'],
})
export class UserRoleComponent implements OnInit {
  treeData: Array<ParentPermissionTypeResponse>;
  subManager = new Subscription();
  roles = [
    { title: 'Kiểm duyệt viên', id: '1' },
    { title: 'Quản trị viên', id: '2' },
  ];
  TREE_DATA = [
    {
      title: this.multiLanguageService.instant('system.user_role.system'),
      data: {
        'Thiết lập': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
        'Người dùng': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
        'Cấu hình khoản vay': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
        'Zalo/SMS/Email': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
        'Tổng quan': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
      },
    },
    {
      title: this.multiLanguageService.instant('system.user_role.transaction'),
      data: {
        'Danh sách khoản vay': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
        'Ký hợp đồng vay': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
        'Cấu hình khoản vay': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
        'Đầu tư khoản vay': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
      },
    },
    {
      title: this.multiLanguageService.instant('system.user_role.customer'),
      data: {
        'Người vay': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
        'Tài liệu': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
      },
    },
  ];

  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog,
    private permissionTypeControllerService: PermissionTypeControllerService
  ) {}

  @ViewChildren('tree') permissionTree: QueryList<PermissionTreeComponent>;

  ngOnInit(): void {
    this.getPermissionList();
  }

  openUpdateDialog(roleTitle) {
    const updateDialogRef = this.dialog.open(EditRoleDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        title: this.multiLanguageService.instant('system.user_role.edit_role'),
        roleName: roleTitle,
        TREE_DATA: this.TREE_DATA,
      },
    });
  }

  openCreateDialog() {
    const updateDialogRef = this.dialog.open(EditRoleDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        title: this.multiLanguageService.instant('system.user_role.add_role'),
        hasDelete: true,
        TREE_DATA: this.TREE_DATA,
      },
    });
  }

  getPermissionList() {
    this.subManager.add(
      this.permissionTypeControllerService
        .getPermissionTypeByTreeFormat()
        .subscribe(
          (result: ApiResponseCollectionParentPermissionTypeResponse) => {
            if (!result || result.responseCode !== 200) {
              // return this.handleResponseError(result.errorCode);
            }
            this.treeData = result.result;
            console.log(this.treeData);
          }
        )
    );
  }

  addRoleToUser() {
    const arrayPermissionTreeComponent = this.permissionTree.toArray();
    let arrayPermission = []
    for (let i = 0; i < arrayPermissionTreeComponent.length; i++) {
      if (
        arrayPermissionTreeComponent[i].totalPermissionSelected().length > 0
      )
        arrayPermission.push(
          ...arrayPermissionTreeComponent[i].totalPermissionSelected()
        );
    }
    console.log(arrayPermission);

  }
}
