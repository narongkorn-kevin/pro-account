import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { SaleOrderService  } from '../sale-order.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'add-track',
    templateUrl: './add-track.component.html',
    styleUrls: ['./add-track.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
    // animations: fuseAnimations
})

export class AddtrackComponent implements OnInit, AfterViewInit, OnDestroy {
    formData: FormGroup
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    data:any;

    constructor(
        public dialogRef: MatDialogRef<AddtrackComponent>,
        @Inject(MAT_DIALOG_DATA) private _data,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: SaleOrderService ,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
    ) {

        this.formData = this._formBuilder.group({
            name: '',
            id: '',
            order_id: ['', Validators.required],
            track_no: ['', Validators.required],
        });

    }

    ngOnInit(): void {

        this._Service.getsaleorderbyId(this._data.id).subscribe((resp: any) => {
            this.data = resp.data;
            this.formData.patchValue({
                id: this.data.id,
                name: this.data.name,
                order_id: this.data.order_id,
                track_no: '',
            });
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

    add(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        const confirmation = this._fuseConfirmationService.open({
            "title": "สร้างประเภทสินค้าใหม่",
            "message": "คุณต้องการสร้างประเภทสินใหม่ใช่หรือไม่ ?",
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
                this._Service.createTrack(this.formData.value).subscribe({
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

    SaveTrack(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        const confirmation = this._fuseConfirmationService.open({
            title: 'ยืนยันข้อมูลส่งสินค้า',
            message: 'คุณต้องการส่งสินค้าตามหมายเลขพัสดุดังกล่าว ใช่หรือไม่ ?',
            icon: {
                show: true,
                name: 'heroicons_outline:truck',
                color: 'info',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'ยืนยัน',
                    color: 'primary',
                },
                cancel: {
                    show: true,
                    label: 'ยกเลิก',
                },
            },
            dismissible: true,
        });
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                // console.log(this.formData.value);
                let formValue = this.formData.value;

                this._Service.updateTracking(formValue).subscribe({
                    next: (resp: any) => {
                        console.log(resp);
                        this.UpdateDelivery(this.formData.value.id);
                        this.dialogRef.close()
                    },
                    error: (err: any) => {
                        this._fuseConfirmationService.open({
                            title: 'พบข้อผิดพลาด',
                            message:
                                'กรุณาระบุข้อมูลให้ครบถ้วน และทำรายการอีกครั้ง',
                            icon: {
                                show: true,
                                name: 'heroicons_outline:exclamation',
                                color: 'warning',
                            },
                            actions: {
                                confirm: {
                                    show: false,
                                    label: 'ยืนยัน',
                                    color: 'primary',
                                },
                                cancel: {
                                    show: false,
                                    label: 'ยกเลิก',
                                },
                            },
                            dismissible: true,
                        });
                    },
                });
            }
        });
    }

    UpdateDelivery(orderId): void {
        this._Service.confirmorder(orderId, 'delivery').subscribe({
            next: (resp: any) => {
                this._router
                .navigateByUrl('sale-order/list')
                .then(() => {});
            },
            error: (err: any) => {
                this._fuseConfirmationService.open({
                    title: 'พบข้อผิดพลาด เปลี่ยนสถานะกำลังจัดส่ง',
                    message: err.error.message,
                    icon: {
                        show: true,
                        name: 'heroicons_outline:exclamation',
                        color: 'warning',
                    },
                    actions: {
                        confirm: {
                            show: false,
                            label: 'ยืนยัน',
                            color: 'primary',
                        },
                        cancel: {
                            show: false,
                            label: 'ยกเลิก',
                        },
                    },
                    dismissible: true,
                });
                console.log(err.error.message);
            },
        });
    }
}
