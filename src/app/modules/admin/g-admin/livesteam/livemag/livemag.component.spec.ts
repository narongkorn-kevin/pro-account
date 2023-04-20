import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivemagComponent } from './livemag.component';

describe('LivemagComponent', () => {
  let component: LivemagComponent;
  let fixture: ComponentFixture<LivemagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivemagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivemagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
