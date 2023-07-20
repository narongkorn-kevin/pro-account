import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ItemMoneyComponent } from '../item-money/item-money.component';
import { ItemService } from '../item.service';
import { Item } from '../item.types';

@Component({
  selector: 'app-item-set',
  templateUrl: './item-set.component.html',
  styleUrls: ['./item-set.component.scss']
})
export class ItemSetComponent implements OnInit {

  dtOptions: DataTables.Settings = {};
  items: Item[] = [];
  formData: FormGroup;
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _Service: ItemService,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
    private matDialogRef: MatDialogRef<ItemSetComponent>,
  ) {
    this.formData = this._formBuilder.group({
      item_id: '',
      qty: '',
      price: '',
      total: ''
    })
  }
  user: any;
  myArray: any[] = [];

  ngOnInit(): void {
    this.loadTable()
    this.user = JSON.parse(localStorage.getItem("user"));
  }
  pages = { current_page: 1, last_page: 1, per_page: 10, begin: 0 }

  loadTable() {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      order: [[5, 'desc']],
      language: {
        "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/th.json"
      },
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.item_type_id = null;
        dataTablesParameters.set_type = 'normal';
        dataTablesParameters.user_id = this.user.id;
        that._Service.getItem(dataTablesParameters).subscribe((resp) => {
          this.items = resp.data
          console.log(this.items)
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
        { data: 'id' },
        { data: 'item.item_id' },
        { data: 'item.name' },
        { data: 'stock' },
        { data: 'qty' },
        // { data: 'qty' },
        // { data: 'qty' },

        { data: 'actice', orderable: false },
      ]
    };
  }
  addSetItem() {
    this.matDialogRef.close(this.myArray);
  }
  openMoneyDialog(id:any): void {
    //console.log(id, "test id");
    this._matDialog
      .open(ItemMoneyComponent, {
        disableClose: false,
        autoFocus: false,
        // height: "80%",
        width:'50%',
        data: id
        //recive brandId
        // data: { userId: id },
      })
      .afterClosed()
      .subscribe((res) => {
        
        this.myArray.push(res);
        console.log('Myarray', this.myArray);
        /**ถ้าส่ง successfull มาจะทำการรีโหลดตาราง */
        
      });
  }

}
