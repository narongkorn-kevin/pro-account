import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintOrderDetailComponent } from './print-order-detail.component';

describe('PrintOrderDetailComponent', () => {
  let component: PrintOrderDetailComponent;
  let fixture: ComponentFixture<PrintOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintOrderDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
