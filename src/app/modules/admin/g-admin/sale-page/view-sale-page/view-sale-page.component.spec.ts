import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSalePageComponent } from './view-sale-page.component';

describe('ViewSalePageComponent', () => {
  let component: ViewSalePageComponent;
  let fixture: ComponentFixture<ViewSalePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewSalePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSalePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
