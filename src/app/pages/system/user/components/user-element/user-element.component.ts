import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CompanyInfo } from '../../../../../../../open-api-modules/dashboard-api-docs';

@Component({
  selector: 'app-user-element',
  templateUrl: './user-element.component.html',
  styleUrls: ['./user-element.component.scss'],
})
export class UserElementComponent implements OnInit {
  @Input() userInfo;
  @Input() treeData;
  @Output() triggerUpdateElementInfo = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    console.log(this.userInfo);
  }

  updateElementInfo(event) {
    this.triggerUpdateElementInfo.emit(event);
  }
}
