import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailContractSignComponent } from './detail-contract-sign.component';

describe('DetailContractSignComponent', () => {
  let component: DetailContractSignComponent;
  let fixture: ComponentFixture<DetailContractSignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailContractSignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailContractSignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
