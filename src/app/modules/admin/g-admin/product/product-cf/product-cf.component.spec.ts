import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCfComponent } from './product-cf.component';

describe('ProductCfComponent', () => {
  let component: ProductCfComponent;
  let fixture: ComponentFixture<ProductCfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
