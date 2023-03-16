import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewOrderDetailComponent } from './view-order-detail.component';

describe('ViewOrderDetailComponent', () => {
  let component: ViewOrderDetailComponent;
  let fixture: ComponentFixture<ViewOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewOrderDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
