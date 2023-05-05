import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { startCase } from 'lodash';
import { Subject, Observable, takeUntil } from 'rxjs';
import { EditWalletComponent } from '../edit-wallet/edit-wallet.component';
import { NewWalletComponent } from '../new-wallet/new-wallet.component';
import { RefundComponent } from '../refund/refund.component';
import { TopupHistoryComponent } from '../topup-history/topup-history.component';
import { BankService } from '../wallet.service';
import { DataBank, AssetType, BankPagination } from '../wallet.types';
import { fuseAnimations } from '@fuse/animations';

interface Detail{
  
}
@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: fuseAnimations
})
export class TimepickerComponent implements OnInit {
  
private destroy$ = new Subject<any>();
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    public dtOptions: DataTables.Settings = {};
    public dataRow: any[];
    imageData: any;
    
    details: Detail [] = [
        { date: '2023-04-06.', name_list: 'แพ็จเกจ',amount_m: '5,000' , date_line: '2025-04-06.',status_s: 'สำเร็จ' },
        { date: '2023-04-06.', name_list: 'แพ็จเกจ',amount_m: '5,000' , date_line: '2025-04-06.',status_s: 'ไม่สำเร็จ' },
        { date: '2023-04-06.', name_list: 'แพ็จเกจ',amount_m: '5,000' , date_line: '2025-04-06.',status_s: 'รอดำเนินการ' },
        { date: '2023-04-06.', name_list: 'แพ็จเกจ',amount_m: '5,000' , date_line: '2025-04-06.',status_s: 'รอดำเนินการ' },
        { date: '2023-04-06.', name_list: 'แพ็จเกจ',amount_m: '5,000' , date_line: '2025-04-06.',status_s: 'รอดำเนินการ' },
        { date: '2023-04-06.', name_list: 'แพ็จเกจ',amount_m: '5,000' , date_line: '2025-04-06.',status_s: 'รอดำเนินการ' },
        { date: '2023-04-06.', name_list: 'แพ็จเกจ',amount_m: '5,000' , date_line: '2025-04-06.',status_s: 'รอดำเนินการ' },
        { date: '2023-04-06.', name_list: 'แพ็จเกจ',amount_m: '5,000' , date_line: '2025-04-06.',status_s: 'รอดำเนินการ' },
        { date: '2023-04-06.', name_list: 'แพ็จเกจ',amount_m: '5,000' , date_line: '2025-04-06.',status_s: 'รอดำเนินการ' },
        
    ];
    bankId: string;
    statusData = [
        { id: 0, name: 'ไม่สำเร็จ' },
        { id: 1, name: 'สำเร็จ' },
    ]
    // dataRow: any = []
    @ViewChild(MatPaginator) _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    displayedColumns: string[] = ['id', 'name', 'status', 'create_by', 'created_at', 'actions'];
    dataSource: MatTableDataSource<DataBank>;

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
    dataService: any;
    formData: FormGroup<{ id: FormControl<string>; name: FormControl<string>; first_name: FormControl<string>; last_name: FormControl<string>; account_number: FormControl<string>; status: FormControl<string>; image: FormControl<string>; }>;
    get roleType(): string {
        return 'marketing';
    }

    supplierId: string | null;
    pagination: BankPagination;

    /**
     * Constructor
     */
    constructor(

        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        // private _Service: PermissionService,
        private _Service: BankService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private http: HttpClient
    ) {
        this.formData = this._formBuilder.group({
            id: ['',],
            name: ['',],
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            account_number: ['', Validators.required],
            status: '',
            image: ['',]
        })
    }


    ngOnInit(): void {
        this.loadTable();
        this.fetchData();

    }
    fetchData(): void {
        this.dataService.getData().subscribe((data: any[]) => {
          this.details = data;
        });
      }
    
      refreshTable(): void {
        this.fetchData();
      }


    ngAfterViewInit(): void {
        this.http.get('assets/delivery.json').subscribe(data => {
            this.imageData = data;
        })
    }


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }


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

        this._router.navigate(['marketing/brief-plan/' + productId]);

    }

    edit(bankId: string): void {
        this._router.navigate(['bank/edit/' + bankId]);
    }

    openNewBrief(): void {
        this._router.navigateByUrl('marketing/brief-plan/brief/create');
    }

    openNewOrder(productId: string): void {
        
        this._router.navigate(['marketing/data/assets-list/new-order/' + productId]);
    }

    textStatus(status: string): string {
        return startCase(status);
    }


    // openImportOsm(): void {
    //     this._matDialog.open(ImportOSMComponent)
    // }

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

                that._Service.getbankPage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow = resp.data
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
                //{ data: 'actice', orderable: false },
                //{ data: 'id' },
               //{ data: 'account_number' },
               // { data: 'first_name' },
                { data: 'status' },
               // { data: 'create_by' },
//{ data: 'created_at' },
            ]
        };

    }

    Edit(itemId: string) {
        const dialogRef = this._matDialog.open(EditWalletComponent, {
            width: '900px',
            height: '950px',
            data: {
                itemid: itemId
            }
        });
        dialogRef.afterClosed().subscribe(item => {
            this.rerender();
            this._changeDetectorRef.markForCheck();
        });
    }

    New() {
        const dialogRef = this._matDialog.open(NewWalletComponent, {
            width: '900px',
            height: '750px'
        });

        dialogRef.afterClosed().subscribe(item => {
            this.rerender();
            this._changeDetectorRef.markForCheck();
        });
    }

    New2() {
        const dialogRef = this._matDialog.open(TopupHistoryComponent, {
            width: '900px',
            height: '750px'
        });

        

        dialogRef.afterClosed().subscribe(item => {
            this.rerender();
            this._changeDetectorRef.markForCheck();
        });
    }
    Refund() {
        const dialogRef = this._matDialog.open(RefundComponent, {
            width: '900px',
            height: '750px'
        });

        dialogRef.afterClosed().subscribe(item => {
            this.rerender();
            this._changeDetectorRef.markForCheck();
        });
    }
    COD() {
        const dialogRef = this._matDialog.open(TimepickerComponent, {
            width: '900px',
            height: '750px'
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
            "title": "ยืนยันการลบรายการ",
            "message": "คุณต้องการลบรายการใช่หรือไม่ ?",
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
                    .delete(id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((res: any) => {
                        if (res.code == 201) {
                            this._fuseConfirmationService.open({
                                "title": "ลบรายการ",
                                "message": "ลบเรียบร้อย",
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
                            })
                        }
                    });

            }
        });

    }
}
