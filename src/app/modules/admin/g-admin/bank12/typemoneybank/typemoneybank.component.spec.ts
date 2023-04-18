import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypemoneybankComponent } from './typemoneybank.component';

describe('TypemoneybankComponent', () => {
  let component: TypemoneybankComponent;
  let fixture: ComponentFixture<TypemoneybankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypemoneybankComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypemoneybankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
