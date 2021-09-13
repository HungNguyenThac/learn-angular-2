import { Component, OnInit } from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from "@angular/material-moment-adapter";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-confirm-information',
  templateUrl: './confirm-information.component.html',
  styleUrls: ['./confirm-information.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "vi-VN" },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class ConfirmInformationComponent implements OnInit {
  infoForm: FormGroup;

  genderOptions = ["Nam", "Nữ"]
  genderStartValue = this.genderOptions[0];
  constructor( private router: Router,
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
