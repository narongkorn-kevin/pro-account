import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockHowtoComponent } from './mock-howto.component';

describe('MockHowtoComponent', () => {
  let component: MockHowtoComponent;
  let fixture: ComponentFixture<MockHowtoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MockHowtoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MockHowtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
