import {Component} from '@angular/core';
import {MultiLanguageService} from "./share/translate/multiLanguageService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'monex-insurance-web-app';

  constructor(private multiLanguageService: MultiLanguageService) {
    multiLanguageService.changeLanguage('vi');
  }
}
