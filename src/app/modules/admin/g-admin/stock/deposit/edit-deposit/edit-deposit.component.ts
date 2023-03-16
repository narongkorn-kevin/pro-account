import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { AssetType, CustomerPagination } from '../deposit.types';
import { DepositService } from '../deposit.service';
import { VendorService } from '../../../vendor/vendor.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'edit-deposit',
    templateUrl: './edit-deposit.component.html',
    styleUrls: ['./edit-deposit.component.scss'],
    animations: fuseAnimations
})

export class EditDepositComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    customerId: string
    dataRow: any = [];
    statusData = [
        { id: 0, name: 'ปิดการใช้งาน' },
        { id: 1, name: 'เปิดการใช้งาน' },
    ]

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
    pagination: CustomerPagination;
    vendorData: any = [];
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: DepositService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _ServiceVendor: VendorService,
    ) {

        this.formData = this._formBuilder.group({
            // item_type_id: 2,
            date: '',
            po_number: ['', Validators.required],
            vendor_id: ['', Validators.required],
            deposit: this._formBuilder.array([
            ])

        })

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        // this._ServiceVendor.getVendor().subscribe((resp: any) => {
        //     this.vendorData = resp.data;
        // })
        this.customerId = this._activatedRoute.snapshot.paramMap.get('id');
        this._Service.getItemById(this.customerId).subscribe((resp: any) => {
            this.dataRow = resp.data
            console.log(resp.data)
            this._changeDetectorRef.markForCheck();
            this.formData.patchValue({
                date: this.dataRow.date,
                po_number: this.dataRow.report_id,
                vendor_id: '1',
            })
            const formValue = this.formData.get('deposit') as FormArray;
            this.dataRow.item_trans.map(element => {
                formValue.push(this._formBuilder.group({
                    code: element.item.item_id,
                    item_id: element.item.id,
                    item_name: element.item.name,
                    qty: element.qty,
                    location_1_id: element.location_1 ? element.location_1.id : null,
                    location_1_name: element.location_1 ? element.location_1.name : null,
                }))

            })
            console.log(this.formData.value)
        })
        this._changeDetectorRef.markForCheck();
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
    deposit(): FormArray {
        return this.formData.get('deposit') as FormArray

    }

    NewItem(): FormGroup {

        // return this._formBuilder.group({
        //     item_id: e.item_id,
        //     qty: e.qty,
        //     price: e.price,
        // });
        return this._formBuilder.group({
            code: '',
            item_id: '',
            item_name: '',
            qty: '',
            location_1_id: '',
            location_1_name: '',
        });


    }

    addItem(): void {
        this.deposit().push(this.NewItem());
        console.log(this.formData.value)
        // alert(1)
    }

    removeItem(i: number): void {
        this.deposit().removeAt(i);
    }

    Approve(data): void {
        console.log(data)


        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }

        let confirmation;
        if(data == "Reject") {
            // Open the confirmation dialog
            confirmation = this._fuseConfirmationService.open({
                "title": "ยืนยันใบนำเข้าสินค้า",
                "message": "คุณไม่อนุมัตินำเข้าสินค้าใช่หรือไม่ ?",
                "icon": {
                    "show": true,
                    "name": "heroicons_outline:clipboard-check",
                    "color": 'error',
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
        }
        else {
            // Open the confirmation dialog
            confirmation = this._fuseConfirmationService.open({
                "title": "ยืนยันใบนำเข้าสินค้า",
                "message": "คุณอนุมัตินำเข้าสินค้าใช่หรือไม่ ?",
                "icon": {
                    "show": true,
                    "name": "heroicons_outline:clipboard-check",
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
        }

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {

            // If the confirm button pressed...
            if (result === 'confirmed') {
                this._Service.approve(data, this.customerId).subscribe({
                    next: (resp: any) => {
                        this.showFlashMessage('success');
                        this._router.navigateByUrl('stock/deposit/list').then(() => {

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
