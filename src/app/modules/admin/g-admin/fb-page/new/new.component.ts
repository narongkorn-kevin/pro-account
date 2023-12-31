import { SocialUser, SocialAuthService } from '@abacritt/angularx-social-login';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { Subject } from 'rxjs';
import { BranchPagination } from '../../item-type/item-type.types';
import { ItemService } from '../../item/item.service';
import { PageService } from '../../livesteam/page.service';
import { FbPageService } from '../fb-page.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;
    public dataRow: any[];
    public dtOptions: DataTables.Settings = {};
    formData: FormGroup
    formData1: FormGroup
    flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
    isLoading: boolean = false;
    searchInputControl: FormControl = new FormControl();
    selectedProduct: any | null = null;
    filterForm: FormGroup;
    tagsEditMode: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    env_path = environment.API_URL;
    pageId: string;
    User: any;
    liveStream: any;
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
        private _authService: AuthService,
        private authService: SocialAuthService,
        private _activatedRoute: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private itemService: ItemService
    ) {

        this.formData = this._formBuilder.group({
            pic: '',
            name: '',
            id: '',
            token_user: '',
        })
        this.formData1 = this._formBuilder.group({
            user_id: '',
            page_id: '',
            name: '',
            token: '',
            image: '',
        })

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.pageId = this._activatedRoute.snapshot.paramMap.get('id');
        this.User = JSON.parse(localStorage.getItem('user'));
        console.log('Thissssss',this.User);
       
        this.authService.authState.subscribe((user) => {
            this.socialUser = user;
            this.isLoggedin = user != null;
            console.log(user,'User');
            this._Service.getTokenUser(this.socialUser.authToken).subscribe((resp: any) => {
                console.log(resp,'tessssss');

                this.userData = resp.data
                console.log('userData',this.userData);
                // this.formData.patchValue({
                //     name: this.userData[0].name,
                //     id: this.userData[0].id,
                //     pic: this.userData[0].picture.data.url,
                //     token_user: this.userData[0].access_token,
                // })
                // console.log('ข้อมูลPage', this.userData)

                // ------ส่วนแสดงlivesteam list-----

                // this._Service.getTokenPage(this.socialUser.authToken, this.formData.value.id).subscribe((resp: any) => {
                //     this.pageData = resp

                //     console.log('ข้อมูล', resp)
                // })
            });
        });

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
    
    addPage(i:any){
        this.formData1.patchValue({
            user_id: this.User.id,
            // ...this.userData[i]
            page_id: this.userData[i].id,
            name: this.userData[i].name,
            token: this.userData[i].access_token,
            image: this.userData[i].picture.data.url,
        })
        this._Service.newPage( this.formData1.value).subscribe((resp: any)=>{
            this.dialogRef.close(resp);
            
        })
    }
}
