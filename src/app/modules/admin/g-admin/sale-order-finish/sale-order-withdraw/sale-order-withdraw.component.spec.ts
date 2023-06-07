import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderWithdrawComponent } from './sale-order-withdraw.component';

describe('SaleOrderWithdrawComponent', () => {
  let component: SaleOrderWithdrawComponent;
  let fixture: ComponentFixture<SaleOrderWithdrawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleOrderWithdrawComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleOrderWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
