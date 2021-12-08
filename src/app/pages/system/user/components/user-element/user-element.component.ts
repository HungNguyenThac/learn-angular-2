import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AdminAccountControllerService,
  ApiResponseAdminAccountEntity,
  ApiResponseCustomerInfo,
  CompanyInfo,
} from '../../../../../../../open-api-modules/dashboard-api-docs';
import { Subscription } from 'rxjs';
import { AdminAccountControllerService as AdminAccountControllerService1 } from '../../../../../../../open-api-modules/identity-api-docs';

@Component({
  selector: 'app-user-element',
  templateUrl: './user-element.component.html',
  styleUrls: ['./user-element.component.scss'],
})
export class UserElementComponent implements OnInit {
  _userId;
  userInfo;
  subManager = new Subscription();
  @Input() roleList;
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
    private adminAccountControllerService: AdminAccountControllerService,
    private identityAdminAccountControllerService: AdminAccountControllerService1
  ) {}

  ngOnInit(): void {
    this._getUserInfoById(this.userId);
  }

  public refreshContent() {
    setTimeout(() => {
      this._getUserInfoById(this.userId);
    }, 1000);
  }

  private _getUserInfoById(userId) {
    if (!userId) return;
    this.subManager.add(
      this.adminAccountControllerService
        .getAdminAccountById(this.userId)
        .subscribe((data: ApiResponseAdminAccountEntity) => {
          this.userInfo = data?.result;
          this.triggerUpdateElementInfo.emit(this.userInfo);
        })
    );
  }

  private updateUserInfo(updateInfoRequest) {
    this.subManager.add(
      this.identityAdminAccountControllerService
        .updateFullInfo(this.userId, updateInfoRequest)
        .subscribe((data: ApiResponseAdminAccountEntity) => {
          this.userInfo = data?.result;
          this.triggerUpdateElementInfo.emit(this.userInfo);
        })
    );
  }

  updateElementInfo(updateInfoRequest) {
    if (!updateInfoRequest) {
      this.refreshContent();
    } else {
      this.updateUserInfo(updateInfoRequest);
    }
  }
}
