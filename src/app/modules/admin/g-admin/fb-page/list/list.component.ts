import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FbPageService } from '../fb-page.service';
import { NewComponent } from '../new/new.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(
    private _Service: FbPageService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _matDialog: MatDialog,


  ) { }

  ngOnInit(): void {
    this.loadTable();
  }
  dtOptions: DataTables.Settings = {};
  pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }
  dataRow: any[] = [];
  isLoading: boolean = false;

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
                //dataTablesParameters.user_ref_id = this.user.user_id;
                that._Service.getFbpage(dataTablesParameters).subscribe((resp) => {
                    this.dataRow = resp.data
                    console.log(resp)
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

}
