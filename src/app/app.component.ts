import { Component } from '@angular/core';
import { MultiLanguageService } from './share/translate/multiLanguageService';
import { fadeAnimation } from './core/common/animations/router.animation';
import { NgxPermissionsService } from 'ngx-permissions';

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
  title = 'monex-op';

  constructor(
    private multiLanguageService: MultiLanguageService,
    private permissionsService: NgxPermissionsService
  ) {
    sessionStorage.clear();
    this.multiLanguageService.changeLanguage('vi');
    this.multiLanguageService.onSetupMultiLanguage('payment');
    this.loadUserPermissions();
  }

  loadUserPermissions() {
    const perm = ["ADMIN", "EDITOR"];
    this.permissionsService.loadPermissions(perm);

    // this.http.get('url').subscribe((permissions) => {
    //   //const perm = ["ADMIN", "EDITOR"]; example of permissions
    //   this.permissionsService.loadPermissions(permissions);
    // })
  }
}
