
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
import { AssetType, DataUser, UserPagination } from '../user.types';
import { UserService } from '../user.service';
import { MatTableDataSource } from '@angular/material/table';
import { ViewUserComponent } from '../view-user/view-user.component';
import { data } from 'jquery';
import { NewLeaveComponent } from '../leave/new.component';
import { DialogChangePwdComponent } from '../dialog-change-pwd/dialog-change-pwd.component';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';

@Component({
    selector: 'app-profile-user',
    templateUrl: './profile-user.component.html',
    styleUrls: ['./profile-user.component.scss'],
    // encapsulation: ViewEncapsulation.None,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})

export class ProfileUserComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    public dtOptions: DataTables.Settings = {};
    displayedColumns: string[] = ['id',
        'first_name',
        'last_name',
        'email',
        'status',
        'create_by',
        'created_at',
        'total',
        'total_deduct',
        'actions'];
    dataSource: MatTableDataSource<DataUser>;
    dataRow: any = []
    dataRow1: any = []
    public namets: string
    url_pro: any = []
    url_sig: any = []
    Dep: any = []
    Pos: any = []
    Bra: any = []
    formData: FormGroup;
    public YearList: any = [];
    public MonthList: any = [];

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
    pagination: UserPagination;

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        // private _Service: PermissionService,
        private _Service: UserService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
    ) {
    }

    /**
     * On init
     */
    ngOnInit(): void {
        this._Service.getUserprofile().subscribe((resp: any) => {
            this.dataRow = resp.data;
            console.log()
            this._changeDetectorRef.markForCheck();
            this.Bra = this.dataRow.branch.name
            this.Pos = this.dataRow.position.name
            this.Dep = this.dataRow.department.name
            this.url_pro = this.dataRow.image
            this.url_sig = this.dataRow.image_signature
        })
        this.loadTable();{
        this._changeDetectorRef.markForCheck();
          }
          
        this._Service.getYear().subscribe((resp: any) => {
            this.YearList = resp.data;
            this._changeDetectorRef.markForCheck();
        });
        this._Service.getMonth().subscribe((resp: any) => {
            this.MonthList = resp.data;
            this._changeDetectorRef.markForCheck();
        });
        this.clearForm();
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
    loadTable(): void {
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
                const user =(JSON.parse(localStorage.getItem("user")))
                // const year =(JSON.parse(localStorage.getItem("year")))
                // const month =(JSON.parse(localStorage.getItem("month")))
                // dataTablesParameters.year=user.year;
                // dataTablesParameters.month=user.month;
                dataTablesParameters.user_id=user.user_id;     //00007
                that._Service.getUserTable(dataTablesParameters).subscribe((resp) => {
                    this.dataRow1 = resp.data
                    console.log(resp)
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

                { data: 'user_id' },
                { data: 'date' },
                { data: 'time' },
                { data: 'machine' },
                { data: 'action', orderable: false },
            ]
        };
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------




    resetForm(): void {
        this.filterForm.reset();
        this.filterForm.get('asset_type').setValue("default");
        this._changeDetectorRef.markForCheck();
    }
    clearForm(): void {
        // let year = new Date().getUTCFullYear();
        this.formData.patchValue({
            year: '',
            month: '',
        });
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
    edit(productId: string): void {
        this._router.navigate(['user/edit-profile/']);
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

    // openImportOsm(): void {
    //     this._matDialog.open(ImportOSMComponent)
    // }

    ViewUser(data): void {
        const dialogRef = this._matDialog.open(ViewUserComponent, {
            width: '1000px',
            height: '650px',
            data: data

        })
        dialogRef.afterClosed().subscribe(res => {
        })
    }
    // ChangePwd(userId: string): void {
    //     this._router.navigate(['user/change-pwd/' + userId]);
    // }

    openLeave(): void {
        const dialogRef = this._matDialog.open(NewLeaveComponent, {


        })
        dialogRef.afterClosed().subscribe(res => {


        })
    }

    ChangePwd(data) {
        const dialogRef = this._matDialog.open(DialogChangePwdComponent, {
            // width: '50%',
            // minHeight: 'calc(100vh - 90px)',
            // height: 'auto'

            data: data
        });

        dialogRef.afterClosed().subscribe(item => {
            // this.rerender();
            this._changeDetectorRef.markForCheck();
        });
    }
}

