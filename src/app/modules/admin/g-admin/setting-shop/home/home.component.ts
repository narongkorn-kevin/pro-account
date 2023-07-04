import { SocialAuthService } from '@abacritt/angularx-social-login';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
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

  constructor(
    private _Service: SettingShopService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialog: MatDialog,
    //private authService: SocialAuthService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) { }

  ngOnInit(): void {
     this._Service.UserData().subscribe((resp)=>{
      this.Userdata = resp
      console.log('User',this.Userdata);
     })
  }
  listTran(): void {
    const dialogRef = this._matDialog.open(TranListComponent, {
      width: '1000px',
      // height: '650px',
      // data: data

    })
    dialogRef.afterClosed().subscribe(res => {
    })
  }

}
