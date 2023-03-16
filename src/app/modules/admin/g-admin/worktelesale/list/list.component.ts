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
import { AssetType, BranchPagination, DataWarehouse } from '../worktelesale.types';
import { WorktelesaleService } from '../worktelesale.service';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from '../../item/item.types';
import { DataTableDirective } from 'angular-datatables';
import { NewComponent } from '../new/new.component';
import { EditComponent } from '../edit/edit.component';

@Component({
    selector: 'worktelesale',
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

    dataRow: any[] = [];
    dataRow2: any[] = [];

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

    totalCustomerTelesale = 0;
    totalTel = 0;
    totalNotTel = 0;

    constructor(

        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: WorktelesaleService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
    ) {
    }

    ngOnInit(): void {
        this.loadTable();
        this.loadTeleTable();
    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
    loadTable(): void {
        const that = this;
        this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[5, 'desc']],
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                that._Service.getCustomerTelePage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow = resp.data;
                    this.totalCustomerTelesale = resp.total;
                    console.log(resp.data)
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
                { data: 'action', orderable: false },
         
                { data: 'id' },
                { data: 'name' },
                { data: 'email' },
                { data: 'phone' },
                { data: 'status' },
                { data: 'create_by' },
                { data: 'created_at' },
            ]
        };
    }


    loadTeleTable(): void {
        const that = this;
        this.dtOptionsList = {
            pagingType: 'full_numbers',
            pageLength: 10,
            serverSide: true,
            processing: true,
            order: [[5, 'desc']],
            language: {
                "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
            },
            ajax: (dataTablesParameters: any, callback) => {
                that._Service.getWorkTelePage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow2 = resp.data;
                    console.log(resp.data)
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
                { data: 'action', orderable: false },
                { data: 'actice', orderable: false },
                { data: 'id' },
                { data: 'name' },
                { data: 'email' },
                { data: 'phone' },
                { data: 'status' },
                { data: 'create_by' },
                { data: 'created_at' },
            ]
        };
    }

    countDataTotal(ArrData): void {
       this.totalTel = 0;
       this.totalNotTel = 0;

        if(ArrData) {
            ArrData.forEach((element, index) => {
                console.log(element.call_status)
                if(element.call_status == false) {
                    this.totalNotTel = this.totalNotTel + 1;
                }
                else {
                    this.totalTel = this.totalTel + 1;
                }
            });
        }
        else {
            this.totalTel = 0;
            this.totalNotTel = 0;
        }
    }


    onTelCustomer(cusId : any): void {
        const confirmation = this._fuseConfirmationService.open({
            "title": "คุณโทรสำเร็จแล้ว ใช่หรือไม่ ?",
            "message": "ติดต่อลูกค้า : " + cusId.name + '<br /> เบอร์โทร : ' + cusId.phone,

            "icon": {
                "show": true,
                "name": "heroicons_outline:phone",
                "color": "info"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "โทรสำเร็จ",
                    "color": "primary"
                },

                "cancel": {
                    "show": true,
                    "label": "ปิด",
                    
                }
            },
            "dismissible": true
        });

        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {

                let body = {
                    customer_id: cusId.id
                };
                this._Service.updateCall(body).subscribe(
                    {
                        next: (resp: any) => {
                            this.showFlashMessage('success');
                            this.rerender();
                        },
                        error: (err: any) => {
                            this._fuseConfirmationService.open({
                                "title": "พบข้อผิดพลาด",
                                "message": err.error.message,
                                "icon": {
                                    "show": true,
                                    "name": "heroicons_outline:exclamation",
                                    "color": "warning"
                                },
                                "actions": {
                                    "confirm": {
                                        "show": false,
                                        "label": "ยืนยัน",
                                        "color": "primary"
                                    },
                                    "cancel": {
                                        "show": false,
                                        "label": "ยกเลิก",
                                    }
                                },
                                "dismissible": true
                            });
                        }
                    }
                );
            }
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


    showFlashMessage(type): void {
        if(type == 'success') {
            this._fuseConfirmationService.open({
                title: 'บันทึกข้อมูลเรียบร้อย',
                message: 'ขอบคุณครับ!!',
                icon: {
                    show: true,
                    name: 'heroicons_outline:check-circle',
                    color: 'success',
                },
                actions: {
                    confirm: {
                        show: true,
                        label: 'ตกลง',
                        color: 'primary',
                    }, 
                    cancel: {
                        show: false,
                        label: 'ยกเลิก',
                    }
                },
                dismissible: true,
            });

            setTimeout(() => {
                this.flashMessage = null;
                this._changeDetectorRef.markForCheck();
                // this.dialogRef.close()
            }, 3000);
        }
        else {
            // error
        }
    }


    Edit(itemId) {
        const dialogRef = this._matDialog.open(EditComponent, {
            width: '600px',
            height: 'auto',
            data: {
                itemid: itemId
            }
        });
        dialogRef.afterClosed().subscribe(item => {
            this.rerender();
            this._changeDetectorRef.markForCheck();
        });
    }



    New(itemId) {
        const dialogRef = this._matDialog.open(NewComponent, {
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




    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

    Delete(id) {

        const confirmation = this._fuseConfirmationService.open({
            "title": "ลบข้อมูลไฟล์/เสียง",
            "message": "คุณต้องการลบข้อมูลไฟล์/เสียงนี้ ใช่หรือไม่ ?",
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
                    .deleteWorkTele(id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((res: any) => {
                        if (res.code == 201) {
                            this._fuseConfirmationService.open({
                                "title": "ลบข้อมูลคลังสินค้า",
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
                                this._changeDetectorRef.markForCheck();
                                this.rerender();
                            })
                        }
                    });

            }
        });

    }

}
