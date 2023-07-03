import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranChangeComponent } from './tran-change.component';

describe('TranChangeComponent', () => {
  let component: TranChangeComponent;
  let fixture: ComponentFixture<TranChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
