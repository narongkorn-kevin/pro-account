import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { SaleOrderService } from '../sale-order.service';

// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'submitDialog',
    templateUrl: './submitDialog.component.html',
    styleUrls: ['./submitDialog.component.scss'],

    animations: fuseAnimations
})

export class submitDialogComponent implements OnInit, AfterViewInit, OnDestroy {


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

    BrokerId: any = [];


    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<submitDialogComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: SaleOrderService,
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
        console.log("8945623198465123", this.data);

        // this.formData = this._formBuilder.group({
        //     name: ['', Validators.required]
        // })

        // this._Service.getLastUser().subscribe((resp: any) => {

        //     //  แสดงค่าauto  userid
        //     this.formData.patchValue({
        //         user_id: resp.data.user_last_id ,
        //     })
        // })
        // this.BrokerId = JSON.parse(localStorage.getItem('user'));
        // console.log(this.BrokerId.user_id, 'Broker');
        // this.formData = this._formBuilder.group({
        //     user_id: '',
        //     first_name: ['', Validators.required],
        //     last_name: ['', Validators.required],
        //     permission_id: ['3'],
        //     email: ['', Validators.required],
        //     password: ['', Validators.required,],
        //     image: [''],
        //     user_ref_id: this.BrokerId.id,
        //     tel2: [''],
        //     tel1: [''],
        //     shop_name: [''],
        //     shop_address: [''],

        // })

    }

    onClose(): void {
        this.dialogRef.close();
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
    files: File[] = [];
    onSelect(event) {
        console.log(event);
        this.files.push(...event.addedFiles);
        // Trigger Image Preview
        setTimeout(() => {
            this._changeDetectorRef.detectChanges();
        }, 150);
        this.formData.patchValue({
            image: this.files[0],
        });
        console.log(this.formData.value);
    }
    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        console.log(this.formData.value);
    }


    createsubmitDialog(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "ยืนยันคำสั่งซื้อ",
            "message": "คุณต้องการยืนยันคำสั่งซื้อใช่หรือไม่ ?",
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
                const formData = new FormData();
                Object.entries(this.formData.value).forEach(([key, value]: any[]) => {
                    if (value !== '' && value !== 'null' && value !== null) {
                        formData.append(key, value);
                    }
                });

                this._Service.postConfirmOrder(this.data.data).subscribe({
                    next: (resp: any) => {
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
                })
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

}
