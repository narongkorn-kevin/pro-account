import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
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
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import {
    AssetType,
    DataSaleOrder,
    saleOrderPagination,
} from '../sale-order.types';
import { SaleOrderService } from '../sale-order.service';
import { MatTableDataSource } from '@angular/material/table';
import { submitDialogComponent } from '../submitDialog/submitDialog.component';
import { DataTableDirective } from 'angular-datatables';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class SaleOrderListComponent
    implements OnInit, AfterViewInit, OnDestroy
{
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    displayedColumns: string[] = [
        'id',
        'first_name',
        'last_name',
        'email',
        'status',
        'create_by',
        'created_at',
        'actions',
    ];

    dataSource: MatTableDataSource<DataSaleOrder>;
    name: string;
    public total_t = 0;
    public total_o = 0;
    public total_p = 0;
    public total_c = 0;
    public total_d = 0;
    public total_f = 0;
    public total_reject = 0;
    public total_pc = 0;
    position: number;
    weight: number;
    symbol: string;
    line: string;
    facebook: string;
    sp: string;
    tiktok: string;
    dataRow_t: any = [];
    dataRow_o: any = [];
    dataRow_p: any = [];
    dataRow_c: any = [];
    dataRow_pc: any = [];
    dataRow_d: any = [];
    dataRow_reject: any = [];
    dataRow_f: any = [];
    public dtOptionsTotal: DataTables.Settings = {};
    public dtOptionsOrder: DataTables.Settings = {};
    public dtOptionsPaid: DataTables.Settings = {};
    public dtOptionsCondition: DataTables.Settings = {};
    public dtOptionsConfirm: DataTables.Settings = {};
    public dtOptionsDelivery: DataTables.Settings = {};
    public dtOptionsPacking: DataTables.Settings = {};
    public dtOptionsFinish: DataTables.Settings = {};
    public dtOptionsReject: DataTables.Settings = {};
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

    me: any | null;
    get roleType(): string {
        return 'marketing';
    }

    supplierId: string | null;
    pagination: saleOrderPagination;

    allComplete_all: boolean = false;
    allComplete_notfinish: boolean = false;
    allComplete_finish: boolean = false;
    allComplete_condition: boolean = false;
    allComplete_submit: boolean = false;

    ConfirmOrder1: any = [];
    ConfirmOrder2: any = [];
    ConfirmOrder3: any = [];
    DelOrder: any = [];

    delivered_by: any;
    delivered: any = [];

    flashErrorMessage: string;

    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: SaleOrderService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService
    ) {}

    tickConfirmOrder(event: any, id: any, No: any) {
        switch (No) {
            case 1:
                if (event.checked === true) {
                    this.ConfirmOrder1.push(id);
                    console.log(event, 'test');
                    console.log(id, 'test');
                    console.log(this.ConfirmOrder1, 'test1');
                } else {
                    const index = this.ConfirmOrder1.findIndex(
                        (item) => item === id
                    );
                    if (index !== -1) {
                        this.ConfirmOrder1.splice(index, 1);
                    }
                    console.log(this.ConfirmOrder1, 'test....1');
                }

                break;
            case 2:
                if (event.checked === true) {
                    this.ConfirmOrder2.push(id);
                    console.log(event, 'test');
                    console.log(id, 'test');
                    console.log(this.ConfirmOrder2, 'test2');
                } else {
                    const index = this.ConfirmOrder2.findIndex(
                        (item) => item === id
                    );
                    if (index !== -1) {
                        this.ConfirmOrder2.splice(index, 1);
                    }
                    console.log(this.ConfirmOrder2, 'test....2');
                }
                break;

            case 3:
                if (event.checked === true) {
                    this.ConfirmOrder3.push(id);
                    console.log(event, 'test');
                    console.log(id, 'test');
                    console.log(this.ConfirmOrder3, 'test3');
                } else {
                    const index = this.ConfirmOrder3.findIndex(
                        (item) => item === id
                    );
                    if (index !== -1) {
                        this.ConfirmOrder3.splice(index, 1);
                    }
                    console.log(this.ConfirmOrder3, 'test....3');
                }
                break;

            default:
                break;
        }
    }
    tickAllConfirmOrder(event: any, item: any, No: any) {
        switch (No) {
            case 1:
                this.allComplete_notfinish = event.checked;

                if (event.checked === true) {
                    this.ConfirmOrder1 = [];
                    for (let i = 0; i < item.length; i++) {
                        const element = item[i];

                        this.ConfirmOrder1.push(element.id);
                        console.log(event, 'test');
                        console.log(element, 'test');
                    }
                    console.log(this.ConfirmOrder1, 'test1');
                } else {
                    this.ConfirmOrder1 = [];
                    console.log(this.ConfirmOrder1, 'test....1');
                }
                break;

            case 2:
                this.allComplete_finish = event.checked;

                if (event.checked === true) {
                    this.ConfirmOrder2 = [];
                    for (let i = 0; i < item.length; i++) {
                        const element = item[i];

                        this.ConfirmOrder2.push(element.id);
                        console.log(event, 'test');
                        console.log(element, 'test');
                    }
                    console.log(this.ConfirmOrder2, 'test2');
                } else {
                    this.ConfirmOrder2 = [];
                    console.log(this.ConfirmOrder2, 'test....2');
                }
                break;

            case 3:
                this.allComplete_condition = event.checked;

                if (event.checked === true) {
                    this.ConfirmOrder3 = [];
                    for (let i = 0; i < item.length; i++) {
                        const element = item[i];

                        this.ConfirmOrder3.push(element.id);
                        console.log(event, 'test');
                        console.log(element, 'test');
                    }
                    console.log(this.ConfirmOrder3, 'test3');
                } else {
                    this.ConfirmOrder3 = [];
                    console.log(this.ConfirmOrder3, 'test....3');
                }
                break;

            default:
                break;
        }
    }

    tickDelOrder(event: any, id: any) {
        if (event.checked === true) {
            this.DelOrder.push(id);
            console.log(event, 'test');
            console.log(id, 'test');
            console.log(this.DelOrder, 'test');
        } else {
            const index = this.DelOrder.findIndex((item) => item === id);
            if (index !== -1) {
                this.DelOrder.splice(index, 1);
            }
            console.log(this.DelOrder, 'test....');
        }
    }
    tickAllDelOrder(event: any, item: any) {
        this.allComplete_submit = event.checked;

        if (event.checked === true) {
            this.DelOrder = [];
            for (let i = 0; i < item.length; i++) {
                const element = item[i];

                this.DelOrder.push(element.id);
                console.log(event, 'test');
                console.log(element, 'test');
            }
            console.log(this.DelOrder, 'test');
        } else {
            this.DelOrder = [];
            console.log(this.DelOrder, 'test....');
        }
    }

    confirmOrder(No: any) {
        switch (No) {
            case 1:
                var data = this.ConfirmOrder1;
                break;
            case 2:
                var data = this.ConfirmOrder2;
                break;
            case 3:
                var data = this.ConfirmOrder3;
                break;

            default:
                break;
        }
        if (data !== null) {
            this.flashMessage = null;
            this.flashErrorMessage = null;

            const confirmation = this._fuseConfirmationService.open({
                title: 'ยืนยันคำสั่งซื้อ',
                message: 'คุณต้องการยืนยันคำสั่งซื้อใช่หรือไม่ ?',
                icon: {
                    show: true,
                    name: 'heroicons_outline:plus-circle',
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

            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                // If the confirm button pressed...
                if (result === 'confirmed') {
                    const formData = new FormData();

                    this._Service.postConfirmOrder(data).subscribe({
                        next: (resp: any) => {
                            // this.dialogRef.close();
                            this.rerender();
                            this._changeDetectorRef.markForCheck();
                        },
                        error: (err: any) => {
                            this._fuseConfirmationService.open({
                                title: 'กรุณาระบุข้อมูล',
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
            });
        }
        // dialogRef.afterClosed().subscribe((item) => {
        this.rerender();
        this._changeDetectorRef.markForCheck();
        // });
    }
    createsubmitDialog(): void {}

    DelMulOrder() {
        if (this.DelOrder !== null) {
            this._Service
                .postDelMulOrder(this.DelOrder, this.delivered_by)
                .subscribe((res) => {
                    // console.log('pack', res);
                });
            this._changeDetectorRef.markForCheck();

            this.flashMessage = null;
            this.flashErrorMessage = null;

            const confirmation = this._fuseConfirmationService.open({
                title: 'ยืนยันคำสั่งซื้อ',
                message: 'คุณต้องการยืนยันคำสั่งซื้อใช่หรือไม่ ?',
                icon: {
                    show: true,
                    name: 'heroicons_outline:plus-circle',
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

            // Subscribe to the confirmation dialog closed action
            confirmation.afterClosed().subscribe((result) => {
                // If the confirm button pressed...
                if (result === 'confirmed') {
                    const formData = new FormData();

                    this._Service
                        .postDelMulOrder(this.DelOrder, this.delivered_by)
                        .subscribe({
                            next: (resp: any) => {
                                // this.dialogRef.close();
                                this.rerender();
                                this._changeDetectorRef.markForCheck();
                            },
                            error: (err: any) => {
                                this._fuseConfirmationService.open({
                                    title: 'กรุณาระบุข้อมูล',
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
            });
        }
        // dialogRef.afterClosed().subscribe((item) => {
        this.rerender();
        this._changeDetectorRef.markForCheck();
        // });
    }

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    ngOnInit(): void {
        this.loadTableTotal();
        this.loadTableOrder();
        this.loadTablePaid();
        this.loadTableCondition();
        this.loadTableConfirm();
        this.loadTablePacking();
        this.loadTableDelivery();
        this.loadTableFinish();
        this.loadTableReject();
        this.line = 'assets/images/line.png';
        this.tiktok = 'assets/images/tiktok.png';
        this.facebook = 'assets/images/facebook.png';
        this.sp = 'assets/images/sp.png';
        // console.log('stest',this.line)

        this.ConfirmOrder1 = [];
        this.ConfirmOrder2 = [];
        this.ConfirmOrder3 = [];
        this.DelOrder = [];

        this._Service.get_delivered_by().subscribe((res) => {
            console.log('del data', res);
            this.delivered = res;
            console.log('delivered data', this.delivered);
        });

        this._changeDetectorRef.markForCheck();

    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };

    loadTableTotal(): void {
        const that = this;
        this.dtOptionsTotal = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[4, 'desc']],
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                // dataTablesParameters.status = 1;
                that._Service
                    .getsaleorderPage(dataTablesParameters)
                    .subscribe((resp) => {
                        this.dataRow_t = resp.data;
                        this.total_t = resp.total;
                        console.log(this.dataRow_t, 'resp');
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }
                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
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

                { data: 'payment_qty' },
                { data: 'payment_qty' },
            ],
        };
    }

    loadTableOrder(): void {
        const that = this;
        this.dtOptionsOrder = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[4, 'desc']],

            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'order';
                that._Service
                    .getsaleorderPage(dataTablesParameters)
                    .subscribe((resp) => {
                        this.dataRow_o = resp.data;
                        this.total_o = resp.total;
                        console.log(this.dataRow_o, 'resp');
                        console.log(resp.total, 'resp.total');
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }
                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
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
            ],
        };
    }
    // pagespaid = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }

    loadTablePaid(): void {
        const that = this;
        this.dtOptionsPaid = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[4, 'desc']],

            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'paid';
                that._Service
                    .getsaleorderPage(dataTablesParameters)
                    .subscribe((resp) => {
                        this.dataRow_p = resp.data;
                        this.total_p = resp.total;
                        // console.log(resp.total, 'resp_paid')
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }
                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
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
            ],
        };
    }
    // pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }

    loadTableCondition(): void {
        const that = this;
        this.dtOptionsCondition = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[4, 'desc']],

            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'paid';
                that._Service
                    .getsaleorderPage(dataTablesParameters)
                    .subscribe((resp) => {
                        this.dataRow_p = resp.data;
                        this.total_p = resp.total;
                        // console.log(resp.total, 'resp_paid')
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }
                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
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
            ],
        };
    }

    loadTableConfirm(): void {
        const that = this;
        this.dtOptionsConfirm = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[4, 'desc']],

            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'confirm';
                that._Service
                    .getsaleorderPage(dataTablesParameters)
                    .subscribe((resp) => {
                        this.dataRow_c = resp.data;
                        this.total_c = resp.total;
                        // console.log(resp.total, 'resp')
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }
                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
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
            ],
        };
    }
    // pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
    loadTableDelivery(): void {
        const that = this;
        this.dtOptionsDelivery = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[4, 'desc']],

            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'delivery';
                that._Service
                    .getsaleorderPage(dataTablesParameters)
                    .subscribe((resp) => {
                        this.dataRow_d = resp.data;
                        this.total_d = resp.total;
                        // console.log(resp.total, 'resp')
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }
                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
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
            ],
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
            order: [[4, 'desc']],

            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'packing';
                that._Service
                    .getsaleorderPage(dataTablesParameters)
                    .subscribe((resp) => {
                        this.dataRow_pc = resp.data;
                        this.total_pc = resp.total;
                        // console.log(resp.total, 'resp')
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }
                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
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
            ],
        };
    }
    // pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
    loadTableFinish(): void {
        const that = this;
        this.dtOptionsFinish = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[4, 'desc']],

            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'finish';
                that._Service
                    .getsaleorderPage(dataTablesParameters)
                    .subscribe((resp) => {
                        this.dataRow_f = resp.data;
                        this.total_f = resp.total;
                        // console.log(resp.total, 'resp')
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }
                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
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
            ],
        };
    }
    loadTableReject(): void {
        const that = this;
        this.dtOptionsReject = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[4, 'desc']],

            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'failed';
                that._Service
                    .getsaleorderPage(dataTablesParameters)
                    .subscribe((resp) => {
                        this.dataRow_reject = resp.data;
                        this.total_reject = resp.total;
                        // console.log(this.dataRow_reject, 'dataRow_reject')
                        this.pages.current_page = resp.current_page;
                        this.pages.last_page = resp.last_page;
                        this.pages.per_page = resp.per_page;
                        if (resp.current_page > 1) {
                            this.pages.begin =
                                resp.per_page * resp.current_page - 1;
                        } else {
                            this.pages.begin = 0;
                        }
                        callback({
                            recordsTotal: resp.total,
                            recordsFiltered: resp.total,
                            data: [],
                        });
                        this._changeDetectorRef.markForCheck();
                    });
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
            ],
        };
    }
    /**
     * After view init
     */
    ngAfterViewInit(): void {
        // if (this._sort && this._paginator) {
        //     // Set the initial sort
        //     this._sort.sort({
        //         id: 'id',
        //         start: 'asc',
        //         disableClear: true
        //     });
        //     // Mark for check
        //     this._changeDetectorRef.markForCheck();
        //     // If the user changes the sort order...
        //     this._sort.sortChange
        //         .pipe(takeUntil(this._unsubscribeAll))
        //         .subscribe(() => {
        //             // Reset back to the first page
        //             this._paginator.pageIndex = 0;
        //             // Close the details
        //             this.closeDetails();
        //         });
        //     // Get products if sort or page changes
        //     merge(this._sort.sortChange, this._paginator.page).pipe(
        //         switchMap(() => {
        //             this.closeDetails();
        //             this.isLoading = true;
        //             return this._Service.getProducts(
        //                 this._paginator.pageIndex + 1,
        //                 this._paginator.pageSize,
        //                 this._sort.active,
        //                 this._sort.direction,
        //                 this.filterForm.value?.searchInputControl,
        //                 this.filterForm.value?.asset_type == 'default' ? '' : this.filterForm.value?.asset_type,
        //                 this.supplierId
        //             );
        //         }),
        //         map(() => {
        //             this.isLoading = false;
        //         })
        //     ).subscribe();
        // }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    resetForm(): void {
        this.filterForm.reset();
        this.filterForm.get('asset_type').setValue('default');
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedProduct = null;
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

    callDetail(productId: string): void {
        // alert(this.selectedProduct.id);
        // // If the product is already selected...
        // if (this.selectedProduct && this.selectedProduct.id === productId) {
        //     // Close the details
        //     // this.closeDetails();
        //     return;
        // }

        this._router.navigate(['marketing/brief-plan/' + productId]);
    }

    editBrief(productId: string): void {
        this._router.navigate(['marketing/brief-plan/edit/' + productId]);
    }
    edit(saleorderId: string): void {
        console.log('log', saleorderId);
        this._router.navigate(['sale-order/edit/' + saleorderId]);
    }

    view(saleorderId: string): void {
        console.log('log', saleorderId);
        this._router.navigate(['sale-order/view-sale-order/' + saleorderId]);
    }
    print(saleorderId: string): void {
        // console.log('log', saleorderId)
        this._router.navigate([
            'sale-order/sale-order-withdraw/' + saleorderId,
        ]);
    }

    openNewBrief(): void {
        this._router.navigateByUrl('marketing/brief-plan/brief/create');
    }

    openNewOrder(productId: string): void {
        // If the product is already selected...
        // if (this.selectedProduct && this.selectedProduct.id === productId) {
        //     // Close the details
        //     // this.closeDetails();
        //     return;
        // }

        this._router.navigate([
            'marketing/data/assets-list/new-order/' + productId,
        ]);
    }

    textStatus(status: string): string {
        return startCase(status);
    }

    setAll(completed: boolean) {
        this.allComplete_all = completed;
    }
    setnotfinish(completed: boolean) {
        this.allComplete_notfinish = completed;
    }
    setfinish(completed: boolean) {
        this.allComplete_finish = completed;
    }
    setcondition(completed: boolean) {
        this.allComplete_condition = completed;
    }
    setsubmit(completed: boolean) {
        this.allComplete_submit = completed;
    }
}
