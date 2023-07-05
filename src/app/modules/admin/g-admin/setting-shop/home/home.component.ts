import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { DataTableDirective } from 'angular-datatables';
import { EditComponent } from '../edit/edit.component';
import { OriginComponent } from '../origin/origin.component';
import { SettingShopService } from '../setting-shop.service';
import { TranChangeComponent } from '../tran-change/tran-change.component';
import { TranListComponent } from '../tran-list/tran-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dtOptions1: DataTables.Settings = {};
  dtOptions2: DataTables.Settings = {};
  dataRow1: any[] = [];
  dataRow2: any[] = [];
  Userdata:any;
  User_Id:any;
 
  

  constructor(
    private _Service: SettingShopService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialog: MatDialog,
    //private authService: SocialAuthService,
    private _fuseConfirmationService: FuseConfirmationService,
    // private _dialogRef: MatDialogRef<TranChangeComponent>,
  ) { }

  ngOnInit(): void {
    this.User_Id = JSON.parse(localStorage.getItem('user'));
     this._Service.UserData().subscribe((resp)=>{
      this.Userdata = resp
      console.log('User',this.Userdata);
     })
     
     this.loadTable2();
     this.loadTable1();
     
  }
  listTran(): void {
    const dialogRef = this._matDialog.open(TranListComponent, {
      width: '1000px',
      // height: '650px',
      // data: data

    })
    dialogRef.afterClosed().subscribe(res => {
      window.location.reload();
      console.log('res',res);
      // this.Userdata = res;
    })
  }
  Address(): void {
    const dialogRef = this._matDialog.open(OriginComponent, {
      width: '1000px',
      // height: '650px',
      // data: data

    })
    dialogRef.afterClosed().subscribe(response => {
      window.location.reload();
    })
  }
  pages1 = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
  pages2 = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
  loadTable2(): void {
    const that = this;
    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      language: {
        "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
      },
      ajax: (dataTablesParameters: any, callback) => {
        console.log('Test');
        // dataTablesParameters.item_type_id = 1;
        dataTablesParameters.user_id = this.User_Id.id;
        that._Service.getAddressPage(dataTablesParameters).subscribe((resp) => {
          this.dataRow2 = resp.data
          console.log('Resp', this.dataRow2)
          this.pages1.current_page = resp.current_page;
          this.pages1.last_page = resp.last_page;
          this.pages1.per_page = resp.per_page;
          if (resp.current_page > 1) {
              this.pages1.begin = resp.per_page * resp.current_page - 1;
          } else {
              this.pages1.begin = 0;
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
        
        { data: 'id',width:"10%" },
        { data: 'image',width:"20%" },
        { data: 'name',width:"30%" },
        { data: 'status',width:"30%" },

      ]
    };

  }
  loadTable1(): void {
    const that = this;
    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      language: {
        "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
      },
      ajax: (dataTablesParameters: any, callback) => {
        console.log('Test');
        // dataTablesParameters.item_type_id = 1;
        // dataTablesParameters.user_id = this.User.id;
        that._Service.getlistDeliver(dataTablesParameters).subscribe((resp) => {
          this.dataRow1 = resp.data
          console.log('Resp1', this.dataRow1)
          this.pages2.current_page = resp.current_page;
          this.pages2.last_page = resp.last_page;
          this.pages2.per_page = resp.per_page;
          if (resp.current_page > 1) {
              this.pages2.begin = resp.per_page * resp.current_page - 1;
          } else {
              this.pages2.begin = 0;
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
        { data: 'image' },
        { data: 'name' },
        // { data: 'status' },

      ]
    };

  }
  flashErrorMessage: string;
  flashMessage: "success" | "error" | null = null;
  updateTran(): void {
    const dialogRef = this._matDialog.open(TranChangeComponent, {
      // width: '100%',
      // height: '650px',
      // data: data

    })
    dialogRef.afterClosed().subscribe(res => {
      window.location.reload()
      // this.rerender();
      // this._dialogRef.close(res);
      
    })
  }
  openUpdateDialog(id:any): void {
    const dialogRef = this._matDialog.open(EditComponent, {
      // width: '100%',
      // height: '650px',
      data:{ pageId: id}

    })
    dialogRef.afterClosed().subscribe(res => {
       window.location.reload()
      // this.rerender();
      // this._dialogRef.close(res);
      
    })
  }
  delete(id: any): void {
    this.flashMessage = null;
    this.flashErrorMessage = null;
    // Return if the form is invalid
    // if (this.formData.invalid) {
    //     return;
    // }
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: "ลบรายการ",
      message: "คุณต้องการลบรายการใช่หรือไม่ ",
      icon: {
        show: true,
        name: "heroicons_outline:exclamation",
        color: "warning",
      },
      actions: {
        confirm: {
          show: true,
          label: "ยืนยัน",
          color: "primary",
        },
        cancel: {
          show: true,
          label: "ยกเลิก",
        },
      },
      dismissible: true,
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === "confirmed") {
        this._Service.deleteAddress(id).subscribe({
          next: (resp) => {
            window.location.reload();
          },
          error: (err) => {
            this._fuseConfirmationService.open({
              title: "กรุณาระบุข้อมูล",
              message: err.error.message,
              icon: {
                show: true,
                name: "heroicons_outline:exclamation",
                color: "warning",
              },
              actions: {
                confirm: {
                  show: false,
                  label: "ยืนยัน",
                  color: "primary",
                },
                cancel: {
                  show: false,
                  label: "ยกเลิก",
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
