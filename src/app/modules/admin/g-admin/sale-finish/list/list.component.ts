import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { startCase } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { AssetType } from '../../permission/permission.types';
import { SaleOrderService } from '../../sale-order/sale-order.service';
import { DataSaleOrder, saleOrderPagination } from '../../sale-order/sale-order.types';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    displayedColumns: string[] = ['id',
        'first_name',
        'last_name',
        'email',
        'status',
        'create_by',
        'created_at',
        'actions'];

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
    dataRow_t: any = []
    dataRow_o: any = []
    dataRow_p: any = []
    dataRow_c: any = []
    dataRow_pc: any = []
    dataRow_d: any = []
    dataRow_reject: any = []
    dataRow_f: any = []
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
    allComplete_pack: boolean = false;
    allComplete_send: boolean = false;
    allComplete_success: boolean = false;
    allComplete_notsuccess: boolean = false;

    items : any = [
        {
            id: 1,
            name:"A",
        },
        {
            id: 2,
            name:"B",
        },
        {
            id: 3,
            name:"C",
        },
    ]

    // DelOrder:any = [];


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
        private _authService: AuthService,
    ) {

    }

    // tickDelOrder(event:any) {
    //     console.log(event, "test");
    // }

    // tickDelOrder(event: any, id: any) {
    //     if (event.checked === true) {
    //         this.DelOrder.push(id);
    //         console.log(event, 'test');
    //         console.log(id, 'test');
    //         console.log(this.DelOrder, 'test');
    //     } else {
    //         const index = this.DelOrder.findIndex((item) => item === id);
    //         if (index !== -1) {
    //             this.DelOrder.splice(index, 1);
    //         }
    //         console.log(this.DelOrder, 'test....');
    //     }
    // }
    // tickAllDelOrder(event: any, item: any) {
    //     this.allComplete_pack = event.checked;

    //     if (event.checked === true) {
    //         this.DelOrder = [];
    //         for (let i = 0; i < item.length; i++) {
    //             const element = item[i];
                
    //             this.DelOrder.push(element.id);
    //             console.log(event, 'test');
    //             console.log(element, 'test');
    //         }
    //         console.log(this.DelOrder, 'test');
    //     } else {
    //         this.DelOrder = [];
    //         console.log(this.DelOrder, 'test....');
    //     }
    // }



    ngOnInit(): void {


        this.loadTableTotal();
        // this.loadTableOrder();
        // this.loadTablePaid();
        // this.loadTableCondition();
        // this.loadTableConfirm();
        this.loadTablePacking();
        this.loadTableDelivery();
        this.loadTableFinish();
        this.loadTableReject();
        this.line = 'assets/images/line.png'
        this.tiktok = 'assets/images/tiktok.png'
        this.facebook = 'assets/images/facebook.png'
        this.sp = 'assets/images/sp.png'
        // console.log('stest',this.line)

        // this.DelOrder = [];
        this._changeDetectorRef.markForCheck();

    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }







    loadTableTotal(): void {
        const that = this;
        this.dtOptionsTotal = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[4, 'desc']],
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                // dataTablesParameters.status = 1;
                console.log('respppp resp.totalresp.totalresp.total9845632189465123')
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_t = resp.data
                    this.total_t = resp.total
                    console.log(this.dataRow_t, 'resp')
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

                { data: 'payment_qty' },
                { data: 'payment_qty' },
            ]
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
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'order';
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_o = resp.data
                    this.total_o = resp.total
                    console.log(this.dataRow_o, 'resp')
                    console.log(resp.total, 'resp.total')
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

            ]
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
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'paid';
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_p = resp.data
                    this.total_p = resp.total
                    // console.log(resp.total, 'resp_paid')
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
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'paid';
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_p = resp.data
                    this.total_p = resp.total
                    // console.log(resp.total, 'resp_paid')
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

    loadTableConfirm(): void {
        const that = this;
        this.dtOptionsConfirm = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[4, 'desc']],

            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'confirm';
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_c = resp.data
                    this.total_c = resp.total
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
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'delivery';
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_d = resp.data
                    this.total_d = resp.total
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
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'packing';
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_pc = resp.data
                    console.log(this.dataRow_pc);
                    this.total_pc = resp.total
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
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'finish';
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_f = resp.data
                    this.total_f = resp.total
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
    loadTableReject(): void {
        const that = this;
        this.dtOptionsReject = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[4, 'desc']],

            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.status = 'failed';
                that._Service.getsaleorderPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow_reject = resp.data
                    this.total_reject = resp.total
                    // console.log(this.dataRow_reject, 'dataRow_reject')
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
        this._changeDetectorRef.markForCheck();

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
        this.filterForm.get('asset_type').setValue("default");
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
        console.log('log', saleorderId)
        this._router.navigate(['sale-order/edit/' + saleorderId]);
    }

    view(saleorderId: string): void {
        console.log('log', saleorderId)
        this._router.navigate(['sale-order/view-sale-order/' + saleorderId]);
    }
    print(saleorderId: string): void {
        // console.log('log', saleorderId)
        this._router.navigate(['sale-order/sale-order-withdraw/' + saleorderId]);
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


        this._router.navigate(['marketing/data/assets-list/new-order/' + productId]);
    }

    textStatus(status: string): string {
        return startCase(status);
    }



    setAll(completed: boolean) {
        this.allComplete_all = completed;
    }
    setpack(completed: boolean) {
        this.allComplete_pack = completed;
    }
    setsend(completed: boolean) {
        this.allComplete_send = completed;
    }
    setsuccess(completed: boolean) {
        this.allComplete_success = completed;
    }
    setnotsuccess(completed: boolean) {
        this.allComplete_notsuccess = completed;
    }



}
