import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { environment } from 'environments/environment';
import { Observable, Subject, takeUntil } from 'rxjs';

import { FacebookLoginProvider, SocialAuthService, SocialUser, } from '@abacritt/angularx-social-login';
import { MatTableDataSource } from '@angular/material/table';
import { DataTableDirective } from 'angular-datatables';
import { EditComponent } from '../edit/edit.component';
import { NewComponent } from '../new/new.component';
import { PageService } from '../page.service';
import { AssetType, BranchPagination, DataWarehouse } from '../page.types';

@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    animations: fuseAnimations
})

export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
    private destroy$ = new Subject<any>();
    @ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;
    dtOptions: DataTables.Settings = {};
    dataRow: any[] = [];
    @ViewChild(MatPaginator) _paginator: MatPaginator;
    displayedColumns: string[] = ['id', 'name', 'code', 'status', 'create_by', 'created_at', 'actions'];
    dataSource: MatTableDataSource<DataWarehouse>;
    loginForm!: FormGroup;
    socialUser!: SocialUser;
    isLoggedin?: boolean = undefined;

    formData: FormGroup
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
    tokenData: any;
    supplierId: string | null;
    pagination: BranchPagination;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,

        private _Service: PageService,
        private _matDialog: MatDialog,
        private formBuilder: FormBuilder,
        private authService: SocialAuthService,

    ) {
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {



        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required],
        });
        this.authService.authState.subscribe((user) => {
            this.socialUser = user;
            this.isLoggedin = user != null;
            localStorage.setItem('fb', JSON.stringify(user));
            localStorage.setItem('authToken', user.authToken);
        });




    }


    // pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
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
    //             that._Service.getWarehousePage(dataTablesParameters).subscribe((resp) => {
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
    //             { data: 'id' },
    //             { data: 'name' },
    //             { data: 'status' },
    //             { data: 'create_by' },

    //             { data: 'actice', orderable: false },
    //         ]
    //     };

    // }

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

    signInWithFB(): void {
        // const fbLoginOptions = {
        //     scope: 'publish_video,pages_show_list,pages_messaging,pages_read_engagement,pages_read_user_content,pages_manage_posts,public_profile,email'
        // }; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11

        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);

    }

    signOut(): void {
        this.authService.signOut();
    }

    openPage() {
        // console.log(this.socialUser.authToken)
        // this._Service.getToken(this.socialUser.authToken).subscribe((resp: any) => {
        //     this.tokenData = resp.data
        //     console.log(this.tokenData)
        // })
        const dialogRef = this._matDialog.open(NewComponent, {
            width: '50%',
            height: '50',
        });
        dialogRef.afterClosed().subscribe(() => {
            this.rerender();
            this._changeDetectorRef.markForCheck();
        });
    }






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




    Edit(itemId: string) {
        const dialogRef = this._matDialog.open(EditComponent, {
            width: 'auto%',

            height: 'auto',
            data: {
                itemid: itemId
            }
        });
        dialogRef.afterClosed().subscribe(() => {
            this.rerender();
            this._changeDetectorRef.markForCheck();
        });
    }


    rerender(): void {
        if (this.dtElement) {
            this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
                dtInstance.ajax.reload();
            });
        } else {
        }
    }



    Delete(id) {

        const confirmation = this._fuseConfirmationService.open({
            "title": "ลบสิทธิการลา",
            "message": "คุณต้องการลบสิทธิการลาใช่หรือไม่ ",
            "icon": {
                "show": false,
                "name": "heroicons_outline:exclamation",
                "color": "warning"
            },
            "actions": {
                "confirm": {
                    "show": true,
                    "label": "ยืนยัน",
                    "color": "danger"
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
                            }).afterClosed().subscribe(() => {
                                this.rerender();
                            })
                        }
                    });

            }
        });

    }

}
