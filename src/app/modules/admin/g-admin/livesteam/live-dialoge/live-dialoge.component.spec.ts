import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveDialogeComponent } from './live-dialoge.component';

describe('LiveDialogeComponent', () => {
  let component: LiveDialogeComponent;
  let fixture: ComponentFixture<LiveDialogeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveDialogeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveDialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
