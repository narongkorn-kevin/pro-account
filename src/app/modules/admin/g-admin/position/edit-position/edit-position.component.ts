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
import { sortBy, startCase } from 'lodash-es';
import { AssetType, PositionPagination } from '../position.types';
import { PositionService } from '../position.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'edit-position',
    templateUrl: './edit-position.component.html',
    styleUrls: ['./edit-position.component.scss'],
    animations: fuseAnimations
})

export class EditPositionComponent implements OnInit, AfterViewInit, OnDestroy {



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
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }

    supplierId: string | null;
    pagination: PositionPagination;

    /**
     * Constructor
     */
    constructor(
        public dialogRef: MatDialogRef<EditPositionComponent>,
        @Inject(MAT_DIALOG_DATA) private _data,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: PositionService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
    ) {

        this.formData = this._formBuilder.group({
            name: ['', Validators.required],
            status: '',
        })

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // this.positionId = this._activatedRoute.snapshot.paramMap.get('id');
        this._Service.getPositionById(this._data.itemid).subscribe((resp: any) => {
            this.positionData = resp.data;

            this.formData.patchValue({
                name: this.positionData.name,
                status: this.positionData.status
            })
            console.log(this.positionData);
        })


    }

    onClose() {
        this.dialogRef.close()
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


    UpdateBranch(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "แก้ไขตำแหน่ง",
            "message": "คุณต้องการแก้ไขตำแหน่งใช่หรือไม่ ?",
            "icon": {
                "show": true,
                "name": "heroicons_outline:pencil-alt",
                "color": "info"
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
                this._Service.updatePosition(this.formData.value, this._data.itemid).subscribe({
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
