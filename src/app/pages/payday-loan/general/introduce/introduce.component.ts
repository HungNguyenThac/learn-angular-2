import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {GlobalConstants} from "../../../../core/common/global-constants";

@Component({
  selector: 'app-introduce',
  templateUrl: './introduce.component.html',
  styleUrls: ['./introduce.component.scss'],
})
export class IntroduceComponent implements OnInit {
  constructor(private router: Router, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Ứng lương 24h'  + " - " + GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME);
  }

  start() {
    this.router.navigateByUrl('/auth/sign-in').then((r) => {});
  }
}
