import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataTableDirective } from 'angular-datatables';
import { PageService } from '../page.service';
import { ProductControlComponent } from '../product-control/product-control.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @ViewChild(DataTableDirective)
  dtElement!: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dataRow: any[];
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _Service: PageService,
    private _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadTable();
    // alert(1);
  }
  pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 };
  loadTable(): void {
    const that = this;

    this.dtOptions = {
      order: [[0, 'desc']],
      pagingType: 'full_numbers',
      pageLength: 100,
      serverSide: true,
      processing: true,
      responsive: true,
      // language: {
      // url: 'https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json',
      // },

      ajax: (dataTablesParameters: any, callback) => {

        dataTablesParameters.item_type_id = null;
        dataTablesParameters.set_type = "normal";
        this._Service
          .getPage1(dataTablesParameters)
          .subscribe((resp) => {
            console.log(resp.data,'resp');
            this.dataRow = resp.data;
            this.pages.current_page = resp.current_page;
            this.pages.last_page = resp.last_page;
            this.pages.per_page = resp.per_page;
            if (resp.current_page > 1) {
              this.pages.begin =
                resp.per_page * resp.current_page - 1;
            } else {
              this.pages.begin = 0;
            }

            callback({
              recordsTotal: resp.total,
              recordsFiltered: resp.total,
              data: [],
            });
            this._changeDetectorRef.markForCheck();
          });
      },
      columns: [

        { data: 'No' },
        { data: 'name' },
        { data: 'email' },
        { data: 'tel' },
        { data: 'company' },
        { data: 'customer_typ' },
        { data: 'customer_typ' },
        { data: 'customer_typ' },
        { data: 'customer_typ',width:"8%" },
        { data: 'customer_typ',width:"10%"},
        { data: 'actice', orderable: false },
      ]
    };
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.ajax.reload();
    });
  }
  Addproduct(id:any): void {
    console.log(id, "test id");
    this._matDialog
      .open(ProductControlComponent, {
        disableClose: false,
        autoFocus: false,
        height: "50%",
        //recive brandId
        data: { Id: id },
      })
      .afterClosed()
      .subscribe((res) => {
        console.log(res);
        /**ถ้าส่ง successfull มาจะทำการรีโหลดตาราง */
        if (res === "successfull") {
          //this.rerender();
          // this._brandService.getPermission().subscribe();
        }
      });
  }

}

