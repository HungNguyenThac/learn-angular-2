import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractTermsOfServiceComponent } from './contract-terms-of-service.component';

describe('ContractTermsOfServiceComponent', () => {
  let component: ContractTermsOfServiceComponent;
  let fixture: ComponentFixture<ContractTermsOfServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractTermsOfServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractTermsOfServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
