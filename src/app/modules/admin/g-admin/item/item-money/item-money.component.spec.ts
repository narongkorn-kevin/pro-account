import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemMoneyComponent } from './item-money.component';

describe('ItemMoneyComponent', () => {
  let component: ItemMoneyComponent;
  let fixture: ComponentFixture<ItemMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemMoneyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
