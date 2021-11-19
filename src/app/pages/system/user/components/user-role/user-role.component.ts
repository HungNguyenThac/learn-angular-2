import { Component, OnInit, Injectable } from '@angular/core';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';
import { MatDialog } from '@angular/material/dialog';
import { EditRoleDialogComponent } from '../../../../../share/components/operators/user-account/edit-role-dialog/edit-role-dialog.component';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss'],
})
export class UserRoleComponent implements OnInit {
  roles = [
    { title: 'Kiểm duyệt viên', id: '1' },
    { title: 'Quản trị viên', id: '2' },
  ];
  SYSTEM_DATA = {
    'Thiết lập': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
    'Người dùng': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
    'Cấu hình khoản vay': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
    'Zalo/SMS/Email': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
    'Tổng quan': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
  };
  TRANSACTION_DATA = {
    'Danh sách khoản vay': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
    'Ký hợp đồng vay': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
    'Cấu hình khoản vay': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
    'Đầu tư khoản vay': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
  };
  CUSTOMER_DATA = {
    'Người vay': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
    'Tài liệu': ['Xem danh sách', 'Thêm mới', 'Cập nhật', 'Xóa'],
  };

  constructor(
    private multiLanguageService: MultiLanguageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {}

  openUpdateDialog(id) {
    console.log(id);
    const updateDialogRef = this.dialog.open(EditRoleDialogComponent, {
      panelClass: 'custom-info-dialog-container',
      maxWidth: '800px',
      width: '90%',
      data: {
        title: this.multiLanguageService.instant('system.user_role.edit_role'),
        SYSTEM_DATA: this.SYSTEM_DATA,
        TRANSACTION_DATA: this.TRANSACTION_DATA,
        CUSTOMER_DATA: this.CUSTOMER_DATA,
      },
    });
  }
}
