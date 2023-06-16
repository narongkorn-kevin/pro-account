import { FacebookLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DataTableDirective } from 'angular-datatables';
import { FbPageService } from '../fb-page.service';
import { NewComponent } from '../new/new.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
    User: any;
    Token: any;

  constructor(
    private _Service: FbPageService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialog: MatDialog,
    private authService: SocialAuthService,
    private _fuseConfirmationService: FuseConfirmationService,

  ) { }

  ngOnInit(): void {
    this.loadTable();
    this.User = JSON.parse(localStorage.getItem('user'));
    this.Token = JSON.parse(localStorage.getItem('fb'));
    console.log('Token',this.Token.name);
  }
  dtOptions: DataTables.Settings = {};
  pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
  dataRow: any[] = [];
  isLoading: boolean = false;
  isLoggedin?: boolean = undefined;

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
                // dataTablesParameters.item_type_id = 1;
                dataTablesParameters.user_id = this.User.id;
                that._Service.getFbpage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow = resp.data
                    console.log('Resp', this.dataRow)
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
                { data: 'name' },
                { data: 'status' },
                
            ]
        };

    }
    openPage() {
      // console.log(this.socialUser.authToken)
      // this._Service.getToken(this.socialUser.authToken).subscribe((resp: any) => {
      //     this.tokenData = resp.data
      //     console.log(this.tokenData)
      // })
      const dialogRef = this._matDialog.open(NewComponent, {
          width: '50%',
          height: '50%',
      });
      dialogRef.afterClosed().subscribe(() => {
          //this.rerender();
          this._changeDetectorRef.markForCheck();
      });
  }
  signInWithFB(): void {
    // const fbLoginOptions = {
    //     scope: 'publish_video,pages_show_list,pages_messaging,pages_read_engagement,pages_read_user_content,pages_manage_posts,public_profile,email'
    // }; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11

    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);

}
flashErrorMessage: string;
    flashMessage: 'success' | 'error' | null = null;
delete(id: any): void {
    this.flashMessage = null;
    this.flashErrorMessage = null;
    // Return if the form is invalid
    // if (this.formData.invalid) {
    //     return;
    // }
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
        title: 'Delete',
        message: 'คุณต้องการลบรายการใช่หรือไม่ ',
        icon: {
            show: true,
            name: 'heroicons_outline:exclamation',
            color: 'warning',
        },
        actions: {
            confirm: {
                show: true,
                label: 'ยืนยัน',
                color: 'primary',
            },
            cancel: {
                show: true,
                label: 'ยกเลิก',
            },
        },
        dismissible: true,
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
        // If the confirm button pressed...
        if (result === 'confirmed') {
            this._Service.deletePage(id).subscribe({
                next: (resp) => {
                    this.rerender();
                },
                error: (err) => {
                    this._fuseConfirmationService.open({
                        title: 'กรุณาระบุข้อมูล',
                        message: err.error.message,
                        icon: {
                            show: true,
                            name: 'heroicons_outline:exclamation',
                            color: 'warning',
                        },
                        actions: {
                            confirm: {
                                show: false,
                                label: 'ยืนยัน',
                                color: 'primary',
                            },
                            cancel: {
                                show: false,
                                label: 'ยกเลิก',
                            },
                        },
                        dismissible: true,
                    });
                },
            });
        }
    });
}
@ViewChild(DataTableDirective)
    dtElement!: DataTableDirective;

    rerender(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.ajax.reload();
        });
    }

}
