import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { Item } from '../item.types';
import { ItemService } from '../item.service';

@Component({
    selector: 'item-list-promotion',
    templateUrl: './list-promotion.component.html',
    styleUrls: ['./list-promotion.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})

export class ItemListPromotionComponent implements OnInit, OnDestroy {

    isLoading: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;
    get roleType(): string {
        return 'marketing';
    }
    dtOptions: DataTables.Settings = {};
    items: Item[] = [];
    // flashMessage: 'success' | 'error' | null = null;
    // searchInputControl: FormControl = new FormControl();
    // selectedProduct: any | null = null;
    // filterForm: FormGroup;
    // tagsEditMode: boolean = false;

    // me: any | null;

    // supplierId: string | null;
    // pagination: CustomerPagination;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _Service: ItemService,
        private _router: Router,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
    ngOnInit(): void {

        const that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[0, 'asc']],
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                dataTablesParameters.item_type_id = null;
                dataTablesParameters.set_type = 'set_products';
                that._Service.getItem(dataTablesParameters).subscribe((resp) => {
                    this.items = resp.data
                    console.log(this.items)
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
                { data: 'id' },
                { data: 'image' },
                { data: 'item_id' },
                { data: 'name' },
                { data: 'qty' },
                { data: 'booking' },
                { data: 'balance' },
                { data: 'status' },
                { data: 'create_by' },
                { data: 'created_at' },
                { data: 'actice', orderable: false },
            ]
        };
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




    // resetForm(): void {
    //     this.filterForm.reset();
    //     this.filterForm.get('asset_type').setValue("default");
    //     this._changeDetectorRef.markForCheck();
    // }

    /**
     * Close the details
     */
    // closeDetails(): void {
    //     this.selectedProduct = null;
    // }

    /**
     * Show flash message
     */
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

    edit(customerId: string): void {
        this._router.navigate(['/item/edit-item-promotion/' + customerId]);
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

    // openDialog() {
    //     const dialogRef = this._matDialog.open(NewBranchComponent);
    // }

    // openImportOsm(): void {
    //     this._matDialog.open(ImportOSMComponent)
    // }
}
