import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleFinishComponent } from './sale-finish.component';

describe('SaleFinishComponent', () => {
  let component: SaleFinishComponent;
  let fixture: ComponentFixture<SaleFinishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleFinishComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
