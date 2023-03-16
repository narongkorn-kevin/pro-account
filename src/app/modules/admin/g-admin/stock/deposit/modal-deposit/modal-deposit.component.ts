import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
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
import { AssetType, CustomerPagination } from '../deposit.types';
import { DepositService } from '../deposit.service';
// import { ItemTypeService } from '../../item-type/item-type.service';
// import { LocationService } from '../../location/location.service';
// import { VendorService } from '../../vendor/vendor.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'modal-deposit',
    templateUrl: './modal-deposit.component.html',
    styleUrls: ['./modal-deposit.component.scss'],
    animations: fuseAnimations
})

export class ModalItemForDeposit implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    formData: FormGroup;
    formData1: FormGroup;
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

    itemtypeData: any = [];
    locationData: any = [];
    vendorData: any = [];
    files: File[] = [];
    supplierId: string | null;
    pagination: CustomerPagination;

    formFilter: FormGroup;
    columns = [{
        name: 'name',
        code: 'code',
        qty: 'qty',
    }];
    filterData = [];
    rawDataFilter: any[] = [
        { id: 1, code: '123-5535', name: 'ครีมบำรุงผิวมะขามป้อม', qty: '500' },
        { id: 2, code: '123-5536', name: 'วิตามินบำรุงผิว Vit-C', qty: '500' },
        { id: 3, code: '123-5537', name: 'ครีมพอกหน้าอโวคาโด้', qty: '500' },
        { id: 4, code: '123-5538', name: 'ออยล้างเครื่องสำอางออแกนิค', qty: '500' },
        { id: 5, code: '123-5539', name: 'ครีมบำรุงผิวสกัดจากน้ำมะนาว', qty: '500' },
    ]
    rawData: any[] = [
        { id: 1, code: '123-5535', name: 'ครีมบำรุงผิวมะขามป้อม', qty: '500' },
        { id: 2, code: '123-5536', name: 'วิตามินบำรุงผิว Vit-C', qty: '500' },
        { id: 3, code: '123-5537', name: 'ครีมพอกหน้าอโวคาโด้', qty: '500' },
        { id: 4, code: '123-5538', name: 'ออยล้างเครื่องสำอางออแกนิค', qty: '500' },
        { id: 5, code: '123-5539', name: 'ครีมบำรุงผิวสกัดจากน้ำมะนาว', qty: '500' },
    ]

    /**
     * Constructor
     */
    constructor(
        public dialogRef: MatDialogRef<ModalItemForDeposit>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,

        private _Service: DepositService,
        // private _ServiceItemtemType: ItemTypeService,
        // private _ServiceLocation: LocationService,
        // private _ServiceVendor: VendorService,

    ) {

        this.formData = this._formBuilder.group({
            filter: '',
        })
        this.formData1 = this._formBuilder.group({
            item: this._formBuilder.array([]),
        })

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.formData = this._formBuilder.group({
            filter: '',
        })

        // this._ServiceItemtemType.getItemType().subscribe((resp: any) => {
        //     this.itemtypeData = resp.data;
        // })

        // this._ServiceLocation.getLocation().subscribe((resp: any) => {
        //     this.locationData = resp.data;
        // })

        // this._ServiceVendor.getVendor().subscribe((resp: any) => {
        //     this.vendorData = resp.data;
        // })
    }

    addProduct(e): void {
        console.log(e)
        this.addItem(e);
    }

    onClose() {
        this.dialogRef.close();
    }

    onFilter(event) {
        //  console.log('event',event.target.value);
        // ตัวให้เป็นตัวเล็กให้หมด
        let val = event.target.value.toLowerCase();
        // หา ชื่อ คอลัมน์
        let keys = Object.keys(this.columns[0]);
        // หาจำนวนคอลัม
        let colsAmt = keys.length;
        // console.log('keys', keys);
        this.rawData = this.rawDataFilter.filter(function (item) {
            // console.log('item',item);
            for (let i = 0; i < colsAmt; i++) {
                //console.log(colsAmt);
                if (item[keys[i]]) {
                    if (item[keys[i]].toString().toLowerCase().indexOf(val) !== -1 || !val) {
                        // ส่งคืนตัวที่เจอ
                        return true;
                    }
                }
            }
        });
        // console.log('this.BomData', this.BomData);
    }


    item(): FormArray {
        return this.formData1.get('item') as FormArray

    }

    NewItem(e): FormGroup {
        return this._formBuilder.group({
            item_id: e.code,
            item_name: e.name,
        });
    }

    addItem(e): void {
        this.item().push(this.NewItem(e));
    }

    removeItem(i: number): void {
        this.item().removeAt(i);
    }

    onSubmit(): void {
        this.dialogRef.close(this.formData1.value);
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
        // this.addItem();
    }


    createItem(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        // Return if the form is invalid
        // if (this.formData.invalid) {
        //     return;
        // }
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            "title": "สร้างสาขาใหม่",
            "message": "คุณต้องการสร้างสาขาใหม่ใช่หรือไม่ ",
            "icon": {
                "show": false,
                "name": "heroicons_outline:exclamation",
                "color": "warning"
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
                const formData = new FormData();
                Object.entries(this.formData.value).forEach(
                    ([key, value]: any[]) => {
                        formData.append(key, value);
                    }
                );
                this._Service.createItem(formData).subscribe((resp: any) => {
                    this._router.navigateByUrl('item/list').then(() => {
                        window.location.reload();
                    });
                })



            }
        });

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
        console.log(this.formData.value)
    }

    onRemove(event) {
        console.log('1', event);
        this.files.splice(this.files.indexOf(event), 1);
        this.formData.patchValue({
            image: '',
        });
        console.log(this.formData.value)
    }
}
