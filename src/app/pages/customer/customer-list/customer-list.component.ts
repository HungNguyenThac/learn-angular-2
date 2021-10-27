import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { GlobalConstants } from 'src/app/core/common/global-constants';
import { Store } from '@ngrx/store';
import * as fromActions from '../../../core/store';
import * as fromStore from '../../../core/store';
import { NAV_ITEM } from '../../../core/common/enum/operator';
import { MultiLanguageService } from '../../../share/translate/multiLanguageService';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent implements OnInit {
  constructor(
    private titleService: Title,
    private store: Store<fromStore.State>,
    private multiLanguageService: MultiLanguageService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(
      this.multiLanguageService.instant('page_title.customer_list') +
        ' - ' +
        GlobalConstants.PL_VALUE_DEFAULT.PROJECT_NAME
    );
    this.store.dispatch(new fromActions.SetOperatorInfo(NAV_ITEM.CUSTOMER));
  }
}
