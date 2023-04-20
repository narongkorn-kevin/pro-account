import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivePreComponent } from './live-pre.component';

describe('LivePreComponent', () => {
  let component: LivePreComponent;
  let fixture: ComponentFixture<LivePreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivePreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivePreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
