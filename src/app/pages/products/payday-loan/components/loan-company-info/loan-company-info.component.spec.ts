import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanCompanyInfoComponent } from './loan-company-info.component';

describe('LoanCompanyInfoComponent', () => {
  let component: LoanCompanyInfoComponent;
  let fixture: ComponentFixture<LoanCompanyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanCompanyInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
