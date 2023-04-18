import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypemoneyComponent } from './typemoney.component';

describe('TypemoneyComponent', () => {
  let component: TypemoneyComponent;
  let fixture: ComponentFixture<TypemoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypemoneyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypemoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
