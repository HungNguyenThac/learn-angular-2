import { Component, OnInit } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {fadeAnimation} from "../../core/common/animations";
import {MultiLanguageService} from "../../share/translate/multiLanguageService";

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

  constructor(private multiLanguageService: MultiLanguageService) {
    this.multiLanguageService.onSetupMultiLanguage("insurance")
  }

  ngOnInit(): void {
  }
}
