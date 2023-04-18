import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupHistoryComponent } from './topup-history.component';

describe('TopupHistoryComponent', () => {
  let component: TopupHistoryComponent;
  let fixture: ComponentFixture<TopupHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopupHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopupHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
