import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalUserInfoComponent } from './additional-user-info.component';

describe('AdditionalUserInfoComponent', () => {
  let component: AdditionalUserInfoComponent;
  let fixture: ComponentFixture<AdditionalUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalUserInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
