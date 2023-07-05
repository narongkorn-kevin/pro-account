import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { OriginComponent } from '../origin/origin.component';
import { SettingShopService } from '../setting-shop.service';
import { TranListComponent } from '../tran-list/tran-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dataRow: any[] = [];
  Userdata:any;
  User_Id:any;
  

  constructor(
    private _Service: SettingShopService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialog: MatDialog,
    //private authService: SocialAuthService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) { }

  ngOnInit(): void {
    this.User_Id = JSON.parse(localStorage.getItem('user'));
     this._Service.UserData().subscribe((resp)=>{
      this.Userdata = resp
      console.log('User',this.Userdata);
     })
     this.loadTable();
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
    })
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
        console.log('Test');
        // dataTablesParameters.item_type_id = 1;
        dataTablesParameters.user_id = this.User_Id.id;
        that._Service.getAddressPage(dataTablesParameters).subscribe((resp) => {
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
        
        { data: 'id',width:"10%" },
        { data: 'image',width:"20%" },
        { data: 'name',width:"30%" },
        { data: 'status',width:"30%" },

      ]
    };

  }
  flashErrorMessage: string;
  flashMessage: "success" | "error" | null = null;
  

}
