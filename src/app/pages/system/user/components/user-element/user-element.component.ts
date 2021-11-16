import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-user-element',
  templateUrl: './user-element.component.html',
  styleUrls: ['./user-element.component.scss'],
})
export class UserElementComponent implements OnInit {
  @Input() userInfo;

  constructor() {
  }

  ngOnInit(): void {
    console.log(this.userInfo);
  }
}
