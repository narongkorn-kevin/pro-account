import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { sortBy, startCase } from 'lodash-es';
import { AssetType, BranchPagination } from '../page.types';
import { PageService } from '../page.service';
// import { ImportOSMComponent } from '../card/import-osm/import-osm.component';\
import {
    SocialAuthService,
    FacebookLoginProvider,
    SocialUser,
} from '@abacritt/angularx-social-login';

@Component({
    selector: 'new',
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.scss'],

    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})

export class NewComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    public dataRow: any[];
    public dtOptions: DataTables.Settings = {};
    formData: FormGroup
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;

    // me: any | null;
    // get roleType(): string {
    //     return 'marketing';
    // }
    loginForm!: FormGroup;
    socialUser!: SocialUser;
    isLoggedin?: boolean = undefined;
    userData: any;
    pageData: any;
    supplierId: string | null;
    pagination: BranchPagination;

    /**
     * Constructor
     */
    constructor(
        public dialogRef: MatDialogRef<NewComponent>,
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: FormBuilder,
        private _Service: PageService,
        private _matDialog: MatDialog,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private authService: SocialAuthService,
    ) {

        this.formData = this._formBuilder.group({
            pic: '',
            name: '',
            id: '',
            token_user: '',
        })

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {


        this.authService.authState.subscribe((user) => {
            this.socialUser = user;
            this.isLoggedin = user != null;
            console.log(user)
        });
        this._Service.getTokenUser(this.socialUser.authToken).subscribe((resp: any) => {

            this.userData = resp
            // this.formData.patchValue({
            //     name: this.userData[0].name,
            //     id: this.userData[0].id,
            //     pic: this.userData[0].picture.data.url,
            //     token_user: this.userData[0].access_token,
            // })
            // console.log('ข้อมูลPage', this.userData)

            // ------ส่วนแสดงlivesteam list-----

            this._Service.getTokenPage(this.socialUser.authToken, this.formData.value.id).subscribe((resp: any) => {
                this.pageData = resp

                console.log('ข้อมูล', resp)
            })
        })



        // this.loadTable();

        // this.loadTable();

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
    //             that._Service.getPage(dataTablesParameters).subscribe((resp: any) => {
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
    //             { data: 'pic' },


    //         ]
    //     };

    // }

    onClose() {
        this.dialogRef.close();
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

    }


    live(data: any): void {

        this._Service.getPageToken(data.id).subscribe({
            next: (resp) => {

                localStorage.setItem('pageToken', data.access_token);

                this._router.navigate(['livesteam/livemag/' + data.id]);
                this.onClose();

            },
        })


    }

    live2(id: string): void {
        console.log('pageId', id);
        window.open('chat?page_id=' + id);
        // this._router.navigate(['chat/chats' + id]);
        this.onClose();

    }


    New(): void {
        this.flashMessage = null;
        this.flashErrorMessage = null;
        const confirmation = this._fuseConfirmationService.open({
            "title": "สร้างประเภทวันลาใหม่",
            "message": "คุณต้องการสร้างประเภทวันลาใหม่ใช่หรือไม่ ?",
            "icon": {
                "show": true,
                "name": 'heroicons_outline:plus-circle',
                "color": 'info',
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
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                console.log(this.formData.value);
                let formValue = this.formData.value;

                this._Service.newLeave(formValue).subscribe(
                    {
                        next: (resp: any) => {
                            this.dialogRef.close()
                        },
                        error: (err: any) => {
                            this._fuseConfirmationService.open({
                                "title": "กรุณาระบุข้อมูล",
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
                )
            }
        });
    }
}
