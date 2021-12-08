import { Component } from '@angular/core';
import { MultiLanguageService } from './share/translate/multiLanguageService';
import { fadeAnimation } from './core/common/animations/router.animation';
import { NgxPermissionsService } from 'ngx-permissions';
import {
  ApiResponseListString,
  PermissionControllerService,
} from '../../open-api-modules/identity-api-docs';
import * as fromStore from './core/store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs';
import {RESPONSE_CODE} from "./core/common/enum/operator";

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

  accessToken: string;
  accessToken$: Observable<string>;

  constructor(
    private multiLanguageService: MultiLanguageService,
    private permissionsService: NgxPermissionsService,
    private permissionControllerService: PermissionControllerService,
    private store: Store<fromStore.State>
  ) {
    sessionStorage.clear();
    this.multiLanguageService.changeLanguage('vi');
    this.multiLanguageService.onSetupMultiLanguage('payment');
    this._initSubscribeState();
  }

  private _initSubscribeState() {
    this.accessToken$ = this.store.select(fromStore.getTokenState);
    this.accessToken$.subscribe((accessToken: any) => {
      this.accessToken = accessToken;
      if (accessToken) {
        this._loadUserPermissions();
      }
    });
  }

  private _loadUserPermissions() {
    this.permissionControllerService
      .getPermissionsByAccount()
      .subscribe((response: ApiResponseListString) => {
        if (!response || !response.result || response.responseCode !== RESPONSE_CODE.SUCCESS) {
          return;
        }
        this.permissionsService.loadPermissions(response.result);
      });
  }
}
