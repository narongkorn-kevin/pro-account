import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlipSalaryComponent } from './slip-salary.component';

describe('SlipSalaryComponent', () => {
  let component: SlipSalaryComponent;
  let fixture: ComponentFixture<SlipSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlipSalaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlipSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
