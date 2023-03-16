import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { ConfirmPasswordValidator } from "./confirm-password.validator";
import { sortBy, startCase } from 'lodash-es';
import { AssetType, UserPagination } from '../user.types';
import { UserService } from '../user.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
  selector: 'app-dialog-change-pwd',
  templateUrl: './dialog-change-pwd.component.html',
  styleUrls: ['./dialog-change-pwd.component.scss'],
  animations: fuseAnimations
})

export class DialogChangePwdComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;


  statusData = [
    { id: 0, name: 'ปิดการใช้งาน' },
    { id: 1, name: 'เปิดการใช้งาน' },
  ]

  positionId: string
  positionData: any = [];


  formData: FormGroup
  flashErrorMessage: string;
  flashMessage: 'success' | 'error' | null = null;
  isLoading: boolean = false;
  searchInputControl: FormControl = new FormControl();
  selectedProduct: any | null = null;
  filterForm: FormGroup;
  submitted: boolean = false;

  tagsEditMode: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  env_path = environment.API_URL;

  // me: any | null;
  // get roleType(): string {
  //     return 'marketing';
  // }

  supplierId: string | null;
  pagination: UserPagination;

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogChangePwdComponent>,
    @Inject(MAT_DIALOG_DATA) private _data,
    private _Service: UserService,
    private _matDialog: MatDialog,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
  ) {

    this.formData = this._formBuilder.group({
      id: '',
      password: ['', ],
      new_password: ['', ],
      confirm_new_password: ['', ],
    })

  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // console.log('data',this._data);
    this.formData.reset();
    this.formData.patchValue({
      id: this._data

  });


  validator: ConfirmPasswordValidator("new_password", "confirm_new_password")

  }

  discard(): void {

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


  ChangePwd(): void {
    this.submitted = true;
    this.flashMessage = null;
    this.flashErrorMessage = null;
    // Return if the form is invalid
    if (this.formData.invalid) {
      return;
    }
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      "title": "เปลี่ยนรหัสผ่าน",
      "message": "คุณต้องการยืนยันการเปลี่ยนรหัสผ่านใช่หรือไม่ ",
      "icon": {
        "show": false,
        "name": "heroicons_outline:exclamation",
        "color": "warning"
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

      if (result === 'confirmed') {

        this._Service.changepassword(this.formData.value, this.formData.value.id).subscribe({
          next: (resp: any) => {
              this._router.navigateByUrl('').then(() => { })
              this.onClose();
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
      })
    }

    })

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

  onClose() {
    this.dialogRef.close();
}
}
