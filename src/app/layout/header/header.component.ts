import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() titleNavigation: string = "Ứng lương 0% lãi";
  logoSrc: string = "assets/img/monex-logo.svg";
  isLogged: boolean = true;
  isSignUp: boolean = false;
  showStepProgressBar: boolean = false;
  showStepNavigation: boolean = true;
  displayLeftBtn: boolean = true;
  displayRightBtn: boolean = true;
  leftBtnIcon: string = "sprite-group-3-icon-back";
  rightBtnIcon: string = "sprite-group-3-help-white"

  constructor() {
  }

  ngOnInit(): void {
  }

}
