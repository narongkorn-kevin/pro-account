import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatTopupComponent } from './mat-topup.component';

describe('MatTopupComponent', () => {
  let component: MatTopupComponent;
  let fixture: ComponentFixture<MatTopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatTopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatTopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
