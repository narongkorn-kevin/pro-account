import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FbLiveComponent } from './fb-live.component';

describe('FbLiveComponent', () => {
  let component: FbLiveComponent;
  let fixture: ComponentFixture<FbLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FbLiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FbLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
