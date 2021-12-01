import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantVerifyComponent } from './merchant-verify.component';

describe('MerchantVerifyComponent', () => {
  let component: MerchantVerifyComponent;
  let fixture: ComponentFixture<MerchantVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerchantVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
