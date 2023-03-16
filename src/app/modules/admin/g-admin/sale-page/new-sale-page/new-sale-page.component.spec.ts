import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSalePageComponent } from './new-sale-page.component';

describe('NewSalePageComponent', () => {
  let component: NewSalePageComponent;
  let fixture: ComponentFixture<NewSalePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSalePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSalePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
