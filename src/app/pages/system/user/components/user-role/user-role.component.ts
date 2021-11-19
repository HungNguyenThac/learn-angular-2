import { Component, OnInit, Injectable } from '@angular/core';
import { MultiLanguageService } from '../../../../../share/translate/multiLanguageService';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss'],
})
export class UserRoleComponent implements OnInit {
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

  constructor(private multiLanguageService: MultiLanguageService) {}

  ngOnInit(): void {}
}
