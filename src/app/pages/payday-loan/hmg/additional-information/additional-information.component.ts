import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-additional-information',
  templateUrl: './additional-information.component.html',
  styleUrls: ['./additional-information.component.scss']
})
export class AdditionalInformationComponent implements OnInit {
  additionalInfoForm: FormGroup;
  //hardcode
  maritalStatus = {
    fieldName: "Tình trạng độc thân",
    options: ["Độc thân", "Đã kết hôn"]
  }

  educationType = {
    fieldName: "Trình độ học vấn cao nhất",
    options: ["Đại học", "Tiến sĩ"]
  }

  borrowerDetailTextVariable1 = {
    fieldName: "Số người phụ thuộc tài chính",
    options: ["0 người", "01 người", "02 người"]
  }

  borrowerEmploymentHistoryTextVariable1 = {
    fieldName: "Thời gian làm việc ở công ty đến hiện tại",
    options: ["6 tháng - 1 năm", "Dưới 6 tháng", "1 năm - 2 năm"]
  }

  borrowerEmploymentAverageWage = {
    fieldName: "Khoảng lương trung bình",
    options: ["Dưới 10 triệu", "10  - dưới 15 triệu", "15  - dưới 20 triệu", "20  - dưới 30 triệu", "30  - dưới 50 triệu", "50  - dưới 100 triệu", "Trên 100 triệu"]
  }

  constructor(private fb: FormBuilder) {
    this.additionalInfoForm = this.fb.group({
      maritalStatus: [""],
      educationType: [""],
      borrowerDetailTextVariable1: [""],
      borrowerEmploymentHistoryTextVariable1: [""],
      borrowerEmploymentAverageWage: [""]
    })
  }

  ngOnInit(): void {
  }

  onSubmit() {
    console.log("form:", this.additionalInfoForm.getRawValue());
  }

}
