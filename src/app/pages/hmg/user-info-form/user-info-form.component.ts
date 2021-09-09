import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-info-form',
  templateUrl: './user-info-form.component.html',
  styleUrls: ['./user-info-form.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "vi-VN" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class UserInfoFormComponent implements OnInit {

  infoForm: FormGroup;

  genderOptions = ["Nam", "Nữ"]
  genderStartValue = this.genderOptions[0];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.infoForm =  this.formBuilder.group({
      name: [""],
      dateOfBirth: [""],
      gender: [""],
      identityNumberOne: [""],
      idIssuePlace: [""],
      permanentAddress: [""],
      currentAddress: [""],
      email: [""]
    })
  }

  ngOnInit(): void {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear();
  }

  onInfoSubmit() {
    console.log(this.infoForm);
    this.router.navigateByUrl('/hmg/approval-letter')
  }

}
