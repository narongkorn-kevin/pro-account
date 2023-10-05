import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCheifComponent } from './list-cheif.component';

describe('ListCheifComponent', () => {
  let component: ListCheifComponent;
  let fixture: ComponentFixture<ListCheifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCheifComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCheifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
