import { Rating } from '../../../../open-api-modules/customer-api-docs';
import { RatingComponent } from '../../pages/payday-loan/components/rating/rating.component';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../core/common/animations/router.animation';
import { MultiLanguageService } from '../../share/translate/multiLanguageService';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/core/store/index';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  animations: [
    fadeAnimation,
    // animation triggers go here
  ],
})
export class MainLayoutComponent implements OnInit {
  rateInfo$: Observable<any>;
  customerId$: Observable<string>;
  accessToken$: Observable<string>;
  coreToken$: Observable<string>;

  customerId: string;
  accessToken: string;
  coreToken: string;

  subManager = new Subscription();
  constructor(
    private multiLanguageService: MultiLanguageService,
    private store: Store<fromStore.State>,
    private dialog: MatDialog
  ) {
    this._initSubscribeState();
  }

  async ngOnInit() {
    await this.multiLanguageService.changeLanguage('vi');
    await this.multiLanguageService.use('vi');
    await this.initCustomerState();
  }

  initCustomerState() {
    if (this.accessToken) {
      this.store.dispatch(new fromStore.GetCustomerInfo(this.customerId));
    }
  }

  _initSubscribeState() {
    this.rateInfo$ = this.store.select(fromStore.getRatingState);
    this.customerId$ = this.store.select(fromStore.getCustomerIdState);
    this.accessToken$ = this.store.select(fromStore.getTokenState);
    this.coreToken$ = this.store.select(fromStore.getCoreTokenState);

    this.subManager.add(
      this.rateInfo$.subscribe((rateInfo: Rating) => {
        if (rateInfo && !rateInfo.rated) {
          this.dialog.open(RatingComponent, {
            autoFocus: false,
            data: rateInfo,
            panelClass: 'custom-dialog-container',
          });
        }
      })
    );

    this.subManager.add(
      this.customerId$.subscribe((customerId: string) => {
        this.customerId = customerId;
      })
    );

    this.subManager.add(
      this.accessToken$.subscribe((accessToken: any) => {
        this.accessToken = accessToken;
      })
    );

    this.subManager.add(
      this.coreToken$.subscribe((coreToken: any) => {
        this.coreToken = coreToken;
      })
    );
  }
}
