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
import { AssetType, CustomerPagination } from '../item.types';
import { ItemService } from '../item.service';
import { ItemTypeService } from '../../item-type/item-type.service';
import { LocationService } from '../../location/location.service';
import { VendorService } from '../../vendor/vendor.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'modal-item',
    templateUrl: './modal-item.component.html',
    styleUrls: ['./modal-item.component.scss'],
    animations: fuseAnimations
})

export class ModalItem implements OnInit, AfterViewInit, OnDestroy {
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
    pagination: CustomerPagination;

    formFilter: FormGroup;
    columns = [{
        name: 'name',
        item_id: 'item_id',
        unit_price: 'unit_price',
        qty: 'qty'
    }];
    filterData = [];
    dataRow = [];
    rawDataFilter: any[] = []
    /**
     * Constructor
     */
    constructor(
        @Inject(MAT_DIALOG_DATA) private _data,
        private _matDialogRef: MatDialogRef<ModalItem>,
        public dialogRef: MatDialogRef<ModalItem>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _router: Router,

        private _Service: ItemService,
        private _ServiceItemtemType: ItemTypeService,
        private _ServiceLocation: LocationService,
        private _ServiceVendor: VendorService,
        private _ServiceItem: ItemService

    ) {

        this.formData = this._formBuilder.group({
            filter: '',
            item_type_id: '',
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
            item_type_id: null,
        })

        this._ServiceItemtemType.getItemType().subscribe((resp: any) => {
            this.itemtypeData = resp.data;
        })

    }

    onChangeItemType(e): void {

        // console.log(e)
        this._ServiceItem.getByItemType(e).subscribe((resp: any) => {
            this.dataRow = resp.data;
            this.rawDataFilter = this.dataRow
            console.log(resp.data);
        })

    }

    addProduct(e): void {

        this.dialogRef.close(e)
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
        this.dataRow = this.rawDataFilter.filter(function (item) {
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
            item_id: e.name,
            qty: '1',
            price: e.price,
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

}
