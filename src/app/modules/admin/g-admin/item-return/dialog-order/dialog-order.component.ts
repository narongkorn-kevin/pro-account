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
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    RequiredValidator,
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
import {
    AssetType,
    BranchPagination,
    DataWarehouse,
} from '../item-return.types';
import { ItemReturnService } from '../item-return.service';
import { SaleOrderService } from '../../sale-order/sale-order.service';

@Component({
    selector: 'app-dialog-order',
    templateUrl: './dialog-order.component.html',
    styleUrls: ['./dialog-order.component.scss'],
    animations: fuseAnimations,
})
export class DialogOrderComponent implements OnInit, AfterViewInit, OnDestroy {
    itemtypeData: any = [];
    locationData: any = [];
    files: File[] = [];
    isLoading: boolean = false;
    pagination: BranchPagination;
    formData: FormGroup;
    formFilter: FormGroup;
    columns = [
        {
            id: 'id',
            date_time: 'date_time',
            order_id: 'order_id',
            name: 'name',
            telephone: 'telephone',
        },
    ];
    filterData = [];
    dataRow: any;
    rawDataFilter: any[] = [];

    constructor(
        private _matDialogRef: MatDialogRef<DialogOrderComponent>,
        @Inject(MAT_DIALOG_DATA) private _data,
        public dialogRef: MatDialogRef<DialogOrderComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: ItemReturnService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _ServiceOrder: SaleOrderService
    ) {
        this.formData = this._formBuilder.group({
            filter: '',
        });
    }

    ngOnInit(): void {
       // แสดงข้อมูล ใบสั่งซื้อที่สถานะ กำลังส่งเท่านั้น
        let body = {
            status: 'delivery',
            draw: 1,
            columns: [],
            order: [
                {
                    column: 0,
                    dir: 'asc',
                },
            ],
            start: 0,
            length: 25,
            search: {
                value: '',
                regex: false,
            },
        };
        this._ServiceOrder.getsaleorderPage(body).subscribe((resp: any) => {
            this.dataRow = resp.data;
            this.rawDataFilter = this.dataRow;
            console.log('dataRow',this.dataRow)
        });
    }

    submit(e): void {
        // console.log('e',e)
        this.dialogRef.close(e);
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
                    if (
                        item[keys[i]].toString().toLowerCase().indexOf(val) !==
                            -1 ||
                        !val
                    ) {
                        // ส่งคืนตัวที่เจอ
                        return true;
                    }
                }
            }
        });
        // console.log('this.BomData', this.BomData);
    }

    ngAfterViewInit(): void {}

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        // this.addItem();
    }
}
