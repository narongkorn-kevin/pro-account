import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangePwdComponent } from './dialog-change-pwd.component';

describe('DialogChangePwdComponent', () => {
  let component: DialogChangePwdComponent;
  let fixture: ComponentFixture<DialogChangePwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogChangePwdComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogChangePwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
