import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, ChannelPagination } from '../channel.types';
import { ChannelService } from '../channel.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
  selector: 'app-new-channel',
  templateUrl: './new-channel.component.html',
  styleUrls: ['./new-channel.component.scss'],

  animations: fuseAnimations
})

export class NewChannelComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

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
  pagination: ChannelPagination;

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: FormBuilder,
    private _Service: ChannelService,
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
  ngOnInit(): void {

    this.formData = this._formBuilder.group({
      name: ['', Validators.required],
      image: ['',]
    })

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


  newChannel(): void {
    this.flashMessage = null;
    this.flashErrorMessage = null;
    // Return if the form is invalid
    // if (this.formData.invalid) {
    //     return;
    // }
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      "title": "สร้างช่องทางการขายใหม่",
      "message": "คุณต้องการสร้างช่องทางการขายใหม่ใช่หรือไม่ ?",
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

        // Disable the form
        // this.formData.disable();

        console.log('formdata',this.formData.value);

        const formData = new FormData();
        Object.entries(this.formData.value).forEach(
          ([key, value]: any[]) => {
            formData.append(key, value);
          }
        );
        this._Service.newchannel(formData).subscribe({
          next: (resp: any) => {
            this.showFlashMessage('success');
            this._router.navigateByUrl('channel/list').then(() => {

            });
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
        // Sign in
        // this._Service.createUser(this.userForm.value)
        //     .subscribe({
        //         next: (res) => {
        //             console.log(res);
        //         },
        //         error: (err: HttpErrorResponse) => {
        //             this.userForm.enable();
        //             this.flashMessage = 'error';

        //             if (err.error.error['message'] === 'This attribute must be unique') {
        //                 this.flashErrorMessage = 'Username is already';
        //             } else {
        //                 this.flashErrorMessage = err.error.error['message'];
        //             }
        //         },
        //         complete: () => {
        //             this._location.back();
        //         },
        //     }
        //     );


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
