import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditWalletComponent } from './edit-wallet.component';


describe('EditWalletComponent', () => {
  let component: EditWalletComponent;
  let fixture: ComponentFixture<EditWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWalletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
