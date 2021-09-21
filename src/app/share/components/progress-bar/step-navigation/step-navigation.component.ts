import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-step-navigation',
  templateUrl: './step-navigation.component.html',
  styleUrls: ['./step-navigation.component.scss']
})
export class StepNavigationComponent implements OnInit {
  currentStep: number  = 1;
  totalStep: number  = 5;
  stepTitle: string  = "Định danh điện tử";
  constructor() { }

  ngOnInit(): void {
  }

}
