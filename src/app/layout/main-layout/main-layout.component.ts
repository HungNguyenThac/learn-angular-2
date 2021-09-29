import { Rating } from './../../../../open-api-modules/customer-api-docs/model/rating';
import { RatingComponent } from './../../pages/payday-loan/components/rating/rating.component';
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
  public customerId$: Observable<any>;
  customerId: string;
  rateInfo$: Observable<any>;
  subManager = new Subscription();
  constructor(private multiLanguageService: MultiLanguageService,
    private store: Store<fromStore.State>,
    private dialog: MatDialog
    ) {
    this.customerId$ = this.store.select(fromStore.getCustomerIdState);
    this.rateInfo$ = this.store.select(fromStore.getRatingState);
    
    this.subManager.add(
      this.customerId$.subscribe((id) => {
        this.customerId = id;
        console.log('customer id', id);
      })
      );

      this.subManager.add(
        this.rateInfo$.subscribe((rateInfo:Rating) => {
          if (rateInfo) {
            this.dialog.open(RatingComponent, {
              autoFocus: false,
              data: rateInfo,
              panelClass: 'custom-dialog-container',
            });
          }
        })
      );
  }

  async ngOnInit() {
    await this.multiLanguageService.changeLanguage('vi');
    await this.multiLanguageService.use('vi');
  }
}
