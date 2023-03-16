import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileUseradminComponent } from './profile-useradmin.component';

describe('ProfileUseradminComponent', () => {
  let component: ProfileUseradminComponent;
  let fixture: ComponentFixture<ProfileUseradminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileUseradminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileUseradminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
