import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopUpWalletComponent } from './top-up-wallet.component';

describe('TopUpWalletComponent', () => {
  let component: TopUpWalletComponent;
  let fixture: ComponentFixture<TopUpWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopUpWalletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopUpWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
