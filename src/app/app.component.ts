import {Component} from '@angular/core';
import {MultiLanguageService} from "./share/translate/multiLanguageService";
import {fadeAnimation} from "./core/common/animations/router.animation";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeAnimation
    // animation triggers go here
  ]
})
export class AppComponent {
  title = 'monex-insurance-web-app';

  constructor(private multiLanguageService: MultiLanguageService) {
    multiLanguageService.changeLanguage('vi');
  }
}
