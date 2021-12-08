import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AdminAccountControllerService,
  ApiResponseAdminAccountEntity,
  ApiResponseCustomerInfo,
  CompanyInfo,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-element',
  templateUrl: './user-element.component.html',
  styleUrls: ['./user-element.component.scss'],
})
export class UserElementComponent implements OnInit {
  _userId;
  userInfo;
  subManager = new Subscription();
  @Input() treeData;
  @Output() triggerUpdateElementInfo = new EventEmitter();

  @Input()
  get userId(): string {
    return this._userId;
  }

  set userId(value: string) {
    this._userId = value;
  }

  constructor(
    private adminAccountControllerService: AdminAccountControllerService
  ) {}

  ngOnInit(): void {
    this._getUserInfoById(this.userId);
  }

  public refreshContent() {
    setTimeout(() => {
      this._getUserInfoById(this.userId);
    }, 2000);
  }

  private _getUserInfoById(userId) {
    if (!userId) return;
    this.subManager.add(
      this.adminAccountControllerService
        .getAdminAccountById(this.userId)
        .subscribe((data: ApiResponseAdminAccountEntity) => {
          this.userInfo = data?.result;
        })
    );
  }

  updateElementInfo(event) {
    this.refreshContent();
    this.triggerUpdateElementInfo.emit(event);
  }
}
