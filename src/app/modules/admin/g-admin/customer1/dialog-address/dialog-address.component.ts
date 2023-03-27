import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
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
import { AssetType, CustomerPagination } from '../customer.types';
import { CustomerService } from '../customer.service';
import { ItemTypeService } from '../../item-type/item-type.service';
import { LocationService } from '../../location/location.service';
import { VendorService } from '../../vendor/vendor.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'app-dialog-address',
    templateUrl: './dialog-address.component.html',
    styleUrls: ['./dialog-address.component.scss'],
    animations: fuseAnimations
})

export class DialogAddressComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    formData: FormGroup;
    formData1: FormGroup;


    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }

    itemtypeData: any = [];
    locationData: any = [];
    files: File[] = [];
    isLoading: boolean = false;
    pagination: CustomerPagination;

    formFilter: FormGroup;
    columns = [{
        address: 'address'
    }];
    filterData = [];
    dataRow: any;
    dataRow2: any;
    rawDataFilter: any[] = []
    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) private _data,
        private _matDialogRef: MatDialogRef<DialogAddressComponent>,
        public dialogRef: MatDialogRef<DialogAddressComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _router: Router,

        private _Service: CustomerService,
        private _ServiceItemtemType: ItemTypeService,
        private _ServiceLocation: LocationService,
        private _ServiceVendor: VendorService,


    ) {

        this.formData = this._formBuilder.group({
            filter: ''

        });

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // console.log('data',this._data)
        // alert('1')
        this.formData = this._formBuilder.group({
            filter: ''

        });
        this._Service.getCustomerById(this._data).subscribe((resp: any) => {
            this.dataRow = resp.data;
            this.dataRow2 = this.dataRow.main_customer_line
            this.rawDataFilter = this.dataRow2
            console.log('dataRow', this.dataRow2)
        })

    }


    submit(e): void {

        // console.log('e',e)
        this.dialogRef.close(e)
    }

    onClose() {
        this.dialogRef.close();
    }

    onFilter(event) {
        console.log('event', event.target.value);
        // ตัวให้เป็นตัวเล็กให้หมด
        let val = event.target.value.toLowerCase();
        // หา ชื่อ คอลัมน์
        let keys = Object.keys(this.columns[0]);
        console.log(keys)
        // หาจำนวนคอลัม
        let colsAmt = keys.length;
        // console.log('keys', keys);
        this.dataRow2 = this.rawDataFilter.filter(function (item) {
            console.log('item', item);
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


    // item(): FormArray {
    //     return this.formData1.get('item') as FormArray

    // }

    // NewItem(e): FormGroup {
    //     return this._formBuilder.group({
    //         item_id: e.name,
    //         qty: '1',
    //         price: e.price,
    //     });
    // }

    // addItem(e): void {
    //     this.item().push(this.NewItem(e));
    // }

    // removeItem(i: number): void {
    //     this.item().removeAt(i);
    // }

    // onSubmit(): void {
    //     this.dialogRef.close(this.formData1.value);
    // }


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

}
