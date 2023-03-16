import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
    debounceTime,
    map,
    merge,
    Observable,
    Subject,
    switchMap,
    takeUntil,
} from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, BranchPagination } from '../item-return.types';
import { ItemReturnService } from '../item-return.service';
import { SaleOrderService } from '../../sale-order/sale-order.service';

@Component({
    selector: 'app-add-tracking',
    templateUrl: './add-tracking.component.html',
    styleUrls: ['./add-tracking.component.scss'],
})
export class AddTrackingComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    warehouseData: any;

    statusData = [
        { id: 0, name: 'ปิดการใช้งาน' },
        { id: 1, name: 'เปิดการใช้งาน' },
    ];
    // branchId = 2;
    warehouseId: string;

    formData: FormGroup;
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
        public dialogRef: MatDialogRef<AddTrackingComponent>,
        @Inject(MAT_DIALOG_DATA) private _data,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: ItemReturnService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _ServiceOrder: SaleOrderService,
    ) {
        this.formData = this._formBuilder.group({
            name: '',
            id: '',
            order_id: ['', Validators.required],
            track_no: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        // this.warehouseId = this._activatedRoute.snapshot.paramMap.get('id');
        // this._Service.getWarehouseById(this._data.itemid).subscribe((resp: any) => {
        //     this.warehouseData = resp.data
        //     this.formData.patchValue({
        //         name: this.warehouseData.name,
        //         code: this.warehouseData.code,
        //         wh_telephone: this.warehouseData.wh_telephone,
        //         wh_address: this.warehouseData.wh_address,
        //         wh_description: this.warehouseData.wh_description,
        //         status: this.warehouseData.status,
        //     });
        // });

        this.formData.patchValue({
            id: this._data.id,
            name: this._data.name,
            order_id: this._data.order_id,
            track_no: '',
        });
    }

    GetBranch(): void {}

    discard(): void {}

    ngAfterViewInit(): void {}

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
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
                      this.Delivery(this.formData.value.id);
                    },
                    error: (err: any) => {
                        this._fuseConfirmationService.open({
                            title: 'พบข้อผิดพลาด',
                            message: 'กรุณาระบุข้อมูลให้ครบถ้วน และทำรายการอีกครั้ง',
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

    Delivery(orderId): void {
        this._ServiceOrder.confirmorder(orderId, 'delivery').subscribe({
            next: (resp: any) => {
                this.dialogRef.close();
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

    onClose() {
        this.dialogRef.close();
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
