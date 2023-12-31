import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, BranchPagination } from '../leave.types';
import { LeaveService } from '../leave.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'new-leave',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.scss'],
    //     `
    //     table{
    //         width: 100%;
    //        }

    //     .bg-gray-50{
    //         background:#FEEDEE !important;
    //         font-weight:bold !important;
    //         padding:5px;
    //     }

    //     .mat-dialog-container .mat-stroked-button{
    //         border:unset !important;
    //     }

    //     .btn-add-asset{
    //         border-radius: 5px !important;
    //         background:#ffffff !important;
    //         border:2px solid #F43F5E !important;
    //         color:#F43F5E !important;
    //         width:100% !important;
    //     }

    //     .mat-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label.mat-tab-label-active{
    //         background-color:#ffffff !important;
    //         border-top:2px solid red !important;
    //         color:red !important
    //     }

    //     .mat-tab-group .mat-tab-header .mat-tab-label-container .mat-tab-list .mat-tab-labels .mat-tab-label{
    //         background-color:#ccc !important;
    //         border-radius:0px !important;
    //     }

    //     /* ::ng-deep .mat-form-field-flex {
    //             border-width: 1px !important;
    //         } */
    //     `

    // ],
    // encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})

export class NewComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;


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
    pagination: BranchPagination;

    /**
     * Constructor
     */
    constructor(
        public dialogRef: MatDialogRef<NewComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: LeaveService,
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
        })
    }

    onClose() {
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


    New(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        const confirmation = this._fuseConfirmationService.open({
            "title": "สร้างประเภทวันลาใหม่",
            "message": "คุณต้องการสร้างประเภทวันลาใหม่ใช่หรือไม่ ?",
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
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                console.log(this.formData.value);
                let formValue = this.formData.value;

                this._Service.newLeave(formValue).subscribe(
                    {
                        next: (resp: any) => {
                            this.dialogRef.close()
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
                        }
                    }
                )
            }
        });
    }
}
