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
import { AssetType, DataPosition, PositionPagination } from '../position.types';
import { PositionService } from '../position.service';
// import { NewDepartmentComponent } from '../new-department/new-department.component';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';
import { MatTableDataSource } from '@angular/material/table';
import { EditPositionComponent } from '../edit-position/edit-position.component';
import { NewPositionComponent } from '../new-position/new-position.component';
import { DataTableDirective } from 'angular-datatables';
@Component({
    selector: 'position-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})

export class PositionListComponent implements OnInit, AfterViewInit, OnDestroy {

    private destroy$ = new Subject<any>();
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dataRow: any[] = [];
    @ViewChild(MatPaginator) _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();


    /**
     * Constructor
     */
    constructor(

        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        // private _Service: PermissionService,
        private _Service: PositionService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // this.loadTable();

    }

    pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
    // loadTable(): void {
    //     const that = this;
    //     this.dtOptions = {
    //         pagingType: 'full_numbers',
    //         pageLength: 10,
    //         serverSide: true,
    //         processing: true,
    //         language: {
    //             "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
    //         },
    //         ajax: (dataTablesParameters: any, callback) => {
    //             dataTablesParameters.item_type_id = 1;
    //             that._Service.getPositionPage(dataTablesParameters).subscribe((resp) => {
    //                 this.dataRow = resp.data
    //                 console.log(resp)
    //                 this.pages.current_page = resp.current_page;
    //                 this.pages.last_page = resp.last_page;
    //                 this.pages.per_page = resp.per_page;
    //                 if (resp.current_page > 1) {
    //                     this.pages.begin = resp.per_page * resp.current_page - 1;
    //                 } else {
    //                     this.pages.begin = 0;
    //                 }
    //                 callback({
    //                     recordsTotal: resp.total,
    //                     recordsFiltered: resp.total,
    //                     data: []
    //                 });
    //                 this._changeDetectorRef.markForCheck();
    //             })
    //         },
    //         columns: [
    //             { data: 'actice', orderable: false },
    //             { data: 'id' },
    //             { data: 'name' },
    //             { data: 'status' },
    //             { data: 'create_by' },
    //             { data: 'created_at' },
            
    //         ]
    //     };

    // }


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



    edit(productId: string): void {
        this._router.navigate(['position/edit/' + productId]);
    }


    Edit(itemId: string) {
        const dialogRef = this._matDialog.open(EditPositionComponent, {
            // width: '50%',
            // minHeight: 'calc(100vh - 90px)',
            // height: 'auto',
            width: '700px',
            height: '460px',
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
        const dialogRef = this._matDialog.open(NewPositionComponent, {
            // width: '50%',
            // minHeight: 'calc(100vh - 90px)',
            // height: 'auto'
            width: "100%",
            height: "100%",
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
            "title": "ยืนยันลบตำแหน่ง",
            "message": "คุณต้องการลบตำแหน่งใช่หรือไม่ ?",
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
                                "title": "ลบข้อมูลตำแหน่ง",
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
                            })
                        }
                    });

            }
        });

    }

}
