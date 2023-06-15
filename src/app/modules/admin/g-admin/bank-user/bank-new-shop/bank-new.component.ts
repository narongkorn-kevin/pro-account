import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';
import { BankService } from '../bank.service';
import { BankPagination } from '../bank.types';
import { NewBankComponent } from '../new-bank/new-bank.component';

@Component({
  selector: 'app-bank-new',
  templateUrl: './bank-new.component.html',
  styleUrls: ['./bank-new.component.scss']
})
export class BankNewShopComponent implements OnInit, AfterViewInit, OnDestroy {

  files: File[] = [];
  formData: FormGroup
  flashErrorMessage: string;
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  searchInputControl: FormControl = new FormControl();
  selectedProduct: any | null = null;
  filterForm: FormGroup;
  tagsEditMode: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  env_path = environment.API_URL;

  // me: any | null;
  // get roleType(): string {
  //     return 'marketing';
  // }

  supplierId: string | null;
  pagination: BankPagination;
  Bank$: Observable<any>;

  
  /**
   * Constructor
   */
  constructor(

      public dialogRef: MatDialogRef<NewBankComponent>,
      private _changeDetectorRef: ChangeDetectorRef,
      private _fuseConfirmationService: FuseConfirmationService,
      private _formBuilder: FormBuilder,
      private _Service: BankService,
      private _matDialog: MatDialog,
      private _router: Router,
      private _activatedRoute: ActivatedRoute,
      private _authService: AuthService,
  ) {

      

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  user: any;
  ngOnInit(): void {
    console.log('5555555');
      this.Bank$ = this._Service.getBank();
      this.user = JSON.parse(localStorage.getItem("user"));
      console.log(this.user.id,'Id');
      this.formData = this._formBuilder.group({
        user_id: this.user.id,
        bank_id: '',
        first_name: '',
        last_name: '',
        account_number: ['',]
      })
      // this.formData = this._formBuilder.group({
      //     first_name: '',
      //     name: '',
      //     last_name: '',
      //     account_number: '',
      //     image: ['',]
      // })
  }

  /**
   * After view init
   */
  ngAfterViewInit(): void {

  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
      // Unsubscribe from all subscriptions

  }

  onClose() {
      this.dialogRef.close();
  }


  New(): void {
      this.flashMessage = null;
      this.flashErrorMessage = null;
      const confirmation = this._fuseConfirmationService.open({
          "title": "สร้างช่องทางการจ่ายเงิน",
          "message": "คุณต้องการสร้างช่องทางการจ่ายเงินใหม่ใช่หรือไม่ ?",
          "icon": {
              "show": true,
              "name": 'heroicons_outline:plus-circle',
              "color": 'info',
          },
          "actions": {
              "confirm": {
                  "show": true,
                  "label": "ยืนยัน",
                  "color": "primary"
              },
              "cancel": {
                  "show": true,
                  "label": "ยกเลิก"
              }
          },
          "dismissible": true
      });

      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {

          // If the confirm button pressed...
          if (result === 'confirmed') {

              console.log('formdata', this.formData.value);

              const formData = new FormData();
              Object.entries(this.formData.value).forEach(
                  ([key, value]: any[]) => {
                      formData.append(key, value);
                  }
              );
              this._Service.create(formData).subscribe({
                  next: (resp: any) => {
                      this.showFlashMessage('success');
                      this.dialogRef.close();
                  },
                  error: (err: any) => {

                      this._fuseConfirmationService.open({
                          "title": "กรุณาระบุข้อมูล",
                          "message": err.error.message,
                          "icon": {
                              "show": true,
                              "name": "heroicons_outline:exclamation",
                              "color": "warning"
                          },
                          "actions": {
                              "confirm": {
                                  "show": false,
                                  "label": "ยืนยัน",
                                  "color": "primary"
                              },
                              "cancel": {
                                  "show": false,
                                  "label": "ยกเลิก",

                              }
                          },
                          "dismissible": true
                      });
                      console.log(err.error.message)
                  }
              }
              )
          }
      });

  }

  showFlashMessage(type: 'success' | 'error'): void {
      // Show the message
      this.flashMessage = type;

      // Mark for check
      this._changeDetectorRef.markForCheck();

      // Hide it after 3 seconds
      setTimeout(() => {

          this.flashMessage = null;

          // Mark for check
          this._changeDetectorRef.markForCheck();
      }, 3000);
  }

  onSelect(event) {
      console.log(event);
      this.files.push(...event.addedFiles);
      // Trigger Image Preview
      setTimeout(() => {
          this._changeDetectorRef.detectChanges()
      }, 150)
      this.formData.patchValue({
          image: this.files[0],
      });
      // console.log(this.formData.value)
  }

  onRemove(event) {
      console.log('1', event);
      this.files.splice(this.files.indexOf(event), 1);
      this.formData.patchValue({
          image: '',
      });
      // console.log(this.formData.value)
  }



}
