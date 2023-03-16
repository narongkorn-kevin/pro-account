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
import { AssetType, BranchPagination } from '../item-return.types';
import { ItemReturnService } from '../item-return.service';
import { DialogOrderComponent } from '../dialog-order/dialog-order.component';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'item-return',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})

export class NewComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    warehouseData: any;

    statusData = [
        { id: 0, name: 'ปิดการใช้งาน' },
        { id: 1, name: 'เปิดการใช้งาน' },
    ]
    // branchId = 2;
    warehouseId: string;

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
    url: any = [];
    supplierId: string | null;
    pagination: BranchPagination;

    files: File[] = [];

    constructor(
        public dialogRef: MatDialogRef<NewComponent>,
        @Inject(MAT_DIALOG_DATA) private _data,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: ItemReturnService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
    ) {

        this.formData = this._formBuilder.group({
            order_id: ['', Validators.required],
            name: '',
            customer_phone: '',
            description: '',
            image: ['',]
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
    }

    GetBranch(): void {

    }

    discard(): void {

    }

    ngAfterViewInit(): void {

    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    DialogCustomer() {
        let itemData = this.formData.value.item_line;
        // console.log(this.depositsForm.value.deposit[i]);
        const dialogRef = this._matDialog.open(DialogOrderComponent, {
            width: '900px',
            height: '750px',
        });

        //  ปิด Dialog พร้อมรับค่า result
        dialogRef.afterClosed().subscribe(item => {
            if (item) {
                itemData = {
                    id: item.id,
                    name: item.name,
                    telephone: item.telephone,
                    date_time: item.date_time,
                    order_id: item.order_id,
                };

                this.formData.patchValue({
                    order_id: itemData.order_id,
                    // name: itemData.name,
                    // customer_phone: itemData.telephone,
                });
            }
        });
    }

    EditRetrun(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        const confirmation = this._fuseConfirmationService.open({
            "title": "ยืนยันตีกลับสินค้า",
            "message": "คุณต้องการตีกลับสินค้านี้ ใช่หรือไม่ ?",
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
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                // console.log(this.formData.value);
                // let formValue = this.formData.value;

                console.log('formdata', this.formData.value);

                const formData = new FormData();
                Object.entries(this.formData.value).forEach(
                    ([key, value]: any[]) => {
                        formData.append(key, value);
                    }
                );

                this._Service.AdditemRetrun(formData).subscribe(
                    {
                        next: (resp: any) => {
                            this.showFlashMessage('success');
                            this.dialogRef.close()
                            window.location.reload()
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




    onClose() {
        this.dialogRef.close();
    }

    showFlashMessage(type): void {
        if(type == 'success') {
            this._fuseConfirmationService.open({
                title: 'บันทึกข้อมูลเรียบร้อย',
                message: 'ขอบคุณครับ!!',
                icon: {
                    show: true,
                    name: 'heroicons_outline:check-circle',
                    color: 'success',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ตกลง',
                        color: 'primary',
                    }, 
                    cancel: {
                        show: false,
                        label: 'ยกเลิก',
                    }
                },
                dismissible: true,
            });

            setTimeout(() => {
                this.flashMessage = null;
                this._changeDetectorRef.markForCheck();

                // this.dialogRef.close()
            }, 3000);
        }
        else {
            // error
        }
    }


    // showFlashMessage(type: 'success' | 'error'): void {
    //     // Show the message
    //     this.flashMessage = type;

    //     // Mark for check
    //     this._changeDetectorRef.markForCheck();

    //     // Hide it after 3 seconds
    //     setTimeout(() => {

    //         this.flashMessage = null;

    //         // Mark for check
    //         this._changeDetectorRef.markForCheck();
    //     }, 3000);
    // }

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

    // onChange(event: any): void {
    //     // console.log('')
    //     var reader = new FileReader();
    //     reader.readAsDataURL(event.target.files[0]);
    //     setTimeout(() => {
    //         this._changeDetectorRef.detectChanges()
    //     }, 150)
    //     reader.onload = (e: any) =>
    //     this.url = e.target.result;
    //     const file = event.target.files[0];
    //     this.formData.patchValue({
    //         image: file
    //     });
    //     this._changeDetectorRef.markForCheck();
    // }
}
