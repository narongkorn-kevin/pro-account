import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranListComponent } from './tran-list.component';

describe('TranListComponent', () => {
  let component: TranListComponent;
  let fixture: ComponentFixture<TranListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TranListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
