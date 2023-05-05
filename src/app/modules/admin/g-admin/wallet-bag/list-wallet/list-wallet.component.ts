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
import { AssetType, BankPagination, DataBank } from '../wallet.types';
import { BankService } from '../wallet.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';
import { MatTableDataSource } from '@angular/material/table';
import { DataTableDirective } from 'angular-datatables';
import { NewWalletComponent } from '../new-wallet/new-wallet.component';
import { EditWalletComponent } from '../edit-wallet/edit-wallet.component';
import { TopupHistoryComponent } from '../topup-history/topup-history.component';


interface RefundRequest {
    dateTime: string;
    nameSurname: string;
    accountNumber: string;
    bank: string;
    amount: number;
  }

@Component({
    selector: 'app-list-wallet',
    templateUrl: './list-wallet.component.html',
    styleUrls: ['./list-wallet.component.scss'],
    animations: fuseAnimations
})

export class ListWalletComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<any>();
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    public dtOptions: DataTables.Settings = {};
    public dataRow: any[];

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
    get roleType(): string {
        return 'marketing';
    }

    supplierId: string | null;
    pagination: BankPagination;
    title = 'Refund Requests';

    refundRequests: RefundRequest[] = [
      {
        dateTime: '2023-05-05 10:00',
        nameSurname: 'เกวลิน  อัคคเดชโภคิน',
        accountNumber: '1234567890',
        bank: 'ธนาคารกสิกรไทย',
        amount: 500,
      },
      {
        dateTime: '2023-05-05 10:00',
        nameSurname: 'จิตติพัฒน์ สิทธิศักดิ์โสภณ',
        accountNumber: '1234567890',
        bank: 'ธนาคารกรุงเทพ',
        amount: 100,
      },
      {
        dateTime: '2023-05-05 10:00',
        nameSurname: 'ตุลธร พุฒิสรรค์สกุล',
        accountNumber: '1234567890',
        bank: 'ธนาคารไทยพานิชย์',
        amount: 100,
      },
      {
        dateTime: '2023-05-05 10:00',
        nameSurname: 'ฐิติวัฒน์  ปัญญารัศมิ์สกุล',
        accountNumber: '1234567890',
        bank: 'ธนาคารกรุงไทย',
        amount: 100,
      },
      {
        dateTime: '2023-05-05 10:00',
        nameSurname: 'นงลักษณ์ ธิติรัตน์วรโชติ',
        accountNumber: '1234567890',
        bank: 'ธนาคารเพื่อการเกษตร',
        amount: 100,
      },
      {
        dateTime: '2023-05-05 10:00',
        nameSurname: 'ชวัลลักษณ์ ศิริกรโสภณ',
        accountNumber: '1234567890',
        bank: 'ธนาคารกสิกร',
        amount: 100,
      },
      {
        dateTime: '2023-05-05 10:00',
        nameSurname: 'พัสกร ศิริวัฒนกวินท์',
        accountNumber: '1234567890',
        bank: 'ธนาคารกรุงศรี',
        amount: 100,
      },
      {
        dateTime: '2023-05-05 10:00',
        nameSurname: 'มนัสนันท์ โชติวัฒนทวีชัย',
        accountNumber: '1234567890',
        bank: 'ธนาคารกสิกร',
        amount: 100,
      },
      {
        dateTime: '2023-05-05 10:00',
        nameSurname: 'จริญญา วิรุฬห์วัชรสกุล',
        accountNumber: '1234567890',
        bank: 'ธนาคารกสิกร',
        amount: 100,
      },

      // Add more refund request objects here
    ];

    confirm(index: number): void {
      // Handle confirmation logic here
      console.log(`Confirm refund request #${index + 1}`);
    }

    refund(index: number): void {
      // Handle refund logic here
      console.log(`Refund request #${index + 1}`);
    }
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
    ) {
    }


    ngOnInit(): void {
        this.loadTable();
    }


    ngAfterViewInit(): void {

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
                { data: 'actice', orderable: false },
                { data: 'id' },
                { data: 'account_number' },
                { data: 'first_name' },
                { data: 'status' },
                { data: 'create_by' },
                { data: 'created_at' },
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
