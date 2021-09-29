import { Component } from '@angular/core';
import { MultiLanguageService } from './share/translate/multiLanguageService';
import { fadeAnimation } from './core/common/animations/router.animation';
import 'src/assets/styles/main.scss';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeAnimation,
    // animation triggers go here
  ],
})
export class AppComponent {
  title = 'monex-webapp-hmg';

  constructor(private multiLanguageService: MultiLanguageService) {
    multiLanguageService.changeLanguage('vi');
    this.multiLanguageService.onSetupMultiLanguage('insurance');
    this.multiLanguageService.onSetupMultiLanguage('payday-loan');
    this.multiLanguageService.onSetupMultiLanguage("payment")
  }
}
