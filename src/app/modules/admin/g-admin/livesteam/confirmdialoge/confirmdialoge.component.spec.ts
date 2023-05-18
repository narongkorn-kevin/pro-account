import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmdialogeComponent } from './confirmdialoge.component';

describe('ConfirmdialogeComponent', () => {
  let component: ConfirmdialogeComponent;
  let fixture: ComponentFixture<ConfirmdialogeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmdialogeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmdialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
