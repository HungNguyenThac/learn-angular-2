import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() titleNavigation :string = "Bảo hiểm";
  logoSrc: string = "assets/img/monex-logo.svg";
  isLogged:boolean = true;
  isSignUp: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
