import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { SettingShopService } from '../setting-shop.service';
import { TranChangeComponent } from '../tran-change/tran-change.component';

@Component({
  selector: 'app-tran-list',
  templateUrl: './tran-list.component.html',
  styleUrls: ['./tran-list.component.scss']
})
export class TranListComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  dataRow: any[] = [];
  deliverData:any;

  constructor(
    private _Service: SettingShopService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialog: MatDialog,
    //private authService: SocialAuthService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _dialogRef: MatDialogRef<TranListComponent>,
  ) { }

  ngOnInit(): void {
    this.loadTable();
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
        // dataTablesParameters.user_id = this.User.id;
        that._Service.getlistDeliver(dataTablesParameters).subscribe((resp) => {
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
        { data: 'image' },
        { data: 'name' },
        // { data: 'status' },

      ]
    };

  }
  updateTran(): void {
    const dialogRef = this._matDialog.open(TranChangeComponent, {
      // width: '100%',
      // height: '650px',
      // data: data

    })
    dialogRef.afterClosed().subscribe(res => {
      this._dialogRef.close(res);
      
    })
  }

}
