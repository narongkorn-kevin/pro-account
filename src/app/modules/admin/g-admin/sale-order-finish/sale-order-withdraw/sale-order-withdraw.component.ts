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
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'app-sale-order-withdraw',
    templateUrl: './sale-order-withdraw.component.html',
    styleUrls: ['./sale-order-withdraw.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
})
export class SaleOrderWithdrawFinishComponent
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
    dataRow: any;
    position: number;
    weight: number;
    symbol: string;
    public saleorderbyIdData: any = [];
    public dataRow2: any = [];
    saleorderId: string;
    public dtOptionsTotal: DataTables.Settings = {};
    public dtOptionsOrder: DataTables.Settings = {};
    public dtOptionsPaid: DataTables.Settings = {};
    public dtOptionsConfirm: DataTables.Settings = {};
    public dtOptionsDelivery: DataTables.Settings = {};
    public dtOptionsPacking: DataTables.Settings = {};
    public dtOptionsFinish: DataTables.Settings = {};
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

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        // private _Service: PermissionService,
        private _Service: SaleOrderService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.saleorderId = this._activatedRoute.snapshot.paramMap.get('id');

        // console.log('saleorderbyIdData',this.saleorderId)

        this._Service
            .getsaleorderbyId(this.saleorderId)
            .subscribe((resp: any) => {
                this._changeDetectorRef.markForCheck();
                this.saleorderbyIdData = resp.data;
                this.dataRow2 = resp.data.sale_order_lines;
                console.log('dataRow', this.dataRow2);
                setTimeout(() => {
                    window.print();
                    if (window.onafterprint) {
                        this._router.navigate(['sale-order/list']);
                    } else {
                        this._router.navigate(['sale-order/list']);
                    }
                }, 300);
            });
    }

    ngAfterViewInit(): void {}

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

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
    print(saleorderId: string): void {
        console.log('log', saleorderId);
        // this._router.navigate(['user/edit/' + saleorderId]);
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
}
