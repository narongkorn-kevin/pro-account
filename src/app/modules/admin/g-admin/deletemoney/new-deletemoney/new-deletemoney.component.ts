import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { DeletemoneyService } from '../deletemoney.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';
// const userData = JSON.parse(localStorage.getItem("user")) || '';
@Component({
    selector: 'new-deletemoney',
    templateUrl: './new-deletemoney.component.html',
    styleUrls: ['./new-deletemoney.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
    // animations: fuseAnimations
})

export class NewDeletemoneyComponent implements OnInit, AfterViewInit, OnDestroy {
    formData: FormGroup
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    public TypeList: any = [];
    public UserList: any = [];
    
    /**
     * Constructor
     */
    constructor(
        public dialogRef: MatDialogRef<NewDeletemoneyComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: DeletemoneyService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
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
            user_id: ['', Validators.required],
            deduct_type_id: ['', Validators.required],
            price: ['', Validators.required],
            type: ['', Validators.required],
            description: ['', Validators.required],
        });
        this._Service.getType().subscribe((resp: any) => {
            this.TypeList = resp.data;
            this._changeDetectorRef.markForCheck();
        });
        this._Service.getUser().subscribe((resp: any) => {
            this.UserList = resp.data;
            this._changeDetectorRef.markForCheck();
        });

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

    newItemType(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        const confirmation = this._fuseConfirmationService.open({
            "title": "สร้างเงินหัก",
            "message": "คุณต้องการสร้างเงินหักใช่หรือไม่ ?",
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
                console.log(this.formData.value);
                this._Service.createItemType(this.formData.value).subscribe({
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

}
