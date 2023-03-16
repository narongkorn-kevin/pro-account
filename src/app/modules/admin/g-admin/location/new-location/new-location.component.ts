import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationService } from '../location.service';
import { WarehouseService } from '../../warehouse/warehouse.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'new-location',
    templateUrl: './new-location.component.html',
    styleUrls: ['./new-location.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    // animations: fuseAnimations
})

export class NewLocationComponent implements OnInit, AfterViewInit, OnDestroy {
    warehouseData: any = [];
    formData: FormGroup
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: LocationService,
        private _ServiceWarehouse: WarehouseService,
        private _matDialog: MatDialog,
        public dialogRef: MatDialogRef<NewLocationComponent>,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {

        this.formData = this._formBuilder.group({
            name: '',
            code: '',
            warehouse_id: '',
        })

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this._ServiceWarehouse.getWarehouse().subscribe((resp: any) => {
            this.warehouseData = resp.data;
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
            "title": "สร้างสถานที่ใหม่",
            "message": "คุณต้องการสร้างสถานที่ใหม่ใช่หรือไม่ ?",
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
                this._Service.createLocation(this.formData.value).subscribe({
                    next: (res: any) => {
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
                })
            }
        });

    }


}
