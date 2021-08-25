import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'determine-needs',
  templateUrl: './determine-needs.component.html',
  styleUrls: ['./determine-needs.component.scss']
})
export class DetermineNeedsComponent implements OnInit {
  ageOptions = ["Từ 16 tuổi đến 19 tuổi", "Từ 20 tuổi đến 29 tuổi","Từ 30 tuổi đến 39 tuổi", "Từ 40 tuổi đến 49 tuổi", "Từ 50 tuổi đến 59 tuổi"]
  jobOptions = ["Công việc văn phòng", "Tự do", "Kinh doanh", "Công nhân"]
  genderOptions = ["Nam", "Nữ"]
  vehicleOptions = ["Xe Máy", "Ô tô", "Khác"]
  genderStartValue = this.genderOptions[0];
  vehicleStartValue = this.vehicleOptions[0];

  infoForm: FormGroup;
  constructor(
    private formBuider: FormBuilder
  ) {
    this.infoForm =  this.formBuider.group({
      age: [""],
      gender: [""],
      job: [""],
      vehicle: [""],
    })
  }

  ngOnInit(): void {
  }

  onInfoSubmit() {
    console.log(this.infoForm);
  }
}
