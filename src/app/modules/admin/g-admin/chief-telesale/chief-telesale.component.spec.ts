import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChiefTelesaleComponent } from './chief-telesale.component';

describe('ChiefTelesaleComponent', () => {
  let component: ChiefTelesaleComponent;
  let fixture: ComponentFixture<ChiefTelesaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChiefTelesaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChiefTelesaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
