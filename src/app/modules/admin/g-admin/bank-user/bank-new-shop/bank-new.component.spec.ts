import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankNewComponent } from './bank-new.component';

describe('BankNewComponent', () => {
  let component: BankNewComponent;
  let fixture: ComponentFixture<BankNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankNewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
