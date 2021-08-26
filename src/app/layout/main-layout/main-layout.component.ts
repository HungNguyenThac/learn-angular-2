import { Component, OnInit } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {fadeAnimation} from "../../core/common/animations";

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  animations: [
    fadeAnimation
    // animation triggers go here
  ]
})
export class MainLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
