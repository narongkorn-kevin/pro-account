import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryCustomerOrderComponent } from './history-customer-order.component';

describe('HistoryCustomerOrderComponent', () => {
  let component: HistoryCustomerOrderComponent;
  let fixture: ComponentFixture<HistoryCustomerOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryCustomerOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryCustomerOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
