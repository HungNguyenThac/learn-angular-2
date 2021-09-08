import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalLetterSignComponent } from './approval-letter-sign.component';

describe('ApprovalLetterSignComponent', () => {
  let component: ApprovalLetterSignComponent;
  let fixture: ComponentFixture<ApprovalLetterSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalLetterSignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalLetterSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
