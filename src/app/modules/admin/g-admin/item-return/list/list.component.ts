import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { AssetType, BranchPagination, DataWarehouse } from '../item-return.types';
import { ItemReturnService } from '../item-return.service';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from '../../item/item.types';
import { DataTableDirective } from 'angular-datatables';
import { NewComponent } from '../new/new.component';
import { EditComponent } from '../edit/edit.component';
import { SaleOrderService } from '../../sale-order/sale-order.service';
import { AddTrackingComponent } from '../add-tracking/add-tracking.component';

@Component({
    selector: 'item-return',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    animations: fuseAnimations
})

export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<any>();
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dtOptionsList: DataTables.Settings = {};
    public dtOptionsPacking: DataTables.Settings = {};

    dataRow: any[] = [];
    @ViewChild(MatPaginator) _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    displayedColumns: string[] = ['id', 'name', 'code', 'status', 'create_by', 'created_at', 'actions'];
    dataSource: MatTableDataSource<DataWarehouse>;

    products$: Observable<any>;
    asset_types: AssetType[];
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;

    supplierId: string | null;
    pagination: BranchPagination;

    public total_pc = 0;
    dataRow_pc: any = []
    position: number;
    weight: number;
    symbol: string;
    line: string;
    facebook: string;
    sp: string;
    tiktok: string;

    totalPacking = 0;
    totalReturn = 0;
    totalDelivery = 0;

    constructor(

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
    }

    ngOnInit(): void {
        this.loadTableReturn();
        this.loadTablePacking();
        this.loadDelivery();
        
        this.line = 'assets/images/line.png'
        this.tiktok = 'assets/images/tiktok.png'
        this.facebook = 'assets/images/facebook.png'
        this.sp = 'assets/images/sp.png'
    }

    view(itemId): void {
        this._router.navigate(['item-return/view-order-detail/' + itemId]);
    }
    
    print(orderId: string): void {
        // console.log('log', orderId)
        this._router.navigate(['item-return/print-order-detail/' + orderId]);
    }


    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
    loadTableReturn(): void {

        const that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                // dataTablesParameters.item_type_id = 1;
                that._Service.itemRetrunProduct(dataTablesParameters).subscribe((resp) => {
                    this.dataRow = resp.data;
                    this.totalReturn = resp.total;
                    console.log("Return", resp);
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
                    if (resp.current_page > 1) {
                        this.pages.begin = resp.per_page * resp.current_page - 1;
                    } else {
                        this.pages.begin = 0;
                    }
                    callback({
                        recordsTotal: resp.total,
                        recordsFiltered: resp.total,
                        data: []
                    });
                    this._changeDetectorRef.markForCheck();
                })
            },
            columns: [
                { data: 'actice', orderable: false },
                { data: 'id' },
                { data: 'image' },
                // { data: 'order_id' },
                // { data: 'name' },
                // { data: 'status' },
                { data: 'description' },
                { data: 'create_by' },
                { data: 'create_at' },
            ]
        };

    }

    // pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
    loadTablePacking(): void {
        const that = this;
        this.dtOptionsPacking = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'packing';
                that._ServiceOrder.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_pc = resp.data
                    this.total_pc = resp.total;
                    this.totalPacking = resp.total;
                    // console.log(resp.total, 'resp')
                    this.pages.current_page = resp.current_page;
                    this.pages.last_page = resp.last_page;
                    this.pages.per_page = resp.per_page;
                    if (resp.current_page > 1) {
                        this.pages.begin = resp.per_page * resp.current_page - 1;
                    } else {
                        this.pages.begin = 0;
                    }
                    callback({
                        recordsTotal: resp.total,
                        recordsFiltered: resp.total,
                        data: []
                    });
                    this._changeDetectorRef.markForCheck();
                })
            },
            columns: [
                { data: 'actice', orderable: false },
                { data: 'id' },
                { data: 'channal' },
                { data: 'date_time' },
                { data: 'order_id' },
                { data: 'name' },
                { data: 'status' },
                // { data: 'delivery_by_id' },
                { data: 'payment_type' },
                { data: 'total' },
                { data: 'payment_qty' },
            ]
        };

    }

    loadDelivery(): void {
        let body = {
            "status":"delivery",
            "draw": 1,
            "columns": [
                
            ],
            "order": [
                {
                    "column": 0,
                    "dir": "asc"
                }
            ],
            "start": 0,
            "length": 25,
            "search": {
                "value": "",
                "regex": false
            }
        };

        this._ServiceOrder.getsaleorderPage(body).subscribe((resp : any) => {
            console.log('delivery', resp);
            this.totalDelivery = resp.total;
        });
    }


    changeStatus(): void {
        const confirmation = this._fuseConfirmationService.open({
            "title": "คุณแพ็คเรียบร้อยใช่หรือไม่",
            "message": "กรุณาแพ็คให้เรียบร้อยก่อนเปลี่ยนสถานะ",

            "icon": {
                "show": false,
                "name": "heroicons_outline:exclamation",
                "color": "info"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "แพ็คเรียบร้อย",
                    "color": "primary"
                },

                "cancel": {
                    "show": true,
                    "label": "ยกเลิก",
                }
            },
            "dismissible": true
        });
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
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }



    /**
     * Show flash message
     */
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




    Edit(itemId) {
        console.log(itemId);
        const dialogRef = this._matDialog.open(EditComponent, {
            width: '600px',
            height: 'auto',
            data: {
                itemId: itemId
            }
        });
        dialogRef.afterClosed().subscribe(item => {
            this.rerender();
            this._changeDetectorRef.markForCheck();
        });
    }


    New() {
        const dialogRef = this._matDialog.open(NewComponent, {
            width: '600px',
            height: 'auto',
        });

        dialogRef.afterClosed().subscribe(item => {
            this.rerender();
            window.location.reload()
            this._changeDetectorRef.markForCheck();
        });
    }


    AddTracking(itemRow) {
        console.log(itemRow);

        const dialogRef = this._matDialog.open(AddTrackingComponent, {
            width: '700px',
            height: '480px',
            data: {
                id: itemRow.id,
                name: itemRow.name,
                order_id: itemRow.order_id,
                date_time: itemRow.date_time
            }
        });

        dialogRef.afterClosed().subscribe(item => {
            this.rerender();
            this._changeDetectorRef.markForCheck();
        });
    }


    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    Delete(id) {

        const confirmation = this._fuseConfirmationService.open({
            "title": "ลบข้อมูลสินค้าตีกลับ",
            "message": "คุณต้องการลบข้อมูลสินค้าตีกลับ ใช่หรือไม่ ?",
            "icon": {
                "show": true,
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
                this._Service
                    .deleteitemRetrun(id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((res: any) => {
                        if (res.code == 201) {
                            this._fuseConfirmationService.open({
                                "title": "ลบข้อมูล",
                                "message": "บันทึกเรียบร้อย",
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:check-circle",
                                    "color": "success"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "ตกลง",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "ยกเลิก"
                                    }
                                },
                                "dismissible": true
                            }).afterClosed().subscribe((res) => {
                                this.rerender();
                                this.loadTableReturn();
                            })
                        }
                    });

            }
        });

    }

}
